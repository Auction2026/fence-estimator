const express = require('express');
const { authenticateRequest } = require('../middleware/auth');
const controller = require('../controllers/projectController');

const router = express.Router();
router.post('/', authenticateRequest, controller.createProject);
router.get('/', authenticateRequest, controller.listProjects);
router.get('/:projectId', authenticateRequest, controller.getProject);
router.put('/:projectId', authenticateRequest, controller.updateProject);

module.exports = router;
