
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/Login/login', { email, password });
            const { token } = response.data;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const userData = { token, role: userRole };
            login(userData);
            console.log('User Role:', userRole);
            console.log('Token:' , token)
            navigate('/main');
            
        } catch (error) {
            console.error('Giriþ baþarýsýz:', error);
            setError('Login unssuccesfull.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Login System</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-posta:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Log in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
