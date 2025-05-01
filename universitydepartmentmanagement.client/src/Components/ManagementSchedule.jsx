

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import Navbar from './Navbar';
import '../CSS/ManagementSchedule.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);
const semesters = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Spring', value: 'Spring' }
];
const grades = [
    { label: 'Grade 1', value: 1 },
    { label: 'Grade 2', value: 2 },
    { label: 'Grade 3', value: 3 },
    { label: 'Grade 4', value: 4 }
];

const ManagementSchedule = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [formData, setFormData] = useState({
        lectureId: '',
        day: 0,
        startTime: '8:00',
        endTime: '9:00',
        grade: 1,
        semester: 'Fall'
    });
    const [filter, setFilter] = useState({
        grade: 1,
        semester: 'Fall'
    });
    const [error, setError] = useState('');
    const [conflictDetails, setConflictDetails] = useState(null);
    const [mode, setMode] = useState('add');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchLectures();
        fetchClassrooms();
        fetchFilteredSchedule();
    }, [filter]);

    const fetchFilteredSchedule = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/LectureScheduleManagement/filtered-lecture-schedules', {
                params: {
                    grade: filter.grade,
                    semester: filter.semester
                }
            });
            setScheduleData(res.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
            showToast('error', 'Error', 'Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    const fetchLectures = async () => {
        try {
            const res = await axios.get('/api/Lecture');
            setLectures(res.data);
        } catch (error) {
            console.error("Error fetching lectures:", error);
            showToast('error', 'Error', 'Failed to load lectures');
        }
    };

    const fetchClassrooms = async () => {
        try {
            const res = await axios.get('/api/ClassroomManagement');
            setClassrooms(res.data);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
            showToast('error', 'Error', 'Failed to load classrooms');
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({
            severity,
            summary,
            detail,
            life: 3000,
            style: {
                borderLeft: severity === 'error' ? '4px solid #f44336' :
                    severity === 'success' ? '4px solid #4caf50' : '4px solid #2196F3'
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setConflictDetails(null);
        setSubmitting(true);

        if (!formData.lectureId) {
            setError('Please select a lecture');
            setSubmitting(false);
            return;
        }

        const startHour = parseInt(formData.startTime.split(':')[0]);
        const endHour = parseInt(formData.endTime.split(':')[0]);

        if (startHour >= endHour) {
            setError('End time must be after start time');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('/api/LectureScheduleManagement/add-lecture-schedule', {
                lectureId: parseInt(formData.lectureId),
                day: parseInt(formData.day),
                startTime: `${formData.startTime}:00`,
                endTime: `${formData.endTime}:00`,
                grade: formData.grade,
                semester: formData.semester
            });

            if (response.status === 200) {
                fetchFilteredSchedule();
                showToast('success', 'Success',
                    `Lecture added to ${response.data.classroomName} at ${formData.startTime}-${formData.endTime}`);
                resetForm();
            }
        } catch (err) {
            if (err.response?.status === 400) {
                showToast('error', 'Schedule Conflict', 'This lecture cannot be added due to a scheduling conflict');

                if (err.response?.data) {
                    setConflictDetails({
                        message: 'The classroom is already occupied during the requested time slot.',
                        conflicts: err.response.data.Conflicts || [],
                        classroom: err.response.data.ClassroomName || 'Unknown',
                        requestedTime: `${formData.startTime}-${formData.endTime}`,
                        requestedDay: daysOfWeek[formData.day]
                    });
                }
            } else {
                showToast('error', 'Error', 'Failed to add lecture. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            lectureId: '',
            day: 0,
            startTime: '8:00',
            endTime: '9:00',
            grade: 1,
            semester: 'Fall'
        });
    };

    const handleRemove = (scheduleId) => {
        confirmDialog({
            message: 'Are you sure you want to remove this lecture from the schedule?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: async () => {
                try {
                    await axios.delete(`/api/LectureScheduleManagement/delete-lecture-schedule/${scheduleId}`);
                    fetchFilteredSchedule();
                    showToast('success', 'Success', 'Lecture removed from schedule');
                } catch (error) {
                    console.log("Error:", error);
                    showToast('error', 'Error', 'Failed to remove lecture');
                }
            },
            reject: () => {
                showToast('info', 'Info', 'Operation canceled');
            }
        });
    };

    const getLecturesForSlot = (dayIndex, hour) => {
        return scheduleData.filter((lecture) => {
            const start = parseInt(lecture.startTime.split(':')[0]);
            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
        });
    };

    const isSlotOccupied = (dayIndex, hour) => {
        return scheduleData.some(lecture => {
            const start = parseInt(lecture.startTime.split(':')[0]);
            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
        });
    };

    const getClassroomForLecture = (lectureId) => {
        const lecture = lectures.find(l => l.id === lectureId);
        if (!lecture) return null;
        return classrooms.find(c => c.id === lecture.classroomId);
    };

    const getClassroomName = (lectureId) => {
        const classroom = getClassroomForLecture(lectureId);
        return classroom ? classroom.name : 'Unknown';
    };

    const renderConflictDialog = () => {
        if (!conflictDetails) return null;

        return (
            <Dialog
                header={<div className="flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-2" style={{ color: '#f44336' }} />
                    <span>Schedule Conflict</span>
                </div>}
                visible={!!conflictDetails}
                style={{ width: '50vw' }}
                onHide={() => setConflictDetails(null)}
                footer={
                    <div>
                        <button
                            className="p-button p-component"
                            onClick={() => setConflictDetails(null)}
                        >
                            <i className="pi pi-times mr-2"></i> Close
                        </button>
                    </div>
                }
            >
                <div className="conflict-dialog-content">
                    <div className="conflict-message p-message p-message-error mb-4">
                        <i className="pi pi-exclamation-circle"></i>
                        <span>This lecture cannot be added due to the following conflicts:</span>
                    </div>

                    <div className="conflict-summary p-4 mb-4 surface-card border-round">
                        <h5 className="mt-0 mb-3">Request Details</h5>
                        <div className="grid">
                            <div className="col-6">
                                <div className="flex align-items-center mb-2">
                                    <i className="pi pi-calendar mr-2"></i>
                                    <span><strong>Day:</strong> {conflictDetails.requestedDay}</span>
                                </div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-clock mr-2"></i>
                                    <span><strong>Time:</strong> {conflictDetails.requestedTime}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="flex align-items-center mb-2">
                                    <i className="pi pi-building mr-2"></i>
                                    <span><strong>Classroom:</strong> {conflictDetails.classroom}</span>
                                </div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-users mr-2"></i>
                                    <span><strong>Semester:</strong> {formData.semester}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {conflictDetails.conflicts.length > 0 && (
                        <div className="conflict-list mb-4">
                            <h5 className="mb-3">Existing Conflicts:</h5>
                            <div className="grid">
                                {conflictDetails.conflicts.map((conflict, index) => (
                                    <div key={index} className="col-12">
                                        <div className="conflict-item p-3 mb-2 surface-card border-round">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-clock mr-2" style={{ color: '#f44336' }}></i>
                                                <span>{conflict}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="conflict-suggestion p-3 surface-card border-round">
                        <div className="flex align-items-center">
                            <i className="pi pi-info-circle mr-2" style={{ color: '#2196F3' }}></i>
                            <span>Please choose a different time slot or classroom for this lecture.</span>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    };

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <ConfirmDialog />
            {renderConflictDialog()}

            <div className="schedule-page-container">
                <div className="schedule-header glass-card">
                    <div className="header-left">
                        <h2 className="page-title">Lecture Program</h2>
                        <div className="filter-controls">
                            <div className="filter-item">
                                <label>Grade:</label>
                                <Dropdown
                                    value={filter.grade}
                                    options={grades}
                                    optionLabel="label"
                                    onChange={(e) => setFilter({ ...filter, grade: e.value })}
                                    placeholder="Select Grade"
                                    className="grade-dropdown"
                                />
                            </div>
                            <div className="filter-item">
                                <label>Semester:</label>
                                <SelectButton
                                    value={filter.semester}
                                    options={semesters}
                                    onChange={(e) => setFilter({ ...filter, semester: e.value })}
                                    className="semester-select"
                                />
                            </div>
                        </div>
                    </div>
                    <ToggleButtonGroup type="radio" name="mode" defaultValue="add" className="mode-switch">
                        <ToggleButton
                            id="add-mode"
                            value="add"
                            variant={mode === 'add' ? 'primary' : 'outline-primary'}
                            onClick={() => setMode('add')}
                        >
                            <i className="pi pi-plus-circle mr-2"></i> Add Lecture
                        </ToggleButton>
                        <ToggleButton
                            id="remove-mode"
                            value="remove"
                            variant={mode === 'remove' ? 'danger' : 'outline-danger'}
                            onClick={() => setMode('remove')}
                        >
                            <i className="pi pi-trash mr-2"></i> Remove Lecture
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <div className="schedule-content">
                    <div className="schedule-container glass-card">
                        {loading ? (
                            <div className="loading-spinner">
                                <ProgressSpinner />
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '80px' }}>Time</th>
                                            {daysOfWeek.map((day, i) => (
                                                <th key={i}>{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hours.map((hour, hourIdx) => (
                                            <tr key={hourIdx}>
                                                <td className="time-cell">{hour}</td>
                                                {daysOfWeek.map((_, dayIdx) => {
                                                    const lectures = getLecturesForSlot(dayIdx, hour);
                                                    const isOccupied = isSlotOccupied(dayIdx, hour);
                                                    return (
                                                        <td
                                                            key={dayIdx}
                                                            className={`schedule-cell ${isOccupied ? 'occupied' : ''}`}
                                                        >
                                                            {lectures.map((lec, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="lecture-box"
                                                                    onClick={() => {
                                                                        if (mode === 'remove') {
                                                                            handleRemove(lec.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="lecture-header">
                                                                        <strong>{lec.lecture.name}</strong>
                                                                        <Badge
                                                                            value={lec.lecture.lectureCode}
                                                                            severity="info"
                                                                            className="lecture-badge"
                                                                        />
                                                                    </div>
                                                                    <div className="lecture-details">
                                                                        <div>
                                                                            <i className="pi pi-user"></i>
                                                                            {lec.lecture.user?.fullName || ''}
                                                                        </div>
                                                                        <div>
                                                                            <i className="pi pi-building"></i>
                                                                            {lec.lecture.classroom?.name || ''}
                                                                        </div>
                                                                        <div>
                                                                            <i className="pi pi-users"></i>
                                                                            Grade {lec.grade}
                                                                        </div>
                                                                    </div>
                                                                    {mode === 'remove' && (
                                                                        <div className="remove-overlay">
                                                                            <i className="pi pi-trash"></i> Remove
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {mode === 'add' && (
                        <div className="schedule-form">
                            <Card className="form-card glass-card" title={<span className="form-card-title"><i className="pi pi-plus-circle mr-2"></i> Add New Lecture</span>}>
                                <div className="form-card-body">
                                    {error && (
                                        <div className="p-message p-message-error">
                                            <i className="pi pi-exclamation-circle"></i>
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-field">
                                            <label htmlFor="lectureId">Select Lecture</label>
                                            <Dropdown
                                                id="lectureId"
                                                name="lectureId"
                                                value={formData.lectureId}
                                                options={lectures.map(lecture => ({
                                                    label: `${lecture.name} (${lecture.lectureCode}) - ${getClassroomName(lecture.id)}`,
                                                    value: lecture.id
                                                }))}
                                                onChange={(e) => setFormData({ ...formData, lectureId: e.value })}
                                                placeholder="Select a Lecture"
                                                filter
                                                optionLabel="label"
                                                className="lecture-dropdown"
                                                panelClassName="lecture-dropdown-panel"
                                            />
                                        </div>

                                        <div className="p-field">
                                            <label htmlFor="day">Day:</label>
                                            <Dropdown
                                                id="day"
                                                name="day"
                                                value={formData.day}
                                                options={daysOfWeek.map((day, index) => ({
                                                    label: day,
                                                    value: index
                                                }))}
                                                onChange={(e) => setFormData({ ...formData, day: e.value })}
                                                placeholder="Select a Day"
                                                className="day-dropdown"
                                            />
                                        </div>

                                        <div className="time-fields">
                                            <div className="p-field">
                                                <label htmlFor="startTime">Start Time:</label>
                                                <Dropdown
                                                    id="startTime"
                                                    name="startTime"
                                                    value={formData.startTime}
                                                    options={hours.map(hour => ({
                                                        label: hour,
                                                        value: hour
                                                    }))}
                                                    onChange={(e) => setFormData({ ...formData, startTime: e.value })}
                                                    placeholder="Select Start Time"
                                                    className="time-dropdown"
                                                />
                                            </div>

                                            <div className="p-field">
                                                <label htmlFor="endTime">End Time:</label>
                                                <Dropdown
                                                    id="endTime"
                                                    name="endTime"
                                                    value={formData.endTime}
                                                    options={hours.map(hour => ({
                                                        label: hour,
                                                        value: hour
                                                    }))}
                                                    onChange={(e) => setFormData({ ...formData, endTime: e.value })}
                                                    placeholder="Select End Time"
                                                    className="time-dropdown"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-field">
                                            <label htmlFor="grade">Grade:</label>
                                            <Dropdown
                                                id="grade"
                                                name="grade"
                                                value={formData.grade}
                                                options={grades}
                                                optionLabel="label"
                                                onChange={(e) => setFormData({ ...formData, grade: e.value })}
                                                placeholder="Select Grade"
                                                className="grade-dropdown"
                                            />
                                        </div>

                                        <div className="p-field">
                                            <label htmlFor="semester">Semester:</label>
                                            <SelectButton
                                                id="semester"
                                                name="semester"
                                                value={formData.semester}
                                                options={semesters}
                                                onChange={(e) => setFormData({ ...formData, semester: e.value })}
                                                className="semester-select"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="p-button p-component p-button-primary submit-button"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <i className="pi pi-spin pi-spinner"></i> Checking...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="pi pi-plus"></i> Add Lecture
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManagementSchedule;