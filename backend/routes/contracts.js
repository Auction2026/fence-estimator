const express = require('express');
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');
const { generateContractPdf } = require('../utils/pdfGenerator');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await Contract.create({ ...req.body, priceLocked: true })); } catch (error) { next(error); }
});

router.put('/:id/lock', async (req, res, next) => {
  try { const item = await Contract.findByIdAndUpdate(req.params.id, { priceLocked: true }, { new: true }); if (!item) return res.status(404).json({ error: 'Not found' }); return res.json(item); } catch (error) { return next(error); }
});

router.get('/:id/pdf', async (req, res, next) => {
  try { const contract = await Contract.findById(req.params.id); if (!contract) return res.status(404).json({ error: 'Not found' }); return generateContractPdf(res, contract); } catch (error) { return next(error); }
});

module.exports = router;
