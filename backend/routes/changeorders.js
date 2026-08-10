const express = require('express');
const ChangeOrder = require('../models/ChangeOrder');
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');
const { requireObjectId } = require('../middleware/validation');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try {
    const contractId = String(req.body.contractId || '');
    if (!requireObjectId(contractId)) return res.status(400).json({ error: 'Invalid contractId' });
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (!contract.priceLocked) return res.status(409).json({ error: 'Contract price must be locked before change orders' });
    const changeOrder = await ChangeOrder.create(req.body);
    return res.status(201).json(changeOrder);
  } catch (error) { return next(error); }
});

router.put('/:id/approve', async (req, res, next) => {
  try { const item = await ChangeOrder.findByIdAndUpdate(req.params.id, { approved: true }, { new: true }); if (!item) return res.status(404).json({ error: 'Not found' }); return res.json(item); } catch (error) { return next(error); }
});

module.exports = router;
