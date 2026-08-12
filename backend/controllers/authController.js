/**
 * controllers/authController.js - Authentication Controller
 * Fence Depot Estimator Backend
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In a real app, this would use a database.
// For demo, we use a simple in-memory store that mirrors the Mongoose User model.
const getUser = async (filter) => {
    // This is replaced at runtime by the Mongoose User model from server.js
    const User = require('../server').User;
    if (filter.username) return User.findOne({ username: filter.username });
    if (filter._id) return User.findById(filter._id);
    return null;
};

const authController = {
    /**
     * POST /api/auth/login
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }

            const User = require('../server').User;
            const user = await User.findOne({ username: username.trim().toLowerCase() });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'fence_estimator_secret_change_in_production',
                { expiresIn: '8h' }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Server error during login.' });
        }
    },

    /**
     * POST /api/auth/logout
     */
    logout(req, res) {
        // JWT is stateless; client should remove the token.
        res.json({ message: 'Logged out successfully.' });
    },

    /**
     * GET /api/auth/me
     */
    async me(req, res) {
        try {
            const User = require('../server').User;
            const user = await User.findById(req.userId).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found.' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Server error.' });
        }
    }
};

module.exports = authController;
