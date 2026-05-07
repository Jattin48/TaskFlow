import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectCard.css';

function ProjectCard({ project, onDelete }) {
    const navigate = useNavigate();
    const taskCount = project.taskCount || 0;
    const memberCount = project.members?.length || 0;

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
            onDelete(project._id);
        }
    };

    const isInvited = project.inviteStatus === 'pending';

    return (
        <div className="project-card" onClick={() => navigate(`/project/${project._id}`)}>
            <div className="project-card-header">
                <div className="project-card-title">
                    <span className="project-card-icon">{project.icon}</span>
                    <div>
                        <h3>{project.name}</h3>
                        {isInvited && <span className="invite-status">Pending invite</span>}
                    </div>
                </div>
                {!isInvited && onDelete && (
                    <button
                        className="card-delete-btn"
                        onClick={handleDelete}
                        title="Delete project"
                    >
                        ×
                    </button>
                )}
            </div>

            {project.description && (
                <p className="project-card-description">{project.description}</p>
            )}

            <div className="project-card-meta">
                <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{memberCount} members</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">✓</span>
                    <span>{project.progress}% done</span>
                </div>
            </div>

            {project.dueDate && (
                <div className="project-card-due">
                    <span className="due-icon">📅</span>
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
}

export default ProjectCard;
