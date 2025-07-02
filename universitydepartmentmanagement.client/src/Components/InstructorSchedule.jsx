//import React, { useEffect, useState, useRef } from 'react';
//import axios from 'axios';
//import { SelectButton } from 'primereact/selectbutton';
//import { ProgressSpinner } from 'primereact/progressspinner';
//import { Badge } from 'primereact/badge';
//import { Toast } from 'primereact/toast';
//import Navbar from './Navbar';
//import '../CSS/ManagementSchedule.css';
//import 'primereact/resources/themes/lara-light-indigo/theme.css';
//import 'primereact/resources/primereact.min.css';
//import 'primeicons/primeicons.css';
//import { useAuth } from '../Contexts/AuthContext';

//const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);
//const semesters = [
//    { label: 'Fall', value: 'Fall' },
//    { label: 'Spring', value: 'Spring' }
//];

//const InstructorSchedule = () => {
//    const { user, logout } = useAuth();
//    const [scheduleData, setScheduleData] = useState([]);
//    const [filter, setFilter] = useState({ semester: 'Fall' });
//    const [loading, setLoading] = useState(false);
//    const toast = useRef(null);

//    useEffect(() => {
//        if (user) {
//            fetchSchedule();
//        }
//    }, [filter, user]);

//    const fetchSchedule = async () => {
//        setLoading(true);
//        try {
//            const token = localStorage.getItem('token');
//            if (!token) {
//                throw new Error('No authentication token found');
//            }

//            const res = await axios.get('/api/Instructor/my-schedule', {
//                params: { semester: filter.semester },
//                headers: {
//                    'Authorization': `Bearer ${token}`
//                }
//            });
//            setScheduleData(res.data);
//        } catch (error) {
//            console.error("Error fetching schedule:", error);
//            if (error.response?.status === 401) {
//                showToast('error', 'Session Expired', 'Please login again');
//                logout();
//            } else {
//                showToast('error', 'Error', 'Failed to load schedule');
//            }
//        } finally {
//            setLoading(false);
//        }
//    };

//    const showToast = (severity, summary, detail) => {
//        toast.current?.show({
//            severity,
//            summary,
//            detail,
//            life: 3000,
//            style: {
//                borderLeft: severity === 'error' ? '4px solid #f44336' :
//                    severity === 'success' ? '4px solid #4caf50' : '4px solid #2196F3'
//            }
//        });
//    };

//    const getLecturesForSlot = (dayIndex, hour) => {
//        const hourValue = parseInt(hour.split(':')[0]);
//        return scheduleData.filter((lecture) => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            const end = parseInt(lecture.endTime.split(':')[0]);
//            return lecture.day === dayIndex && hourValue >= start && hourValue < end;
//        });
//    };

//    const isSlotOccupied = (dayIndex, hour) => {
//        const hourValue = parseInt(hour.split(':')[0]);
//        return scheduleData.some(lecture => {
//            const start = parseInt(lecture.startTime.split(':')[0]);
//            const end = parseInt(lecture.endTime.split(':')[0]);
//            return lecture.day === dayIndex && hourValue >= start && hourValue < end;
//        });
//    };

//    return (
//        <>
//            <Navbar />
//            <Toast ref={toast} />

//            <div className="schedule-page-container">
//                <div className="schedule-header glass-card">
//                    <div className="header-left">
//                        <h2 className="page-title">My Lecture Schedule</h2>
//                        <div className="filter-controls">
//                            <div className="filter-item">
//                                <label>Semester:</label>
//                                <SelectButton
//                                    value={filter.semester}
//                                    options={semesters}
//                                    onChange={(e) => setFilter({ ...filter, semester: e.value })}
//                                    className="semester-select"
//                                />
//                            </div>
//                        </div>
//                    </div>
//                    <div className="instructor-info">
//                        <i className="pi pi-user"></i>
//                        <span>{user?.name} {user?.surname}</span>
//                    </div>
//                </div>

//                <div className="schedule-content">
//                    <div className="schedule-container glass-card">
//                        {loading ? (
//                            <div className="loading-spinner">
//                                <ProgressSpinner />
//                            </div>
//                        ) : (
//                            <div className="table-responsive">
//                                <table className="schedule-table">
//                                    <thead>
//                                        <tr>
//                                            <th style={{ minWidth: '80px' }}>Time</th>
//                                            {daysOfWeek.map((day, i) => (
//                                                <th key={i}>{day}</th>
//                                            ))}
//                                        </tr>
//                                    </thead>
//                                    <tbody>
//                                        {hours.map((hour, hourIdx) => (
//                                            <tr key={hourIdx}>
//                                                <td className="time-cell">{hour}</td>
//                                                {daysOfWeek.map((_, dayIdx) => {
//                                                    const lectures = getLecturesForSlot(dayIdx, hour);
//                                                    const isOccupied = isSlotOccupied(dayIdx, hour);
//                                                    return (
//                                                        <td
//                                                            key={dayIdx}
//                                                            className={`schedule-cell ${isOccupied ? 'occupied' : ''}`}
//                                                        >
//                                                            {lectures.map((lec, i) => (
//                                                                <div
//                                                                    key={i}
//                                                                    className="lecture-box instructor-lecture"
//                                                                >
//                                                                    <div className="lecture-header">
//                                                                        <strong>{lec.lecture.name}</strong>
//                                                                        <Badge
//                                                                            value={lec.lecture.lectureCode}
//                                                                            severity="info"
//                                                                            className="lecture-badge"
//                                                                        />
//                                                                    </div>
//                                                                    <div className="lecture-details">
//                                                                        <div>
//                                                                            <i className="pi pi-building"></i>
//                                                                            {lec.lecture.classroomName}
//                                                                        </div>
//                                                                        <div>
//                                                                            <i className="pi pi-users"></i>
//                                                                            Grade {lec.grade}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            ))}
//                                                        </td>
//                                                    );
//                                                })}
//                                            </tr>
//                                        ))}
//                                    </tbody>
//                                </table>
//                            </div>
//                        )}
//                    </div>
//                </div>
//            </div>
//        </>
//    );
//};

