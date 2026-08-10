const { validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validation failed', details: errors.array() });
  }
  return next();
}

function requireObjectId(value) {
  return typeof value === 'string' && isValidObjectId(value);
}

module.exports = { validate, requireObjectId };
