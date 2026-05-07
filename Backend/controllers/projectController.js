const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// Get all projects for a user, including pending invites
const getProjects = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id },
                { 'invites.email': currentUser.email },
            ],
        })
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar')
            .populate('invites.invitedBy', 'name email avatar')
            .sort('-createdAt');

        const projectsWithStatus = projects.map((project) => {
            const invited = project.invites.some(
                (invite) => invite.email.toLowerCase() === currentUser.email.toLowerCase()
            );
            return {
                ...project.toObject(),
                inviteStatus: invited ? 'pending' : undefined,
            };
        });

        res.status(200).json({ success: true, projects: projectsWithStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single project with access check
const getProject = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id },
                { 'invites.email': currentUser.email },
            ],
        })
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar')
            .populate('invites.invitedBy', 'name email avatar');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        const invited = project.invites.some(
            (invite) => invite.email.toLowerCase() === currentUser.email.toLowerCase()
        );

        const output = {
            ...project.toObject(),
            inviteStatus: invited ? 'pending' : undefined,
        };

        res.status(200).json({ success: true, project: output });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create project
const createProject = async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        const project = await Project.create({
            name,
            description,
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'admin' }],
            color: color || '#3b82f6',
            icon: icon || '📋',
        });

        await project.populate('owner', 'name email avatar');

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update project
const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
        }

        // Delete all tasks in the project
        await Task.deleteMany({ project: req.params.id });

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addMember = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const memberExists = project.members.some(m => m.user.toString() === userId);
        if (memberExists) {
            return res.status(400).json({ success: false, message: 'User already a member' });
        }

        project.members.push({ user: userId, role: role || 'member' });
        await project.save();
        await project.populate('members.user', 'name email avatar');

        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const inviteMember = async (req, res) => {
    try {
        const { email, role } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const hasPermission = project.owner.toString() === req.user.id || project.members.some(
            (member) => member.user.toString() === req.user.id && member.role === 'admin'
        );

        if (!hasPermission) {
            return res.status(403).json({ success: false, message: 'Not authorized to invite collaborators' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email to invite' });
        }

        if (normalizedEmail === currentUser.email.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Cannot invite yourself' });
        }

        const alreadyMember = project.members.some((member) => {
            return member.user && member.user.toString() === req.user.id && member.role;
        });

        if (alreadyMember && normalizedEmail === currentUser.email.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'User is already a member' });
        }

        const targetUser = await User.findOne({ email: normalizedEmail });
        const memberExists = targetUser && project.members.some((member) => member.user.toString() === targetUser._id.toString());
        const inviteExists = project.invites.some((invite) => invite.email === normalizedEmail);

        if (memberExists) {
            return res.status(400).json({ success: false, message: 'User already a member' });
        }

        if (inviteExists) {
            return res.status(400).json({ success: false, message: 'User already invited' });
        }

        if (targetUser) {
            project.members.push({ user: targetUser._id, role: role || 'member' });
        } else {
            project.invites.push({
                email: normalizedEmail,
                invitedBy: req.user.id,
                role: role || 'member',
            });
        }

        await project.save();
        await project.populate('owner', 'name email avatar');
        await project.populate('members.user', 'name email avatar');
        await project.populate('invites.invitedBy', 'name email avatar');

        const message = targetUser
            ? 'Collaborator added to project'
            : 'Invitation created, pending acceptance';

        res.status(200).json({ success: true, message, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const acceptInvite = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const inviteIndex = project.invites.findIndex(
            (invite) => invite.email.toLowerCase() === currentUser.email.toLowerCase()
        );

        if (inviteIndex === -1) {
            return res.status(400).json({ success: false, message: 'No pending invitation found' });
        }

        const invite = project.invites[inviteIndex];
        const alreadyMember = project.members.some(
            (member) => member.user.toString() === req.user.id
        );

        if (alreadyMember) {
            project.invites.splice(inviteIndex, 1);
        } else {
            project.members.push({ user: req.user.id, role: invite.role || 'member' });
            project.invites.splice(inviteIndex, 1);
        }

        await project.save();
        await project.populate('owner', 'name email avatar');
        await project.populate('members.user', 'name email avatar');
        await project.populate('invites.invitedBy', 'name email avatar');

        res.status(200).json({ success: true, message: 'Joined project successfully', project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    inviteMember,
    acceptInvite,
};
