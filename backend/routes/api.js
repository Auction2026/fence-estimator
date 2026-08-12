/**
 * routes/api.js - API Routes
 * Fence Depot Estimator Backend
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

// ============================================================
// AUTH ROUTES (no authentication required)
// ============================================================
router.post('/auth/login',  authController.login);
router.post('/auth/logout', authController.logout);

// ============================================================
// PROTECTED ROUTES (authentication required)
// ============================================================
router.use(authenticate);

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
