import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Landing({ isPremiumMode, onTogglePremium }) {
    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-copy">
                    <span className="eyebrow">Welcome to TaskFlow</span>
                    <h1>Plan smarter, collaborate faster, ship projects together.</h1>
                    <p>
                        TaskFlow brings your team, tasks, and project invites into one
                        polished experience. Manage projects, invite collaborators, and
                        keep your work moving with clarity.
                    </p>

                    <div className="hero-actions">
                        <Link to="/login" className="btn btn-primary">
                            Get Started
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                            Create Account
                        </Link>
                    </div>

                    <div className="hero-toggle-row">
                        <button
                            type="button"
                            className={`theme-chip ${isPremiumMode ? 'active' : ''}`}
                            onClick={onTogglePremium}
                        >
                            {isPremiumMode ? 'Premium glow active' : 'Activate premium glow'}
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <strong>98%</strong>
                            <span>Team adoption rate</span>
                        </div>
                        <div className="stat-card">
                            <strong>4.8</strong>
                            <span>Average sprint score</span>
                        </div>
                        <div className="stat-card">
                            <strong>24h</strong>
                            <span>Response time</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="feature-chip">Team invites</div>
                    <div className="feature-chip">Project boards</div>
                    <div className="feature-chip">Documentation hub</div>
                    <div className="hero-box">
                        <div className="hero-box-header">
                            <span>Live collaboration</span>
                            <span className="label">New</span>
                        </div>
                        <p>
                            Invite people, assign roles, and review project updates with
                            a shared team workspace.
                        </p>
                    </div>
                </div>
            </section>

            <div className="trust-strip">
                <span>Trusted by early adopter teams and fast-moving creators</span>
                <div className="brand-pills">
                    <span>WaveLabs</span>
                    <span>PulseOps</span>
                    <span>LaunchHub</span>
                    <span>FlowStack</span>
                </div>
            </div>

            <section className="feature-grid">
                <article className="feature-card">
                    <h2>Project dashboards</h2>
                    <p>Organize every task, deadline, and status update in a single view.</p>
                </article>
                <article className="feature-card">
                    <h2>Team collaboration</h2>
                    <p>Invite members, track pending access, and stay aligned across teams.</p>
                </article>
                <article className="feature-card">
                    <h2>Support & docs</h2>
                    <p>Built-in help and documentation make it easier to onboard and scale.</p>
                </article>
            </section>
        </div>
    );
}

export default Landing;
