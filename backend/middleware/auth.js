/**
 * middleware/auth.js - JWT Authentication Middleware
 * Fence Depot Estimator Backend
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and attach user info to request
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fence_estimator_secret_change_in_production'
        );
        req.userId = decoded.userId;
        req.username = decoded.username;
        req.role = decoded.role;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
};

module.exports = { authenticate, requireAdmin };
