import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

function Layout({ user, onLogout, isPremiumMode, onTogglePremium }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <Sidebar onLogout={handleLogout} user={user} />
            <div className="main-content">
                <header className="top-bar">
                    <div className="top-bar-content">
                        <h2>TaskFlow</h2>
                        <div className="top-bar-actions">
                            <button
                                className={`btn btn-ghost theme-toggle ${isPremiumMode ? 'active' : ''}`}
                                onClick={onTogglePremium}
                            >
                                {isPremiumMode ? 'Premium mode' : 'Activate glow'}
                            </button>
                            <div className="user-menu">
                                <span className="user-name">{user?.name}</span>
                                <button className="btn-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
