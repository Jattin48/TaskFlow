const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const User = require('../models/User');

const getProjectAccess = async (userId, projectId) => {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        return null;
    }

    return Project.findOne({
        _id: projectId,
        $or: [
            { owner: userId },
            { 'members.user': userId },
            { 'invites.email': currentUser.email },
        ],
    });
};

const isProjectMember = (project, userId) => {
    if (!project) return false;
    return (
        project.owner.toString() === userId ||
        project.members.some((member) => member.user.toString() === userId)
    );
};

// Get all tasks for a project
const getTasks = async (req, res) => {
    try {
        const project = await getProjectAccess(req.user.id, req.params.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignee', 'name email avatar')
            .populate('creator', 'name email avatar')
            .populate({
                path: 'comments',
                populate: [
                    { path: 'author', select: 'name email avatar' },
                    { path: 'mentions', select: 'name email avatar' },
                ],
            })
            .sort('order');

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single task
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const project = await getProjectAccess(req.user.id, task.project.toString());
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        const populatedTask = await Task.findById(req.params.id)
            .populate('assignee', 'name email avatar')
            .populate('creator', 'name email avatar')
            .populate({
                path: 'comments',
                populate: [
                    { path: 'author', select: 'name email avatar' },
                    { path: 'mentions', select: 'name email avatar' },
                ],
            });

        res.status(200).json({ success: true, task: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create task
const createTask = async (req, res) => {
    try {
        const { title, description, assignee, priority, dueDate, tags } = req.body;
        const { projectId } = req.params;

        const project = await getProjectAccess(req.user.id, projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can add tasks' });
        }

        const task = await Task.create({
            title,
            description,
            project: projectId,
            creator: req.user.id,
            assignee: assignee || null,
            priority: priority || 'medium',
            dueDate: dueDate || null,
            tags: tags || [],
        });

        await task.populate('assignee', 'name email avatar');
        await task.populate('creator', 'name email avatar');

        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const project = await getProjectAccess(req.user.id, task.project.toString());
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can update tasks' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('assignee', 'name email avatar')
            .populate('creator', 'name email avatar');

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const project = await getProjectAccess(req.user.id, task.project.toString());
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can delete tasks' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add comment to task
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { projectId } = req.params;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Comment content is required' });
        }

        const project = await getProjectAccess(req.user.id, projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can add comments' });
        }

        const task = await Task.findById(req.params.id);
        if (!task || task.project.toString() !== projectId) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const mentionPattern = /@([\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
        const mentionEmails = [];
        let match;
        while ((match = mentionPattern.exec(content))) {
            mentionEmails.push(match[1].toLowerCase());
        }

        const mentionUsers = mentionEmails.length
            ? await User.find({ email: { $in: mentionEmails } }).select('_id')
            : [];

        const comment = await Comment.create({
            content,
            author: req.user.id,
            task: task._id,
            mentions: mentionUsers.map((user) => user._id),
        });

        task.comments.push(comment._id);
        await task.save();

        await comment.populate('author', 'name email avatar');
        await comment.populate('mentions', 'name email avatar');

        res.status(201).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add subtask
const addSubtask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const project = await getProjectAccess(req.user.id, task.project.toString());
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can add subtasks' });
        }

        const { title } = req.body;
        task.subtasks.push({ title, completed: false });
        await task.save();

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update subtask
const updateSubtask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const project = await getProjectAccess(req.user.id, task.project.toString());
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or access denied' });
        }

        if (!isProjectMember(project, req.user.id)) {
            return res.status(403).json({ success: false, message: 'Only collaborators can update subtasks' });
        }

        const { subtaskId } = req.params;
        const { title, completed } = req.body;
        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) {
            return res.status(404).json({ success: false, message: 'Subtask not found' });
        }

        subtask.title = title || subtask.title;
        subtask.completed = completed !== undefined ? completed : subtask.completed;
        await task.save();

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    addSubtask,
    updateSubtask,
};
