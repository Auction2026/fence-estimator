/**
 * FENCE DEPOT ESTIMATOR - Authentication Middleware
 * backend/middleware/auth.js
 */

'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Set it in your .env file before starting the server.');
  process.exit(1);
}
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

// ---- Generate token ----
function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ---- Required auth middleware ----
function required(req, res, next) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired - please log in again' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ---- Admin only middleware ----
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

// ---- Optional auth (does not reject, just attaches user if present) ----
function optional(req, res, next) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), JWT_SECRET);
    } catch (_) {
      req.user = null;
    }
  }
  next();
}

module.exports = { generateToken, required, adminOnly, optional };
