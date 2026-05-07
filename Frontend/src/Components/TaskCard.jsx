import React, { useState } from 'react';
import '../styles/TaskCard.css';

function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {
    const [showOptions, setShowOptions] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const token = localStorage.getItem('token');

    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        urgent: '#991b1b',
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${task.project}/tasks/${task._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );
            const data = await response.json();
            if (data.success) {
                onTaskUpdated(data.task);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this task?')) {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/projects/${task.project}/tasks/${task._id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    onTaskDeleted(task._id);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            return;
        }

        setPostingComment(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${task.project}/tasks/${task._id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: commentText }),
                }
            );
            const data = await response.json();
            if (data.success) {
                const updatedTask = {
                    ...task,
                    comments: [...(task.comments || []), data.comment],
                };
                onTaskUpdated(updatedTask);
                setCommentText('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setPostingComment(false);
        }
    };

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h4>{task.title}</h4>
                <div className="task-menu">
                    <button className="menu-btn" onClick={() => setShowOptions(!showOptions)}>
                        ⋯
                    </button>
                    {showOptions && (
                        <div className="task-options">
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {task.description && <p className="task-description">{task.description}</p>}

            <div className="task-meta">
                {task.priority && (
                    <span className="priority-badge" style={{ backgroundColor: priorityColors[task.priority] }}>
                        {task.priority}
                    </span>
                )}
                {task.dueDate && (
                    <span className="due-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
            </div>

            {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                    {task.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
                <div className="task-subtasks">
                    <span className="subtask-count">
                        {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                    </span>
                </div>
            )}

            {task.assignee && (
                <div className="task-assignee">
                    <span className="avatar">👤</span>
                    <span>{task.assignee.name}</span>
                </div>
            )}

            {task.comments && task.comments.length > 0 && (
                <div className="task-comments-preview">
                    <h5>Comments</h5>
                    {task.comments.slice(-2).map((comment) => (
                        <div key={comment._id} className="comment-preview">
                            <strong>{comment.author?.name || 'Unknown'}</strong>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                    <span className="comment-count">{task.comments.length} total</span>
                </div>
            )}

            <form className="task-comment-form" onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment with @email to tag a teammate"
                />
                <button type="submit" disabled={postingComment}>
                    {postingComment ? 'Posting...' : 'Comment'}
                </button>
            </form>

            <div className="status-actions">
                <button onClick={() => handleStatusChange('todo')}>To Do</button>
                <button onClick={() => handleStatusChange('in-progress')}>In Progress</button>
                <button onClick={() => handleStatusChange('review')}>Review</button>
                <button onClick={() => handleStatusChange('completed')}>Done</button>
            </div>
        </div>
    );
}

export default TaskCard;
