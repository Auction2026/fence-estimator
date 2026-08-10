const { createRoute } = require('../utils/helpers');
const contractController = require('../controllers/contractController');

module.exports = [
  createRoute('GET', '/api/contracts', contractController.listContracts, { auth: true }),
  createRoute('POST', '/api/contracts', contractController.createContract, { auth: true }),
  createRoute('GET', '/api/contracts/:id', contractController.getContract, { auth: true }),
  createRoute('PUT', '/api/contracts/:id', contractController.updateContract, { auth: true })
];
