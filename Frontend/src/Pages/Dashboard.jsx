import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../Components/ProjectCard';
import CreateProjectModal from '../Components/CreateProjectModal';
import '../styles/Dashboard.css';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = (newProject) => {
        setProjects([newProject, ...projects]);
        setShowCreateModal(false);
    };

    const projectCount = projects.length;
    const activeCollaborators = projects.reduce((sum, project) => sum + (project.members?.length || 0), 0);
    const averageProgress = projectCount
        ? Math.round(projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projectCount)
        : 0;
    const totalOpenTasks = projects.reduce((sum, project) => sum + (project.openTasks || 0), 0);

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setProjects(projects.filter(p => p._id !== projectId));
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>My Projects</h1>
                    <p>Create and manage your projects efficiently</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    + New Project
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-label">Active projects</span>
                    <strong>{projectCount}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Average progress</span>
                    <strong>{averageProgress}%</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Open tasks</span>
                    <strong>{totalOpenTasks}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Collaborators</span>
                    <strong>{activeCollaborators}</strong>
                </div>
            </div>

            <div className="dashboard-support">
                <div className="support-card">
                    <div className="support-card-header">
                        <div>
                            <h2>Documentation & Support</h2>
                            <p>Access onboarding docs, collaboration guides, and quick support for TaskFlow.</p>
                        </div>
                    </div>
                    <div className="support-actions">
                        <a href="https://taskflow.example.com/docs" target="_blank" rel="noreferrer" className="btn btn-secondary">
                            Read Docs
                        </a>
                        <a href="mailto:support@taskflow.app" className="btn btn-primary">
                            Contact Support
                        </a>
                    </div>
                    <p className="support-note">Need help with onboarding or customization? Reach out to support or browse the docs before you start your next team sprint.</p>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects yet</p>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    );
}

export default Dashboard;
