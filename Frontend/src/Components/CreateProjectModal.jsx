import React, { useState } from 'react';
import '../styles/Modal.css';

function CreateProjectModal({ onClose, onProjectCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        icon: '📋',
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const icons = ['📋', '🎯', '📊', '📱', '🛠️', '🚀', '💼', '🎨'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                onProjectCreated(data.project);
            }
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Project</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Project Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="My Awesome Project"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What is this project about?"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="icon">Icon</label>
                            <div className="icon-picker">
                                {icons.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        className={`icon-btn ${formData.icon === icon ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="color">Color</label>
                            <input
                                type="color"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProjectModal;
