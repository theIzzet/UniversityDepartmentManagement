
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import Login from './Components/Login';
import LectureList from './Components/LectureList';

import MainPage from './Components/MainPage';
import './App.css';


import ManagementSchedule from './Components/ManagementSchedule';
import UserManagement from './Components/UserManagement';
import ClassroomManagement from './Components/Classroommanagement';
import ExamProgramManagement from './Components/ExamProgramManagement';
import InstructorSchedule from './Components/InstructorSchedule'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
};



function App() {
    return (
        <AuthProvider>
            <Router>

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/main" element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/lecture-list" element={
                        <ProtectedRoute>
                            <LectureList />
                        </ProtectedRoute>
                    } />
                  
                    <Route path="/management-schedule" element={
                        <ProtectedRoute>
                            <ManagementSchedule />
                        </ProtectedRoute>
                    } />
                    <Route path="/user-management" element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    } />
                    

                  
                    <Route path="/classroom-management" element={
                        <ProtectedRoute>
                            <ClassroomManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/instructor-schedule" element={
                        <ProtectedRoute>
                            <InstructorSchedule />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/exam-management" element={
                        <ProtectedRoute>
                            <ExamProgramManagement />
                        </ProtectedRoute>
                    } />
                    
                 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;