const express = require('express');
const Estimate = require('../models/Estimate');
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');
const { generateEstimatePdf, generateContractPdf } = require('../utils/pdfGenerator');

const router = express.Router();
router.use(auth());

router.get('/estimate/:id', async (req, res, next) => {
  try { const estimate = await Estimate.findById(req.params.id); if (!estimate) return res.status(404).json({ error: 'Not found' }); return generateEstimatePdf(res, estimate); } catch (error) { return next(error); }
});

router.get('/contract/:id', async (req, res, next) => {
  try { const contract = await Contract.findById(req.params.id); if (!contract) return res.status(404).json({ error: 'Not found' }); return generateContractPdf(res, contract); } catch (error) { return next(error); }
});

module.exports = router;
