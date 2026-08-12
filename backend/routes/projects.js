const express = require('express');
const { listProjects, getProject, createProject } = require('../controllers/projectController');
const { routeLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/', routeLimiter, listProjects);
router.get('/:projectId', routeLimiter, getProject);
router.post('/', routeLimiter, createProject);

module.exports = router;
