const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validate } = require('../middleware/validation');

const router = express.Router();
const ALLOWED_SELF_REGISTER_ROLES = new Set(['estimator', 'crew']);

router.post('/register', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 }), validate], async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const safeRole = ALLOWED_SELF_REGISTER_ROLES.has(role) ? role : 'estimator';
    const user = new User({ name, email, role: safeRole });
    await user.setPassword(password);
    await user.save();
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', [body('email').isEmail(), body('password').notEmpty(), validate], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
