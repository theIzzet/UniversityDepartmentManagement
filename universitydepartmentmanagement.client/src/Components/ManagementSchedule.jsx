
//import React, { useEffect, useState, useRef } from 'react';
//import axios from 'axios';
//import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
//import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
//import { Toast } from 'primereact/toast';
//import Navbar from './Navbar';
//import '../CSS/ManagementSchedule.css';

//const daysOfWeek = ['Monday ', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday '/*, 'Saturday ', 'Sunday '*/];
//const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

//const ManagementSchedule = () => {
//    const [scheduleData, setScheduleData] = useState([]);
//    const [lectures, setLectures] = useState([]);
//    const [formData, setFormData] = useState({
//        lectureId: '',
//        day: 0,
//        startTime: '8:00',
//        endTime: '9:00'
//    });
//    const [error, setError] = useState('');
//    const [mode, setMode] = useState('add');
//    const toast = useRef(null);

//    useEffect(() => {
//        fetchSchedule();
//        fetchLectures();
//    }, []);

//    const fetchSchedule = async () => {
//        try {
//            const res = await axios.get('/api/LectureScheduleManagement/all-lecture-schedules');
//            setScheduleData(res.data);
//        } catch (error) {
//            console.error("Error fetching schedule:", error);
//            showToast('error', 'Error', 'Error was occured by installing');
//        }
//    };

//    const fetchLectures = async () => {
//        try {
//            const res = await axios.get('/api/Lecture');
//            setLectures(res.data);
//        } catch (error) {
//            console.error("Error fetching lectures:", error);
//            showToast('error', 'Error ', 'Dersler yüklenirken hata oluþtu');
//        }
//    };

//    const showToast = (severity, summary, detail) => {
//        toast.current.show({ severity, summary, detail, life: 3000 });
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({ ...prev, [name]: value }));
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setError('');

//        if (!formData.lectureId) {
//            setError('Lütfen bir ders seçin');
//            return;
//        }

//        const startHour = parseInt(formData.startTime.split(':')[0]);
//        const endHour = parseInt(formData.endTime.split(':')[0]);

//        if (startHour >= endHour) {
//            setError(' End time must be after start time');
//            return;
//        }

//        try {

//            const requests = [];
//            for (let hour = startHour; hour < endHour; hour++) {
//                const currentStartTime = `${hour}:00`;
//                const currentEndTime = `${hour + 1}:00`;

//                requests.push(
//                    axios.post('/api/LectureScheduleManagement/add-lecture-schedule', {
//                        lectureId: parseInt(formData.lectureId),
//                        day: parseInt(formData.day),
//                        startTime: `${currentStartTime}:00`,
//                        endTime: `${currentEndTime}:00`
//                    })
//                );
//            }


//            const responses = await Promise.all(requests);


//            const allSuccess = responses.every(response => response.status === 200);
//            if (allSuccess) {
//                fetchSchedule();
//                setFormData({
//                    lectureId: '',
//                    day: 0,
//                    startTime: '8:00',
//                    endTime: '9:00'
//                });
//                showToast('success', 'Baþarýlý', 'Ders programýna eklendi');
//            }
//        } catch (err) {
//            setError(err.response?.data || 'Ders eklenirken bir hata oluþtu');
//            showToast('error', 'Hata', err.response?.data || 'Ders eklenirken bir hata oluþtu');
//        }
//    };

//    const handleRemove = (scheduleId) => {
//        confirmDialog({
//            message: 'Bu dersi programdan kaldýrmak istediðinize emin misiniz?',
//            header: 'Onay',
//            icon: 'pi pi-exclamation-triangle',
//            acceptLabel: 'Evet',
//            rejectLabel: 'Hayýr',
//            accept: async () => {
//                try {
//                    await axios.delete(`/api/LectureScheduleManagement/delete-lecture-schedule/${scheduleId}`);
//                    fetchSchedule();
//                    showToast('success', 'Success', 'Lecture Schedule was  removed');
//                } catch (error) {

