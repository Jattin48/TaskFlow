import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ user, onLogout }) {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">📊</div>
                <span>TaskFlow</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <p className="nav-section-title">Workspace</p>
                    <Link
                        to="/dashboard"
                        className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📋</span>
                        <span className="nav-text">Projects</span>
                    </Link>
                    <Link
                        to="/collaborations"
                        className={`nav-item ${location.pathname === '/collaborations' ? 'active' : ''}`}
                    >
                        <span className="nav-icon">🤝</span>
                        <span className="nav-text">Collaborations</span>
                    </Link>
                </div>

                <div className="nav-section">
                    <p className="nav-section-title">Resources</p>
                    <Link
                        to="/docs"
                        className={`nav-item ${location.pathname === '/docs' ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📚</span>
                        <span className="nav-text">Documentation</span>
                    </Link>
                    <Link
                        to="/support"
                        className={`nav-item ${location.pathname === '/support' ? 'active' : ''}`}
                    >
                        <span className="nav-icon">💬</span>
                        <span className="nav-text">Support</span>
                    </Link>
                </div>

            </nav>

            <div className="sidebar-footer">
                <button className="nav-item" onClick={onLogout}>
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
