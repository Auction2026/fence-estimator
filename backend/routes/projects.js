const express = require('express');
const { listProjects, getProject, createProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/', listProjects);
router.get('/:projectId', getProject);
router.post('/', createProject);

module.exports = router;
