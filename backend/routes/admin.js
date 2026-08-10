const { createRoute } = require('../utils/helpers');
const adminController = require('../controllers/adminController');

module.exports = [
  createRoute('GET', '/api/admin/dashboard', adminController.dashboard, { auth: true }),
  createRoute('GET', '/api/admin/catalog', adminController.catalog, { auth: true })
];
