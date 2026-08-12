/**
 * FENCE DEPOT ESTIMATOR - API Routes
 * backend/routes/api.js
 */

'use strict';

const express    = require('express');
const rateLimit  = require('express-rate-limit');
const router     = express.Router();
const auth       = require('../middleware/auth');
const controller = require('../controllers/projectController');

// ============================================================
// RATE LIMITERS
// ============================================================

// Strict limiter for auth endpoints (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// General limiter for all other API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// ============================================================
// AUTH ROUTES (public)
// ============================================================
router.post('/auth/login',    authLimiter, controller.login);
router.post('/auth/register', authLimiter, controller.register);
router.post('/auth/logout',   authLimiter, controller.logout);

// ============================================================
// PROJECT ROUTES (protected)
// ============================================================
router.get('/projects',          generalLimiter, auth.required, controller.getProjects);
router.post('/projects',         generalLimiter, auth.required, controller.createProject);
router.get('/projects/:id',      generalLimiter, auth.required, controller.getProject);
router.put('/projects/:id',      generalLimiter, auth.required, controller.updateProject);
router.delete('/projects/:id',   generalLimiter, auth.required, controller.deleteProject);

// Estimate
router.post('/projects/:id/estimate',  generalLimiter, auth.required, controller.saveEstimate);
router.get('/projects/:id/estimate',   generalLimiter, auth.required, controller.getEstimate);
router.post('/estimates/calculate',    generalLimiter, auth.required, controller.calculateEstimate);

// Contract
router.post('/projects/:id/contract/lock',      generalLimiter, auth.required, controller.lockContract);
router.post('/projects/:id/contract/signature', generalLimiter, auth.required, controller.saveSignature);

// Change orders
router.get('/projects/:id/change-orders',           generalLimiter, auth.required, controller.getChangeOrders);
router.post('/projects/:id/change-orders',          generalLimiter, auth.required, controller.createChangeOrder);
router.put('/projects/:id/change-orders/:orderId',  generalLimiter, auth.required, controller.updateChangeOrder);
router.delete('/projects/:id/change-orders/:orderId', generalLimiter, auth.required, controller.deleteChangeOrder);

// PDF & Email
router.get('/projects/:id/pdf/:type',  generalLimiter, auth.required, controller.generatePDF);
router.post('/projects/:id/email',     generalLimiter, auth.required, controller.sendEmail);

// ============================================================
// PRODUCTS / CATALOG (protected)
// ============================================================
router.get('/products',    generalLimiter, auth.required, controller.getProducts);
router.get('/products/:id',generalLimiter, auth.required, controller.getProduct);

// ============================================================
// ADMIN ROUTES (admin only)
// ============================================================
router.get('/admin/stats', generalLimiter, auth.required, auth.adminOnly, controller.getAdminStats);
router.get('/admin/users', generalLimiter, auth.required, auth.adminOnly, controller.getUsers);

// ============================================================
// HEALTH CHECK (public)
// ============================================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

module.exports = router;
