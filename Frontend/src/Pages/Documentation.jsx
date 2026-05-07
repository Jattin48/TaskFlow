import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Documentation() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Documentation</span>
                    <h1>Quick start and workflow guides</h1>
                    <p>
                        Explore the core TaskFlow features and learn how to invite collaborators,
                        build projects, and track progress.
                    </p>
                </div>
                <Link to="/dashboard" className="btn btn-secondary">
                    Open Dashboard
                </Link>
            </div>

            <div className="info-grid">
                <div className="page-card">
                    <h2>Creating a project</h2>
                    <p>Use the dashboard to add a project, invite teammates, and start task planning.</p>
                </div>
                <div className="page-card">
                    <h2>Managing invites</h2>
                    <p>Send invites to collaborators and monitor pending approvals on the project page.</p>
                </div>
                <div className="page-card">
                    <h2>Tracking progress</h2>
                    <p>Open any project to view tasks, subtasks, comments, and status updates.</p>
                </div>
            </div>
        </div>
    );
}

export default Documentation;
