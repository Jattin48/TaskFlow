const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    inviteMember,
    acceptInvite,
} = require('../controllers/projectController');

router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);
router.post('/:id/members', addMember);
router.post('/:id/invite', inviteMember);
router.post('/:id/accept', acceptInvite);

module.exports = router;
