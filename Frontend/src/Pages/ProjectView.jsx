import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskBoard from '../Components/TaskBoard';
import TaskModal from '../Components/TaskModal';
import '../styles/ProjectView.css';

function ProjectView() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProject();
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setProject(data.project);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) {
            setMessage('Enter a valid email to invite');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });
            const data = await response.json();
            if (data.success) {
                setProject(data.project);
                setInviteEmail('');
                setMessage(data.message || 'Invite sent');
            } else {
                setMessage(data.message || 'Could not send invite');
            }
        } catch (error) {
            console.error('Error sending invite:', error);
            setMessage('Error sending invite');
        }
    };

    const handleAcceptInvite = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setProject(data.project);
                setMessage(data.message || 'Joined project successfully');
            } else {
                setMessage(data.message || 'Could not accept invitation');
            }
        } catch (error) {
            console.error('Error accepting invite:', error);
            setMessage('Error accepting invite');
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks([...tasks, newTask]);
        setShowTaskModal(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(tasks.filter((t) => t._id !== taskId));
    };

    if (loading) {
        return <div className="loading">Loading project...</div>;
    }

    if (!project) {
        return <div className="error">Project not found</div>;
    }

    const invited = project.inviteStatus === 'pending';

    return (
        <div className="project-view">
            <div className="project-header">
                <div className="project-title">
                    <span className="project-icon">{project.icon}</span>
                    <div>
                        <h1>{project.name}</h1>
                        <p>{project.description}</p>
                    </div>
                </div>
                {!invited && (
                    <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                        + Add Task
                    </button>
                )}
            </div>

            {invited && (
                <div className="invite-banner">
                    <p>You have been invited to join this project.</p>
                    <button className="btn btn-secondary" onClick={handleAcceptInvite}>
                        Accept Invite
                    </button>
                </div>
            )}

            {message && <div className="message-banner">{message}</div>}

            <div className="project-details-grid">
                <div className="project-collaboration">
                    <div className="project-panel">
                        <h3>Team collaborators</h3>
                        <div className="member-list">
                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <div key={member.user._id} className="member-item">
                                        <span>{member.user.name}</span>
                                        <small>{member.role}</small>
                                    </div>
                                ))
                            ) : (
                                <p>No collaborators yet.</p>
                            )}
                        </div>

                        {project.invites && project.invites.length > 0 && (
                            <div className="pending-invites">
                                <h4>Pending invites</h4>
                                {project.invites.map((invite) => (
                                    <div key={invite.email} className="invite-item">
                                        <span>{invite.email}</span>
                                        <small>{invite.role}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!invited && (
                        <div className="project-panel">
                            <h3>Invite a teammate</h3>
                            <form onSubmit={handleInvite} className="invite-form">
                                <div className="form-group">
                                    <label htmlFor="inviteEmail">Email</label>
                                    <input
                                        id="inviteEmail"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inviteRole">Role</label>
                                    <select
                                        id="inviteRole"
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                    >
                                        <option value="member">Member</option>
                                        <option value="viewer">Viewer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" type="submit">
                                    Send Invite
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="project-panel project-activity">
                    <h3>Collaboration feed</h3>
                    <p>Use comments with <strong>@email</strong> to tag teammates. Comments are attached to task cards and shared with the project team.</p>
                </div>
            </div>

            {invited ? (
                <div className="invite-prompt">
                    <p>This project is waiting for you to accept the invite before you can collaborate on tasks.</p>
                </div>
            ) : (
                <>
                    <TaskBoard
                        tasks={tasks}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                    />

                    {showTaskModal && (
                        <TaskModal
                            projectId={projectId}
                            onClose={() => setShowTaskModal(false)}
                            onTaskCreated={handleTaskCreated}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ProjectView;
