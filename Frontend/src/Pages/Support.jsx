import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Support() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Support</span>
                    <h1>Need help? We’ve got your back.</h1>
                    <p>
                        Find answers, contact support, or explore the docs to solve issues quickly.
                    </p>
                </div>
                <a href="mailto:support@taskflow.app" className="btn btn-primary">
                    Email Support
                </a>
            </div>

            <div className="info-grid">
                <div className="page-card">
                    <h2>Contact support</h2>
                    <p>Open a support ticket by email and get fast help from our team.</p>
                </div>
                <div className="page-card">
                    <h2>Knowledge base</h2>
                    <p>Read the documentation for onboarding, features, and best practices.</p>
                </div>
                <div className="page-card">
                    <h2>Product feedback</h2>
                    <p>Share ideas or request features to improve your TaskFlow experience.</p>
                </div>
            </div>

            <div className="page-card support-note-card">
                <h2>Quick support guide</h2>
                <ul>
                    <li>Review the in-app docs first to get started fast.</li>
                    <li>Use the email link above when you need direct help.</li>
                    <li>Check collaboration settings if someone can’t access a project.</li>
                </ul>
            </div>
        </div>
    );
}

export default Support;
