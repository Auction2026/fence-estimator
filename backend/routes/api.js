/**
 * routes/api.js - API Routes
 * Fence Depot Estimator Backend
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

// Rate limiter for auth endpoints (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});

// Rate limiter for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});

// ============================================================
// AUTH ROUTES (no authentication required)
// ============================================================
router.post('/auth/login',  authLimiter, authController.login);
router.post('/auth/logout', authLimiter, authController.logout);

// ============================================================
// PROTECTED ROUTES (authentication required)
// ============================================================
router.use(authenticate);
router.use(apiLimiter);

// Auth - get current user
router.get('/auth/me', authController.me);

// Estimates
router.get('/estimates',         projectController.listEstimates);
router.get('/estimates/:id',     projectController.getEstimate);
router.post('/estimates',        projectController.createEstimate);
router.put('/estimates/:id',     projectController.updateEstimate);
router.delete('/estimates/:id',  projectController.deleteEstimate);

// Customers
router.get('/customers',        projectController.listCustomers);
router.get('/customers/:id',    projectController.getCustomer);
router.post('/customers',       projectController.createCustomer);
router.put('/customers/:id',    projectController.updateCustomer);

// Inventory
router.get('/inventory',        projectController.listInventory);
router.get('/inventory/:plu',   projectController.getInventoryItem);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
