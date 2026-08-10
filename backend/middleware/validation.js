const { sendJson } = require('../utils/helpers');

function sendValidationErrors(res, errors) {
  sendJson(res, 422, { error: 'Validation failed.', details: errors });
}

function requireFields(body, fields = []) {
  return fields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });
}

module.exports = { sendValidationErrors, requireFields };
