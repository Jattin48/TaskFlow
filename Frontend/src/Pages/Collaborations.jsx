import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Collaborations() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Collaborations</span>
                    <h1>Bring your team together</h1>
                    <p>
                        Invite colleagues, delegate roles, and manage project access from one place.
                    </p>
                </div>
                <Link to="/dashboard" className="btn btn-primary">
                    View Projects
                </Link>
            </div>

            <div className="info-grid">
                <div className="page-card">
                    <h2>Invite teammates</h2>
                    <p>Send collaboration invites directly from the project page and track pending requests.</p>
                </div>
                <div className="page-card">
                    <h2>Shared visibility</h2>
                    <p>Team members get the same project context, comments, and status updates.</p>
                </div>
                <div className="page-card">
                    <h2>Role-driven access</h2>
                    <p>Define who can view, edit, and manage projects to keep work secure.</p>
                </div>
            </div>
        </div>
    );
}

export default Collaborations;