//export default InstructorSchedule;




import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { SelectButton } from 'primereact/selectbutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { usePDF } from 'react-to-pdf';
import * as htmlToImage from 'html-to-image';
/*import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';*/
import Navbar from './Navbar';
import '../CSS/ManagementSchedule.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useAuth } from '../Contexts/AuthContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);
const semesters = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Spring', value: 'Spring' }
];

const InstructorSchedule = () => {
    const { user, logout } = useAuth();
    const [scheduleData, setScheduleData] = useState([]);
    const [filter, setFilter] = useState({ semester: 'Fall' });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const scheduleRef = useRef(null);
    const {  targetRef } = usePDF({ filename: 'instructor-schedule.pdf' });

    useEffect(() => {
        if (user) {
            fetchSchedule();
        }
    }, [filter, user]);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const res = await axios.get('/api/Instructor/my-schedule', {
                params: { semester: filter.semester },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setScheduleData(res.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
            if (error.response?.status === 401) {
                showToast('error', 'Session Expired', 'Please login again');
                logout();
            } else {
                showToast('error', 'Error', 'Failed to load schedule');
            }
        } finally {
            setLoading(false);
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current?.show({
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

    const getLecturesForSlot = (dayIndex, hour) => {
        const hourValue = parseInt(hour.split(':')[0]);
        return scheduleData.filter((lecture) => {
            const start = parseInt(lecture.startTime.split(':')[0]);
            const end = parseInt(lecture.endTime.split(':')[0]);
            return lecture.day === dayIndex && hourValue >= start && hourValue < end;
        });
    };

    const isSlotOccupied = (dayIndex, hour) => {
        const hourValue = parseInt(hour.split(':')[0]);
        return scheduleData.some(lecture => {
            const start = parseInt(lecture.startTime.split(':')[0]);
            const end = parseInt(lecture.endTime.split(':')[0]);
            return lecture.day === dayIndex && hourValue >= start && hourValue < end;
        });
    };


    const exportToPNG = async () => {
        try {
            if (!scheduleRef.current) return;

            // Hide elements we don't want in the image
            const elementsToHide = document.querySelectorAll('.download-button, .semester-select, .instructor-info');
            elementsToHide.forEach(el => el.style.visibility = 'hidden');

            // Wait for DOM updates
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get the full dimensions
            const fullWidth = scheduleRef.current.scrollWidth;
            const fullHeight = scheduleRef.current.scrollHeight;

            const dataUrl = await htmlToImage.toPng(scheduleRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                width: fullWidth,
                height: fullHeight,
                style: {
                    width: `${fullWidth}px`,
                    height: `${fullHeight}px`,
                    transform: 'none' // Remove the scaling we had before
                }
            });

            // Restore visibility
            elementsToHide.forEach(el => el.style.visibility = 'visible');

            const link = document.createElement('a');
            link.download = `instructor-schedule-${filter.semester.toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error generating PNG:', error);
            showToast('error', 'Export Failed', 'Failed to generate image');
        }
    };

    return (
        <>
            <Navbar />
            <Toast ref={toast} />

            <div className="schedule-page-container">
                <div className="schedule-header glass-card">
                    <div className="header-left">
                        <h2 className="page-title">My Lecture Schedule</h2>
                        <div className="filter-controls">
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
                    <div className="header-right">
                        <div className="instructor-info">
                            <i className="pi pi-user"></i>
                            <span>{user?.name} {user?.surname}</span>
                        </div>
                        <div className="export-buttons">
                           
                            <Button
                                icon="pi pi-image"
                                label="Export PNG"
                                className="p-button-rounded p-button-outlined download-button ml-2"
                                onClick={exportToPNG}
                            />
                        </div>
                    </div>
                </div>

                <div className="schedule-content" ref={targetRef}>
                    <div className="schedule-container glass-card" ref={scheduleRef}>
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
                                                                    className="lecture-box instructor-lecture"
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
                                                                            <i className="pi pi-building"></i>
                                                                            {lec.lecture.classroomName}
                                                                        </div>
                                                                        <div>
                                                                            <i className="pi pi-users"></i>
                                                                            Grade {lec.grade}
                                                                        </div>
                                                                    </div>
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
                </div>
            </div>
        </>
    );
};

export default InstructorSchedule;