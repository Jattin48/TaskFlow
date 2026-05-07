const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a team name'],
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
        members: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['owner', 'admin', 'member'],
                default: 'member',
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        projects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        }],
        settings: {
            isPublic: { type: Boolean, default: false },
            allowInvites: { type: Boolean, default: true },
        },
        avatar: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
