const express = require('express');
const { createEstimate, getEstimatesForProject } = require('../controllers/estimateController');

const router = express.Router();

router.post('/', createEstimate);
router.get('/project/:projectId', getEstimatesForProject);

module.exports = router;
