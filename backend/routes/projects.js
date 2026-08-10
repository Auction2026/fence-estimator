const express = require('express');
const { body } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();
router.use(auth());

router.post('/', [body('projectNumber').notEmpty(), body('customerName').notEmpty(), body('address').notEmpty(), validate], async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user.sub });
    res.status(201).json(project);
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try { const item = await Project.findById(req.params.id); if (!item) return res.status(404).json({ error: 'Not found' }); return res.json(item); } catch (error) { return next(error); }
});

router.put('/:id', async (req, res, next) => {
  try { const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ error: 'Not found' }); return res.json(item); } catch (error) { return next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try { const item = await Project.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ error: 'Not found' }); return res.status(204).send(); } catch (error) { return next(error); }
});

module.exports = router;
