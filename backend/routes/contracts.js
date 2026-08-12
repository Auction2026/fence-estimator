const express = require('express');
const { authenticateRequest } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateRequest, async (req, res) => {
  try {
    const { Contract, Estimate, Project } = req.app.locals.models || {};
    if (!Contract || !Estimate || !Project) {
      return res.status(503).json({ error: 'Unavailable', message: 'Contract services are not configured' });
    }
    const { estimateNumber, projectId, customerName, scopeOfWork, depositAmount, warranty, terms } = req.body;
    if (!estimateNumber || !projectId || !customerName) {
      return res.status(400).json({ error: 'Validation Error', message: 'estimateNumber, projectId and customerName are required' });
    }
    const estimate = await Estimate.findOne({ estimateNumber });
    if (!estimate) return res.status(404).json({ error: 'Not Found', message: 'Estimate not found' });
    const contract = new Contract({
      contractNumber: `CON-${Date.now()}`,
      estimateNumber,
      projectId,
      customerName,
      scopeOfWork: scopeOfWork || 'Installation of fence as per specifications',
      materials: `Fence Type: ${estimate.fenceType}, Linear Feet: ${estimate.linearFeet}`,
      labor: `Estimated Labor Hours: ${estimate.laborHours}`,
      timeline: '2-4 weeks',
      totalPrice: estimate.total,
      priceLocked: true,
      depositAmount: depositAmount || Math.round(estimate.total * 0.25 * 100) / 100,
      warranty: warranty || '2 years on materials, 1 year on labor',
      terms: terms || 'Deposit due upon signing. Balance due upon completion.',
    });
    await contract.save();
    await Project.findOneAndUpdate({ projectId }, { status: 'contract' });
    return res.status(201).json({ success: true, contract });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

router.get('/:projectId', authenticateRequest, async (req, res) => {
  try {
    const { Contract } = req.app.locals.models || {};
    if (!Contract) return res.status(503).json({ error: 'Unavailable', message: 'Contract model is not configured' });
    const contracts = await Contract.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    return res.json({ success: true, count: contracts.length, contracts });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

module.exports = router;
