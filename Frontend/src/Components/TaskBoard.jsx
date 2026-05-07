import React, { useState } from 'react';
import TaskCard from './TaskCard';
import '../styles/TaskBoard.css';

function TaskBoard({ tasks, onTaskUpdated, onTaskDeleted }) {
    const statuses = ['todo', 'in-progress', 'review', 'completed'];
    const statusLabels = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'review': 'Review',
        'completed': 'Completed',
    };

    const statusColors = {
        'todo': '#ef4444',
        'in-progress': '#f59e0b',
        'review': '#8b5cf6',
        'completed': '#10b981',
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="task-board">
            {statuses.map(status => (
                <div key={status} className="task-column">
                    <div className="column-header">
                        <div className="column-title">
                            <span
                                className="status-indicator"
                                style={{ backgroundColor: statusColors[status] }}
                            ></span>
                            <h3>{statusLabels[status]}</h3>
                        </div>
                        <span className="column-count">
                            {getTasksByStatus(status).length}
                        </span>
                    </div>

                    <div className="tasks-list">
                        {getTasksByStatus(status).map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onTaskUpdated={onTaskUpdated}
                                onTaskDeleted={onTaskDeleted}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskBoard;