//                    console.log("",error)
//                    showToast('error', 'Hata', 'Ders kaldýrýlýrken bir hata oluþtu');
//                }
//            },
//            reject: () => {
//                showToast('info', 'Info', 'Process was canceled');
//            }
//        });
//    };

//    const getLecturesForSlot = (dayIndex, hour) => {
//        return scheduleData.filter((lecture) => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
//        });
//    };

//    const isSlotOccupied = (dayIndex, hour) => {
//        return scheduleData.some(lecture => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
//        });
//    };

//    return (
//        <>
//            <Navbar />
//            <Toast ref={toast} />
//            <ConfirmDialog />
//            <div className="schedule-page-container">
//                <div className="schedule-header">
//                    <h2>Lecture Program</h2>
//                    <ToggleButtonGroup type="radio" name="mode" defaultValue="add" className="mode-switch">
//                        <ToggleButton
//                            id="add-mode"
//                            value="add"
//                            variant={mode === 'add' ? 'primary' : 'outline-primary'}
//                            onClick={() => setMode('add')}
//                        >
//                            Add Lecture
//                        </ToggleButton>
//                        <ToggleButton
//                            id="remove-mode"
//                            value="remove"
//                            variant={mode === 'remove' ? 'danger' : 'outline-danger'}
//                            onClick={() => setMode('remove')}
//                        >
//                            Remove Lecture
//                        </ToggleButton>
//                    </ToggleButtonGroup>
//                </div>

