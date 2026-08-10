const express = require('express');
const Notes = require('../models/Notes');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await Notes.create({ ...req.body, createdBy: req.user.sub })); } catch (error) { next(error); }
});

router.get('/project/:projectId', async (req, res, next) => {
  try { res.json(await Notes.find({ projectId: req.params.projectId }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});

module.exports = router;
