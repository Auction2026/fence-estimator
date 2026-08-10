const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth('admin'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const [userCount, projectCount, inventoryCount] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Inventory.countDocuments()
    ]);
    res.json({ userCount, projectCount, inventoryCount });
  } catch (error) { next(error); }
});

router.get('/users', async (req, res, next) => {
  try { res.json(await User.find({}, 'name email role createdAt')); } catch (error) { next(error); }
});

module.exports = router;