//                <div className="schedule-content">
//                    <div className="schedule-container">
//                        <div className="table-responsive">
//                            <table className="schedule-table">
//                                <thead>
//                                    <tr>
//                                        <th style={{ minWidth: '80px' }}>Saat</th>
//                                        {daysOfWeek.map((day, i) => (
//                                            <th key={i}>{day}</th>
//                                        ))}
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    {hours.map((hour, hourIdx) => (
//                                        <tr key={hourIdx}>
//                                            <td>{hour}</td>
//                                            {daysOfWeek.map((_, dayIdx) => {
//                                                const lectures = getLecturesForSlot(dayIdx, hour);
//                                                const isOccupied = isSlotOccupied(dayIdx, hour);
//                                                return (
//                                                    <td
//                                                        key={dayIdx}
//                                                        className={`schedule-cell ${isOccupied ? 'occupied' : ''}`}
//                                                    >
//                                                        {lectures.map((lec, i) => (
//                                                            <div
//                                                                key={i}
//                                                                className="lecture-box"
//                                                                onClick={() => {
//                                                                    if (mode === 'remove') {
//                                                                        handleRemove(lec.id);
//                                                                    }
//                                                                }}
//                                                            >
//                                                                <strong>{lec.lecture.name} - {lec.lecture.lectureCode}</strong><br />
//                                                                {lec.lecture.user?.fullName || ''}<br />
//                                                                {lec.lecture.classroom?.name || ''}
//                                                                {mode === 'remove' && (
//                                                                    <div className="remove-overlay">
//                                                                        <i className="pi pi-trash"></i> Kaldýr
//                                                                    </div>
//                                                                )}
//                                                            </div>
//                                                        ))}
//                                                    </td>
//                                                );
//                                            })}
//                                        </tr>
//                                    ))}
//                                </tbody>
//                            </table>
//                        </div>
//                    </div>

//                    {mode === 'add' && (
//                        <div className="schedule-form">
//                            <div className="form-card">
//                                <div className="form-card-header">
//                                    <h3>Add Lecture</h3>
//                                </div>
//                                <div className="form-card-body">
//                                    {error && <div className="alert alert-danger">{error}</div>}
//                                    <form onSubmit={handleSubmit}>
//                                        <div className="form-group">
//                                            <label>Select Lecture</label>
//                                            <select
//                                                className="form-control"
//                                                name="lectureId"
//                                                value={formData.lectureId}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                <option value="">Select Lecture</option>
//                                                {lectures.map(lecture => (
//                                                    <option key={lecture.id} value={lecture.id}>
//                                                        {lecture.name} - {lecture.lectureCode}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>Day:</label>
//                                            <select
//                                                className="form-control"
//                                                name="day"
//                                                value={formData.day}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {daysOfWeek.map((day, index) => (
//                                                    <option key={index} value={index}>
//                                                        {day}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>Start Time:</label>
//                                            <select
//                                                className="form-control"
//                                                name="startTime"
//                                                value={formData.startTime}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {hours.map((hour, index) => (
//                                                    <option key={index} value={hour}>
//                                                        {hour}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>End Time:</label>
//                                            <select
//                                                className="form-control"
//                                                name="endTime"
//                                                value={formData.endTime}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {hours.map((hour, index) => (
//                                                    <option key={index} value={hour}>
//                                                        {hour}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <button type="submit" className="btn btn-primary">
//                                            Add Lecture
//                                        </button>
//                                    </form>
//                                </div>
//                            </div>
//                        </div>
//                    )}
//                </div>
//            </div>
//        </>
//    );
//};

//export default ManagementSchedule;









//import React, { useEffect, useState, useRef } from 'react';
//import axios from 'axios';
//import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
//import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
//import { Toast } from 'primereact/toast';
//import { Dropdown } from 'primereact/dropdown';
//import { SelectButton } from 'primereact/selectbutton';
//import Navbar from './Navbar';
//import '../CSS/ManagementSchedule.css';

//const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);
//const grades = [1, 2, 3, 4];
//const semesters = [
//    { name: 'Fall', value: 'Fall' },
//    { name: 'Spring', value: 'Spring' }
//];

//const ManagementSchedule = () => {
//    const [scheduleData, setScheduleData] = useState([]);
//    const [lectures, setLectures] = useState([]);
//    const [formData, setFormData] = useState({
//        lectureId: '',
//        day: 0,
//        startTime: '8:00',
//        endTime: '9:00',
//        grade: 1,
//        semester: 'Fall'
//    });
//    const [filter, setFilter] = useState({
//        grade: 1,
//        semester: 'Fall'
//    });
//    const [error, setError] = useState('');
//    const [mode, setMode] = useState('add');
//    const toast = useRef(null);

//    useEffect(() => {
//        fetchSchedule();
//        fetchLectures();
//    }, [filter]);

//    const fetchSchedule = async () => {
//        try {
//            const res = await axios.get('/api/LectureScheduleManagement/all-lecture-schedules', {
//                params: {
//                    grade: filter.grade,
//                    semester: filter.semester
//                }
//            });
//            setScheduleData(res.data);
//        } catch (error) {
//            console.error("Error fetching schedule:", error);
//            showToast('error', 'Error', 'Error occurred while loading schedule');
//        }
//    };

//    const fetchLectures = async () => {
//        try {
//            const res = await axios.get('/api/Lecture');
//            setLectures(res.data);
//        } catch (error) {
//            console.error("Error fetching lectures:", error);
//            showToast('error', 'Error', 'Error occurred while loading lectures');
//        }
//    };

//    const showToast = (severity, summary, detail) => {
//        toast.current.show({ severity, summary, detail, life: 3000 });
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({ ...prev, [name]: value }));
//    };

//    //const handleFilterChange = (e) => {
//    //    const { name, value } = e.target;
//    //    setFilter(prev => ({ ...prev, [name]: value }));
//    //};

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setError('');

//        if (!formData.lectureId) {
//            setError('Please select a lecture');
//            return;
//        }

//        const startHour = parseInt(formData.startTime.split(':')[0]);
//        const endHour = parseInt(formData.endTime.split(':')[0]);

//        if (startHour >= endHour) {
//            setError('End time must be after start time');
//            return;
//        }

//        try {
//            const requests = [];
//            for (let hour = startHour; hour < endHour; hour++) {
//                const currentStartTime = `${hour}:00`;
//                const currentEndTime = `${hour + 1}:00`;

//                requests.push(
//                    axios.post('/api/LectureScheduleManagement/add-lecture-schedule', {
//                        lectureId: parseInt(formData.lectureId),
//                        day: parseInt(formData.day),
//                        startTime: `${currentStartTime}:00`,
//                        endTime: `${currentEndTime}:00`,
//                        grade: formData.grade,
//                        semester: formData.semester
//                    })
//                );
//            }

//            const responses = await Promise.all(requests);
//            const allSuccess = responses.every(response => response.status === 200);

//            if (allSuccess) {
//                fetchSchedule();
//                setFormData(prev => ({
//                    ...prev,
//                    lectureId: '',
//                    day: 0,
//                    startTime: '8:00',
//                    endTime: '9:00'
//                }));
//                showToast('success', 'Success', 'Lecture added to schedule');
//            }
//        } catch (err) {
//            setError(err.response?.data || 'Error occurred while adding lecture');
//            showToast('error', 'Error', err.response?.data || 'Error occurred while adding lecture');
//        }
//    };

//    const handleRemove = (scheduleId) => {
//        confirmDialog({
//            message: 'Are you sure you want to remove this lecture from the schedule?',
//            header: 'Confirmation',
//            icon: 'pi pi-exclamation-triangle',
//            acceptLabel: 'Yes',
//            rejectLabel: 'No',
//            accept: async () => {
//                try {
//                    await axios.delete(`/api/LectureScheduleManagement/delete-lecture-schedule/${scheduleId}`);
//                    fetchSchedule();
//                    showToast('success', 'Success', 'Lecture removed from schedule');
//                } catch (error) {
//                    console.error("Error:", error);
//                    showToast('error', 'Error', 'Error occurred while removing lecture');
//                }
//            },
//            reject: () => {
//                showToast('info', 'Info', 'Operation cancelled');
//            }
//        });
//    };

//    const getLecturesForSlot = (dayIndex, hour) => {
//        return scheduleData.filter((lecture) => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
//        });
//    };

//    const isSlotOccupied = (dayIndex, hour) => {
//        return scheduleData.some(lecture => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            return lecture.day === dayIndex && start === parseInt(hour.split(':')[0]);
//        });
//    };

//    const getSemesterColor = (semester) => {
//        return semester === 'Fall' ? '#ff7f50' : '#4caf50';
//    };

//    return (
//        <>
//            <Navbar />
//            <Toast ref={toast} />
//            <ConfirmDialog />
//            <div className="schedule-page-container">
//                <div className="schedule-header">
//                    <div className="header-left">
//                        <h2>Lecture Program</h2>
//                        <div className="filter-controls">
//                            <div className="filter-group">
//                                <label>Grade:</label>
//                                <Dropdown
//                                    value={filter.grade}
//                                    options={grades.map(g => ({ label: `Grade ${g}`, value: g }))}
//                                    onChange={(e) => setFilter(prev => ({ ...prev, grade: e.value }))}
//                                    placeholder="Select Grade"
//                                />
//                            </div>
//                            <div className="filter-group">
//                                <label>Semester:</label>
//                                <SelectButton
//                                    value={filter.semester}
//                                    options={semesters}
//                                    onChange={(e) => setFilter(prev => ({ ...prev, semester: e.value }))}
//                                    itemTemplate={(option) => (
//                                        <span style={{ color: getSemesterColor(option.value) }}>
//                                            {option.name}
//                                        </span>
//                                    )}
//                                />
//                            </div>
//                        </div>
//                    </div>
//                    <ToggleButtonGroup type="radio" name="mode" defaultValue="add" className="mode-switch">
//                        <ToggleButton
//                            id="add-mode"
//                            value="add"
//                            variant={mode === 'add' ? 'primary' : 'outline-primary'}
//                            onClick={() => setMode('add')}
//                        >
//                            Add Lecture
//                        </ToggleButton>
//                        <ToggleButton
//                            id="remove-mode"
//                            value="remove"
//                            variant={mode === 'remove' ? 'danger' : 'outline-danger'}
//                            onClick={() => setMode('remove')}
//                        >
//                            Remove Lecture
//                        </ToggleButton>
//                    </ToggleButtonGroup>
//                </div>

//                <div className="schedule-content">
//                    <div className="schedule-container">
//                        <div className="semester-indicator" style={{ backgroundColor: getSemesterColor(filter.semester) }}>
//                            {filter.semester} Semester - Grade {filter.grade}
//                        </div>
//                        <div className="table-responsive">
//                            <table className="schedule-table">
//                                <thead>
//                                    <tr>
//                                        <th style={{ minWidth: '80px' }}>Time</th>
//                                        {daysOfWeek.map((day, i) => (
//                                            <th key={i}>{day}</th>
//                                        ))}
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    {hours.map((hour, hourIdx) => (
//                                        <tr key={hourIdx}>
//                                            <td>{hour}</td>
//                                            {daysOfWeek.map((_, dayIdx) => {
//                                                const lectures = getLecturesForSlot(dayIdx, hour);
//                                                const isOccupied = isSlotOccupied(dayIdx, hour);
//                                                return (
//                                                    <td
//                                                        key={dayIdx}
//                                                        className={`schedule-cell ${isOccupied ? 'occupied' : ''}`}
//                                                    >
//                                                        {lectures.map((lec, i) => (
//                                                            <div
//                                                                key={i}
//                                                                className="lecture-box"
//                                                                style={{
//                                                                    borderLeft: `4px solid ${getSemesterColor(lec.semester)}`,
//                                                                    background: `linear-gradient(to right, ${getSemesterColor(lec.semester)}20, #e7f1ff)`
//                                                                }}
//                                                                onClick={() => {
//                                                                    if (mode === 'remove') {
//                                                                        handleRemove(lec.id);
//                                                                    }
//                                                                }}
//                                                            >
//                                                                <strong>{lec.lecture.name} - {lec.lecture.lectureCode}</strong><br />
//                                                                {lec.lecture.user?.fullName || ''}<br />
//                                                                {lec.lecture.classroom?.name || ''}
//                                                                {mode === 'remove' && (
//                                                                    <div className="remove-overlay">
//                                                                        <i className="pi pi-trash"></i> Remove
//                                                                    </div>
//                                                                )}
//                                                            </div>
//                                                        ))}
//                                                    </td>
//                                                );
//                                            })}
//                                        </tr>
//                                    ))}
//                                </tbody>
//                            </table>
//                        </div>
//                    </div>

//                    {mode === 'add' && (
//                        <div className="schedule-form">
//                            <div className="form-card">
//                                <div className="form-card-header">
//                                    <h3>Add Lecture</h3>
//                                </div>
//                                <div className="form-card-body">
//                                    {error && <div className="alert alert-danger">{error}</div>}
//                                    <form onSubmit={handleSubmit}>
//                                        <div className="form-group">
//                                            <label>Select Lecture</label>
//                                            <select
//                                                className="form-control"
//                                                name="lectureId"
//                                                value={formData.lectureId}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                <option value="">Select Lecture</option>
//                                                {lectures.map(lecture => (
//                                                    <option key={lecture.id} value={lecture.id}>
//                                                        {lecture.name} - {lecture.lectureCode}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>For Grade:</label>
//                                            <Dropdown
//                                                value={formData.grade}
//                                                options={grades.map(g => ({ label: `Grade ${g}`, value: g }))}
//                                                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.value }))}
//                                                placeholder="Select Grade"
//                                            />
//                                        </div>

//                                        <div className="form-group">
//                                            <label>For Semester:</label>
//                                            <SelectButton
//                                                value={formData.semester}
//                                                options={semesters}
//                                                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.value }))}
//                                                itemTemplate={(option) => (
//                                                    <span style={{ color: getSemesterColor(option.value) }}>
//                                                        {option.name}
//                                                    </span>
//                                                )}
//                                            />
//                                        </div>

//                                        <div className="form-group">
//                                            <label>Day:</label>
//                                            <select
//                                                className="form-control"
//                                                name="day"
//                                                value={formData.day}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {daysOfWeek.map((day, index) => (
//                                                    <option key={index} value={index}>
//                                                        {day}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>Start Time:</label>
//                                            <select
//                                                className="form-control"
//                                                name="startTime"
//                                                value={formData.startTime}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {hours.map((hour, index) => (
//                                                    <option key={index} value={hour}>
//                                                        {hour}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <div className="form-group">
//                                            <label>End Time:</label>
//                                            <select
//                                                className="form-control"
//                                                name="endTime"
//                                                value={formData.endTime}
//                                                onChange={handleInputChange}
//                                                required
//                                            >
//                                                {hours.map((hour, index) => (
//                                                    <option key={index} value={hour}>
//                                                        {hour}
//                                                    </option>
//                                                ))}
//                                            </select>
//                                        </div>

//                                        <button type="submit" className="btn btn-primary">
//                                            Add Lecture
//                                        </button>
//                                    </form>
//                                </div>
//                            </div>
//                        </div>
//                    )}
//                </div>
//            </div>
//        </>
//    );
//};

//export default ManagementSchedule;

























import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import Navbar from './Navbar';
import '../CSS/ManagementSchedule.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);
//const semesters = [
//    { name: 'Fall', value: 'Fall' },
//    { name: 'Spring', value: 'Spring' }
//];


const semesters = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Spring', value: 'Spring' }
];
const grades = Array.from({ length: 4 }, (_, i) => ({ name: `Grade ${i + 1}`, value: i + 1 }));

const ManagementSchedule = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [lectures, setLectures] = useState([]);
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
    const [mode, setMode] = useState('add');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchLectures();
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

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //const handleFilterChange = (e) => {
    //    const { name, value } = e.target;
    //    setFilter(prev => ({ ...prev, [name]: value }));
    //};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.lectureId) {
            setError('Please select a lecture');
            return;
        }

        const startHour = parseInt(formData.startTime.split(':')[0]);
        const endHour = parseInt(formData.endTime.split(':')[0]);

        if (startHour >= endHour) {
            setError('End time must be after start time');
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
                showToast('success', 'Success', 'Lecture added to schedule');
            }
        } catch (err) {
            setError(err.response?.data || 'Error adding lecture');
            showToast('error', 'Error', err.response?.data || 'Error adding lecture');
        }
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

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="schedule-page-container">
                <div className="schedule-header">
                    <div className="header-left">
                        <h2>Lecture Program</h2>
                        <div className="filter-controls">
                            <div className="filter-item">
                                <label>Grade:</label>
                                {/*<Dropdown*/}
                                {/*    value={filter.grade}*/}
                                {/*    options={grades}*/}
                                {/*    optionLabel="name"*/}
                                {/*    optionValue="value"*/}
                                {/*    onChange={(e) => setFilter({ ...filter, grade: e.value })}*/}
                                {/*    placeholder="Select Grade"*/}
                                {/*/>*/}
                                <Dropdown
                                    value={filter.grade}
                                    options={grades}
                                    onChange={(e) => setFilter({ ...filter, grade: e.value })}
                                    placeholder="Select Grade"
                                />
                            </div>
                            <div className="filter-item">
                                <label>Semester:</label>
                                {/*<SelectButton*/}
                                {/*    value={filter.semester}*/}
                                {/*    options={semesters}*/}
                                {/*    optionLabel="name"*/}
                                {/*    optionValue="value"*/}
                                {/*    onChange={(e) => setFilter({ ...filter, semester: e.value })}*/}
                                {/*/>*/}

                                <SelectButton
                                    value={filter.semester}
                                    options={semesters}
                                    onChange={(e) => setFilter({ ...filter, semester: e.value })}
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
                            Add Lecture
                        </ToggleButton>
                        <ToggleButton
                            id="remove-mode"
                            value="remove"
                            variant={mode === 'remove' ? 'danger' : 'outline-danger'}
                            onClick={() => setMode('remove')}
                        >
                            Remove Lecture
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <div className="schedule-content">
                    <div className="schedule-container">
                        {loading ? (
                            <div className="loading-spinner">
                                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
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
                                                <td>{hour}</td>
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
                                                                    <strong>{lec.lecture.name} - {lec.lecture.lectureCode}</strong><br />
                                                                    {lec.lecture.user?.fullName || ''}<br />
                                                                    {lec.lecture.classroom?.name || ''}
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
                            <Card className="form-card" title="Add Lecture">
                                <div className="form-card-body">
                                    {error && <div className="p-message p-message-error">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-field">
                                            <label htmlFor="lectureId">Select Lecture</label>
                                            {/*<Dropdown*/}
                                            {/*    id="lectureId"*/}
                                            {/*    name="lectureId"*/}
                                            {/*    value={formData.lectureId}*/}
                                            {/*    options={lectures}*/}
                                            {/*    optionLabel="name"*/}
                                            {/*    optionValue="id"*/}
                                            {/*    onChange={handleInputChange}*/}
                                            {/*    placeholder="Select a Lecture"*/}
                                            {/*    filter*/}
                                            {/*    showClear*/}
                                            {/*    required*/}
                                            {/*/>*/}
                                            <Dropdown
                                                id="lectureId"
                                                name="lectureId"
                                                value={formData.lectureId}
                                                options={lectures.map(lecture => ({
                                                    label: `${lecture.name} - ${lecture.lectureCode}`,
                                                    value: lecture.id
                                                }))}
                                                onChange={(e) => setFormData({ ...formData, lectureId: e.value })}
                                                placeholder="Select a Lecture"
                                                filter
                                                showClear
                                                required
                                            />
                                        </div>

                                        <div className="p-field">
                                            <label htmlFor="day">Day:</label>
                                            {/*<Dropdown*/}
                                            {/*    id="day"*/}
                                            {/*    name="day"*/}
                                            {/*    value={formData.day}*/}
                                            {/*    options={daysOfWeek.map((day, index) => ({*/}
                                            {/*        label: day,*/}
                                            {/*        value: index*/}
                                            {/*    }))}*/}
                                            {/*    onChange={handleInputChange}*/}
                                            {/*    placeholder="Select a Day"*/}
                                            {/*    required*/}
                                            {/*/>*/}

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
                                                required
                                            />
                                        </div>

                                        <div className="time-fields">
                                            <div className="p-field">
                                                <label htmlFor="startTime">Start Time:</label>
                                                {/*<Dropdown*/}
                                                {/*    id="startTime"*/}
                                                {/*    name="startTime"*/}
                                                {/*    value={formData.startTime}*/}
                                                {/*    options={hours.map(hour => ({*/}
                                                {/*        label: hour,*/}
                                                {/*        value: hour*/}
                                                {/*    }))}*/}
                                                {/*    onChange={handleInputChange}*/}
                                                {/*    placeholder="Select Start Time"*/}
                                                {/*    required*/}
                                                {/*/>*/}

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
                                                    required
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
                                                    onChange={handleInputChange}
                                                    placeholder="Select End Time"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="p-field">
                                            <label htmlFor="grade">Grade:</label>
                                            <InputNumber
                                                id="grade"
                                                name="grade"
                                                value={formData.grade}
                                                onValueChange={(e) => setFormData({ ...formData, grade: e.value })}
                                                min={1}
                                                max={4}
                                                showButtons
                                                required
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
                                                required
                                            />
                                           
                                        </div>

                                        <button type="submit" className="p-button p-component p-button-primary">
                                            <i className="pi pi-plus"></i> Add Lecture
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