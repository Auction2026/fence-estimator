const express = require('express');
const { createEstimate, getEstimatesForProject } = require('../controllers/estimateController');
const { routeLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/', routeLimiter, createEstimate);
router.get('/project/:projectId', routeLimiter, getEstimatesForProject);

module.exports = router;
