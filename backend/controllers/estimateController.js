const Estimate = require('../models/Estimate');

async function createEstimate(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.projectId) return res.status(400).json({ message: 'projectId required' });
    const estimate = await Estimate.create(payload);
    return res.status(201).json(estimate);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create estimate' });
  }
}

async function getEstimatesForProject(req, res) {
  try {
    const estimates = await Estimate.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    return res.json(estimates);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load estimates' });
  }
}

module.exports = { createEstimate, getEstimatesForProject };
