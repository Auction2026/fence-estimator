/**
 * FENCE DEPOT ESTIMATOR - API Routes
 * backend/routes/api.js
 */

'use strict';

const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const controller = require('../controllers/projectController');

// ============================================================
// AUTH ROUTES (public)
// ============================================================
router.post('/auth/login',    controller.login);
router.post('/auth/register', controller.register);
router.post('/auth/logout',   controller.logout);

// ============================================================
// PROJECT ROUTES (protected)
// ============================================================
router.get('/projects',          auth.required, controller.getProjects);
router.post('/projects',         auth.required, controller.createProject);
router.get('/projects/:id',      auth.required, controller.getProject);
router.put('/projects/:id',      auth.required, controller.updateProject);
router.delete('/projects/:id',   auth.required, controller.deleteProject);

// Estimate
router.post('/projects/:id/estimate',  auth.required, controller.saveEstimate);
router.get('/projects/:id/estimate',   auth.required, controller.getEstimate);
router.post('/estimates/calculate',    auth.required, controller.calculateEstimate);

// Contract
router.post('/projects/:id/contract/lock',      auth.required, controller.lockContract);
router.post('/projects/:id/contract/signature', auth.required, controller.saveSignature);

// Change orders
router.get('/projects/:id/change-orders',           auth.required, controller.getChangeOrders);
router.post('/projects/:id/change-orders',          auth.required, controller.createChangeOrder);
router.put('/projects/:id/change-orders/:orderId',  auth.required, controller.updateChangeOrder);
router.delete('/projects/:id/change-orders/:orderId', auth.required, controller.deleteChangeOrder);

// PDF & Email
router.get('/projects/:id/pdf/:type',  auth.required, controller.generatePDF);
router.post('/projects/:id/email',     auth.required, controller.sendEmail);

// ============================================================
// PRODUCTS / CATALOG (protected)
// ============================================================
router.get('/products',    auth.required, controller.getProducts);
router.get('/products/:id',auth.required, controller.getProduct);

// ============================================================
// ADMIN ROUTES (admin only)
// ============================================================
router.get('/admin/stats', auth.required, auth.adminOnly, controller.getAdminStats);
router.get('/admin/users', auth.required, auth.adminOnly, controller.getUsers);

// ============================================================
// HEALTH CHECK (public)
// ============================================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

module.exports = router;
