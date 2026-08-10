const Contract = require('../models/Contract');
const { sendJson } = require('../utils/helpers');
const { sendValidationErrors } = require('../middleware/validation');

async function listContracts(req, res, context) {
  return sendJson(res, 200, { data: context.db.listContracts() });
}

async function createContract(req, res, context) {
  const { errors, value } = Contract.validate(context.body);
  if (errors.length) return sendValidationErrors(res, errors);
  if (!context.db.getProject(value.projectId)) {
    return sendJson(res, 404, { error: 'Project not found.' });
  }
  return sendJson(res, 201, { data: context.db.createContract(value) });
}

async function getContract(req, res, context) {
  const contract = context.db.getContract(context.params.id);
  if (!contract) return sendJson(res, 404, { error: 'Contract not found.' });
  return sendJson(res, 200, { data: contract });
}

async function updateContract(req, res, context) {
  const existing = context.db.getContract(context.params.id);
  if (!existing) return sendJson(res, 404, { error: 'Contract not found.' });
  const merged = { ...existing, ...context.body };
  const { errors, value } = Contract.validate(merged);
  if (errors.length) return sendValidationErrors(res, errors);
  return sendJson(res, 200, { data: context.db.updateContract(existing.id, value) });
}

module.exports = { listContracts, createContract, getContract, updateContract };
