const Estimate = require('../models/Estimate');

async function createEstimate(req, res) {
  const payload = req.body || {};
  if (!payload.projectId) return res.status(400).json({ message: 'projectId required' });
  const estimate = await Estimate.create(payload);
  return res.status(201).json(estimate);
}

async function getEstimatesForProject(req, res) {
  const estimates = await Estimate.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
  return res.json(estimates);
}

module.exports = { createEstimate, getEstimatesForProject };
