const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateRequest } = require('../middleware/auth');
const controller = require('../controllers/projectController');

const router = express.Router();
const protectedRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
router.post('/', protectedRateLimit, authenticateRequest, controller.createProject);
router.get('/', protectedRateLimit, authenticateRequest, controller.listProjects);
router.get('/:projectId', protectedRateLimit, authenticateRequest, controller.getProject);
router.put('/:projectId', protectedRateLimit, authenticateRequest, controller.updateProject);

module.exports = router;
