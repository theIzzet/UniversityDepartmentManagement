
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import Navbar from './Navbar';
import '../CSS/ManagementSchedule.css';

const daysOfWeek = ['Monday ', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday '/*, 'Saturday ', 'Sunday '*/];
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

const ManagementSchedule = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [formData, setFormData] = useState({
        lectureId: '',
        day: 0,
        startTime: '8:00',
        endTime: '9:00'
    });
    const [error, setError] = useState('');
    const [mode, setMode] = useState('add');
    const toast = useRef(null);

    useEffect(() => {
        fetchSchedule();
        fetchLectures();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await axios.get('/api/LectureScheduleManagement/all-lecture-schedules');
            setScheduleData(res.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
            showToast('error', 'Error', 'Error was occured by installing');
        }
    };

    const fetchLectures = async () => {
        try {
            const res = await axios.get('/api/Lecture');
            setLectures(res.data);
        } catch (error) {
            console.error("Error fetching lectures:", error);
            showToast('error', 'Error ', 'Dersler yüklenirken hata oluþtu');
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.lectureId) {
            setError('Lütfen bir ders seçin');
            return;
        }

        const startHour = parseInt(formData.startTime.split(':')[0]);
        const endHour = parseInt(formData.endTime.split(':')[0]);

        if (startHour >= endHour) {
            setError(' End time must be after start time');
            return;
        }

        try {
            
            const requests = [];
            for (let hour = startHour; hour < endHour; hour++) {
                const currentStartTime = `${hour}:00`;
                const currentEndTime = `${hour + 1}:00`;

                requests.push(
                    axios.post('/api/LectureScheduleManagement/add-lecture-schedule', {
                        lectureId: parseInt(formData.lectureId),
                        day: parseInt(formData.day),
                        startTime: `${currentStartTime}:00`,
                        endTime: `${currentEndTime}:00`
                    })
                );
            }

            
            const responses = await Promise.all(requests);

            
            const allSuccess = responses.every(response => response.status === 200);
            if (allSuccess) {
                fetchSchedule();
                setFormData({
                    lectureId: '',
                    day: 0,
                    startTime: '8:00',
                    endTime: '9:00'
                });
                showToast('success', 'Baþarýlý', 'Ders programýna eklendi');
            }
        } catch (err) {
            setError(err.response?.data || 'Ders eklenirken bir hata oluþtu');
            showToast('error', 'Hata', err.response?.data || 'Ders eklenirken bir hata oluþtu');
        }
    };

    const handleRemove = (scheduleId) => {
        confirmDialog({
            message: 'Bu dersi programdan kaldýrmak istediðinize emin misiniz?',
            header: 'Onay',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet',
            rejectLabel: 'Hayýr',
            accept: async () => {
                try {
                    await axios.delete(`/api/LectureScheduleManagement/delete-lecture-schedule/${scheduleId}`);
                    fetchSchedule();
                    showToast('success', 'Success', 'Lecture Schedule was  removed');
                } catch (error) {

                    console.log("",error)
                    showToast('error', 'Hata', 'Ders kaldýrýlýrken bir hata oluþtu');
                }
            },
            reject: () => {
                showToast('info', 'Info', 'Process was canceled');
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
                    <h2>Lecture Program</h2>
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
                        <div className="table-responsive">
                            <table className="schedule-table">
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '80px' }}>Saat</th>
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
                                                                        <i className="pi pi-trash"></i> Kaldýr
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
                    </div>

                    {mode === 'add' && (
                        <div className="schedule-form">
                            <div className="form-card">
                                <div className="form-card-header">
                                    <h3>Add Lecture</h3>
                                </div>
                                <div className="form-card-body">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Select Lecture</label>
                                            <select
                                                className="form-control"
                                                name="lectureId"
                                                value={formData.lectureId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Lecture</option>
                                                {lectures.map(lecture => (
                                                    <option key={lecture.id} value={lecture.id}>
                                                        {lecture.name} - {lecture.lectureCode}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Day:</label>
                                            <select
                                                className="form-control"
                                                name="day"
                                                value={formData.day}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {daysOfWeek.map((day, index) => (
                                                    <option key={index} value={index}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Start Time:</label>
                                            <select
                                                className="form-control"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {hours.map((hour, index) => (
                                                    <option key={index} value={hour}>
                                                        {hour}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>End Time:</label>
                                            <select
                                                className="form-control"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {hours.map((hour, index) => (
                                                    <option key={index} value={hour}>
                                                        {hour}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <button type="submit" className="btn btn-primary">
                                            Add Lecture
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManagementSchedule;