const Estimate = require('../models/Estimate');
const { calculateEstimateBreakdown } = require('../utils/calculations');
const { sendJson } = require('../utils/helpers');
const { sendValidationErrors } = require('../middleware/validation');

async function listEstimates(req, res, context) {
  return sendJson(res, 200, { data: context.db.listEstimates() });
}

async function calculate(req, res, context) {
  const estimate = Estimate.normalize(context.body);
  return sendJson(res, 200, { data: calculateEstimateBreakdown(estimate) });
}

async function createEstimate(req, res, context) {
  const { errors, value } = Estimate.validate(context.body);
  if (errors.length) return sendValidationErrors(res, errors);
  if (!context.db.getProject(value.projectId)) {
    return sendJson(res, 404, { error: 'Project not found.' });
  }
  const breakdown = calculateEstimateBreakdown(value);
  return sendJson(res, 201, { data: context.db.createEstimate({ ...value, breakdown }) });
}

async function getEstimate(req, res, context) {
  const estimate = context.db.getEstimate(context.params.id);
  if (!estimate) return sendJson(res, 404, { error: 'Estimate not found.' });
  return sendJson(res, 200, { data: estimate });
}

module.exports = { listEstimates, calculate, createEstimate, getEstimate };
