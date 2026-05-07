const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'review', 'completed'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        tags: [{
            type: String,
        }],
        subtasks: [{
            title: String,
            completed: Boolean,
            createdAt: { type: Date, default: Date.now },
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        attachments: [{
            url: String,
            name: String,
            uploadedAt: { type: Date, default: Date.now },
        }],
        estimatedHours: {
            type: Number,
            default: 0,
        },
        actualHours: {
            type: Number,
            default: 0,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
