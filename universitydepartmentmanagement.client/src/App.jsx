
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import Login from './Components/Login';
import LectureList from './Components/LectureList';

import MainPage from './Components/MainPage';
import './App.css';


import ManagementSchedule from './Components/ManagementSchedule';
import UserManagement from './Components/UserManagement';
import ClassroomManagement from './Components/Classroommanagement'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
};



function App() {
    return (
        <AuthProvider>
            <Router>
                {/*<Routes>*/}
                {/*    <Route path="/" element={<Login />} />*/}
                {/*    <Route path="/main" element={<MainPage />} />*/}
                {/*    <Route path="/lecture-list" element={<LectureList />} />*/}
                {/*    <Route path="/add-lecture" element={<AddLecture />} />*/}
                {/*    <Route path="/edit-lecture/:id" element={<EditLecture />} />*/}
                {/*    <Route path="/management-schedule" element={<ManagementSchedule />} />*/}
                {/*</Routes>*/}

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
                    {/*<Route path="/add-lecture" element={*/}
                    {/*    <ProtectedRoute>*/}
                    {/*        <AddLecture />*/}
                    {/*    </ProtectedRoute>*/}
                    {/*} />*/}
                    {/*<Route path="/edit-lecture/:id" element={*/}
                    {/*    <ProtectedRoute>*/}
                    {/*        <EditLecture />*/}
                    {/*    </ProtectedRoute>*/}
                    {/*} />*/}
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
                    

                    {/*<Route path="/classroom-list" element={*/}
                    {/*    <ProtectedRoute>*/}
                    {/*        <ClassroomList />*/}
                    {/*    </ProtectedRoute>*/}
                    {/*} />*/}

                    {/*<Route path="/classroom-view/:id" element={*/}
                    {/*    <ProtectedRoute>*/}
                    {/*        <ClassroomView />*/}
                    {/*    </ProtectedRoute>*/}
                    {/*} />*/}
                    <Route path="/classroom-management" element={
                        <ProtectedRoute>
                            <ClassroomManagement />
                        </ProtectedRoute>
                    } />

                    {/*<Route path="/classroom-details/:id" element={*/}
                    {/*    <ProtectedRoute>*/}
                    {/*        <ClassroomDetails />*/}
                    {/*    </ProtectedRoute>*/}
                    {/*} />*/}

                    {/*<Route path="/classroom-list" element={<ClassroomList />} />*/}
                    {/*<Route path="/classroom-view/:id" element={<ClassroomView />} />*/}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;