const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateRequest } = require('../middleware/auth');

const router = express.Router();
const protectedRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

router.post('/', protectedRateLimit, authenticateRequest, async (req, res) => {
  try {
    const { Estimate, Project } = req.app.locals.models || {};
    const estimateMath = req.app.locals.services?.estimateMath;
    if (!Estimate || !Project || !estimateMath) {
      return res.status(503).json({ error: 'Unavailable', message: 'Estimate services are not configured' });
    }
    const { projectId, customerName, fenceType, height, linearFeet, installationType, permitCost, utilityCost, contingency } = req.body;
    if (!projectId || !customerName || !fenceType || !linearFeet) {
      return res.status(400).json({ error: 'Validation Error', message: 'projectId, customerName, fenceType and linearFeet are required' });
    }
    const materialCost = estimateMath.calculateMaterialCost(fenceType, linearFeet, height);
    const labor = estimateMath.calculateLaborCost(linearFeet, fenceType, installationType);
    const equipmentCost = estimateMath.calculateEquipmentCost(linearFeet);
    const totals = estimateMath.calculateTotal({ materialCost, laborCost: labor.cost, equipmentCost, permitCost, utilityCost, contingency });
    const estimate = new Estimate({
      estimateNumber: `EST-${Date.now()}`,
      projectId,
      customerName,
      fenceType,
      height,
      linearFeet,
      laborHours: labor.hours,
      materialCost,
      laborCost: labor.cost,
      equipmentCost,
      permitCost,
      utilityCost,
      contingency,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      estimator: req.userId,
    });
    await estimate.save();
    await Project.findOneAndUpdate({ projectId }, { status: 'estimate' });
    return res.status(201).json({ success: true, estimate });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

router.get('/:projectId', protectedRateLimit, authenticateRequest, async (req, res) => {
  try {
    const { Estimate } = req.app.locals.models || {};
    if (!Estimate) return res.status(503).json({ error: 'Unavailable', message: 'Estimate model is not configured' });
    const estimates = await Estimate.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    return res.json({ success: true, count: estimates.length, estimates });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

module.exports = router;
