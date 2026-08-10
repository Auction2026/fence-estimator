const express = require('express');
const Estimate = require('../models/Estimate');
const FenceSpecs = require('../models/FenceSpecs');
const auth = require('../middleware/auth');
const { requireObjectId } = require('../middleware/validation');
const { calculateEstimate } = require('../utils/calculations');
const { generateEstimatePdf } = require('../utils/pdfGenerator');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try {
    const fenceSpecsId = req.body.fenceSpecsId ? String(req.body.fenceSpecsId) : '';
    if (fenceSpecsId && !requireObjectId(fenceSpecsId)) return res.status(400).json({ error: 'Invalid fenceSpecsId' });
    const specs = fenceSpecsId ? await FenceSpecs.findById(fenceSpecsId) : null;
    const calcInput = {
      linearFeet: specs?.linearFeet || req.body.linearFeet || 0,
      fenceHeight: specs?.heightFt || req.body.fenceHeight || 6,
      gateCount: req.body.gateCount || 0,
      laborRatePerFoot: req.body.laborRatePerFoot || 12,
      augerHours: req.body.augerHours || 0,
      truckHours: req.body.truckHours || 0
    };
    const breakdown = calculateEstimate(calcInput);
    const estimate = await Estimate.create({ ...req.body, ...breakdown, breakdown });
    res.status(201).json(estimate);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!requireObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) return res.status(404).json({ error: 'Not found' });
    return res.json(estimate);
  } catch (error) { return next(error); }
});

router.get('/:id/pdf', async (req, res, next) => {
  try {
    if (!requireObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) return res.status(404).json({ error: 'Not found' });
    return generateEstimatePdf(res, estimate);
  } catch (error) { return next(error); }
});

module.exports = router;
