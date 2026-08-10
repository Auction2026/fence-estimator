const { createRoute } = require('../utils/helpers');
const estimateController = require('../controllers/estimateController');

module.exports = [
  createRoute('GET', '/api/estimates', estimateController.listEstimates, { auth: true }),
  createRoute('POST', '/api/estimates', estimateController.createEstimate, { auth: true }),
  createRoute('POST', '/api/estimates/calculate', estimateController.calculate, { auth: true }),
  createRoute('GET', '/api/estimates/:id', estimateController.getEstimate, { auth: true })
];
