const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/auth');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    addSubtask,
    updateSubtask,
} = require('../controllers/taskController');

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.post('/:id/comments', addComment);
router.post('/:id/subtasks', addSubtask);
router.put('/:id/subtasks/:subtaskId', updateSubtask);

module.exports = router;
