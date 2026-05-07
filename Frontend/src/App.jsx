import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ProjectView from './Pages/ProjectView';
import Landing from './Pages/Landing';
import Collaborations from './Pages/Collaborations';
import Support from './Pages/Support';
import Documentation from './Pages/Documentation';
import Layout from './Components/Layout';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPremiumMode, setIsPremiumMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }

        const premium = localStorage.getItem('premiumMode') === 'true';
        setIsPremiumMode(premium);
        document.body.classList.toggle('premium-mode', premium);

        setLoading(false);
    }, []);

    const handleLogin = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleTogglePremiumMode = () => {
        setIsPremiumMode((prevMode) => {
            const nextMode = !prevMode;
            localStorage.setItem('premiumMode', nextMode);
            document.body.classList.toggle('premium-mode', nextMode);
            return nextMode;
        });
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Landing
                                isPremiumMode={isPremiumMode}
                                onTogglePremium={handleTogglePremiumMode}
                            />
                        )
                    }
                />

                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onRegister={handleLogin} />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/register" element={<Navigate to="/dashboard" replace />} />
                    </>
                )}

                {isAuthenticated && (
                    <Route
                        element={
                            <Layout
                                user={user}
                                onLogout={handleLogout}
                                isPremiumMode={isPremiumMode}
                                onTogglePremium={handleTogglePremiumMode}
                            />
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/project/:projectId" element={<ProjectView />} />
                        <Route path="/collaborations" element={<Collaborations />} />
                        <Route path="/docs" element={<Documentation />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                )}

                <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
