import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import '../CSS/MainPage.css';

const MainPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/" />;
    }

    const isInstructor = user?.role === "Instructor";
    const isSecretary = user?.role === "Department Secretary";
    const isChair = user?.role === "Chair";

    const features = [
        ...((isSecretary || isChair) ? [{
            title: "User Management",
            icon: "bi bi-people-fill",
            path: "/user-management",
            description: "Manage department users and permissions",
            color: "#667eea",
            hoverColor: "#764ba2"
        }] : []),

        ...(!isInstructor ? [{
            title: "Lecture List",
            icon: "bi bi-list-check",
            path: "/lecture-list",
            description: "View and manage all lectures",
            color: "#43e97b",
            hoverColor: "#38f9d7"
        }] : []),

        ...(!isInstructor ? [{
            title: "Classroom Management",
            icon: "bi bi-building",
            path: "/classroom-management",
            description: "Manage classrooms and their schedules",
            color: "#ff9a9e",
            hoverColor: "#fad0c4"
        }] : []),

        ...(!isInstructor ? [{
            title: "Program Management",
            icon: "bi bi-calendar2-week",
            path: "/management-schedule",
            description: "Manage lecture schedules and programs",
            color: "#a18cd1",
            hoverColor: "#fbc2eb"
        }] : []),
        ...(!isInstructor ? [{
            title: "Exam Seating Management",
            icon: "bi bi-calendar2-week",
            path: "/exam-seating-arrangement",
            description: "Arrange ",
            color: "#a18cd1",
            hoverColor: "#fbc2eb"
        }] : []),
        ...(isInstructor ? [{
            title: "My Lecture Program",
            icon: "bi bi-calendar2-week",
            path: "/instructor-schedule",
            description: "Examine own lecture program",
            color: "#a18cd1",
            hoverColor: "#fbc2eb"
        }] : []),

        {
            title: "Exam Management",
            icon: "bi bi-calendar-event",
            path: "/exam-management",
            description: "Manage exam schedules and programs",
            color: "#ffc3a0",
            hoverColor: "#ffafbd"
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="background-animation"></div>

            <header className="dashboard-header">
                <div className="user-info">
                    <div className="user-avatar">
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div>
                        <h2>{user.email}</h2>
                        <p className="role-badge">{user.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        navigate('/');
                    }}
                    className="logout-btn"
                >
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </header>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1 className="welcome-title">Welcome to <span>Department Management</span></h1>
                    <p className="welcome-subtitle">Select an option below to get started</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            onClick={() => navigate(feature.path)}
                            style={{
                                '--card-color': feature.color,
                                '--hover-color': feature.hoverColor
                            }}
                        >
                            <div className="card-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <div className="card-content">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                            <div className="card-hover-effect"></div>
                            <div className="click-indicator">
                                <i className="bi bi-arrow-right"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;