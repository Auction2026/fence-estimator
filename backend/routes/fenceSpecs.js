const express = require('express');
const FenceSpecs = require('../models/FenceSpecs');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await FenceSpecs.create(req.body)); } catch (error) { next(error); }
});
router.get('/project/:projectId', async (req, res, next) => {
  try { res.json(await FenceSpecs.find({ projectId: req.params.projectId })); } catch (error) { next(error); }
});
router.put('/:id', async (req, res, next) => {
  try { const item = await FenceSpecs.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ error: 'Not found' }); return res.json(item); } catch (error) { return next(error); }
});
module.exports = router;
