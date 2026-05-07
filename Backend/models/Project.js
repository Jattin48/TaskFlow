const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a project name'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
        },
        members: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'member', 'viewer'],
                default: 'member',
            },
        }],
        invites: [{
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },
            invitedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'member', 'viewer'],
                default: 'member',
            },
            status: {
                type: String,
                enum: ['pending', 'sent'],
                default: 'pending',
            },
            invitedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        status: {
            type: String,
            enum: ['active', 'archived', 'completed'],
            default: 'active',
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
        icon: {
            type: String,
            default: '📋',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
