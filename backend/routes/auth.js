const { createRoute } = require('../utils/helpers');
const authController = require('../controllers/authController');

module.exports = [
  createRoute('POST', '/api/auth/register', authController.register),
  createRoute('POST', '/api/auth/login', authController.login),
  createRoute('GET', '/api/auth/me', authController.me, { auth: true })
];
