const express = require('express');
const SignOff = require('../models/SignOff');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth());

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await SignOff.create(req.body)); } catch (error) { next(error); }
});

router.get('/project/:projectId', async (req, res, next) => {
  try { res.json(await SignOff.find({ projectId: req.params.projectId })); } catch (error) { next(error); }
});

module.exports = router;
