
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import '../CSS/MainPage.css';
import { useAuth } from '../Contexts/AuthContext';

const MainPage = () => {
    const { user } = useAuth();
    

    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Navbar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainPage;