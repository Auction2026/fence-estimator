const crypto = require('crypto');
const User = require('../models/User');
const { sendJson } = require('../utils/helpers');
const { sendValidationErrors } = require('../middleware/validation');
const { createToken } = require('../middleware/auth');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function register(req, res, context) {
  const { errors, value } = User.validate(context.body);
  if (errors.length) return sendValidationErrors(res, errors);

  if (context.db.findUserByEmail(value.email)) {
    return sendJson(res, 409, { error: 'User already exists.' });
  }

  const user = context.db.createUser({
    name: value.name,
    email: value.email,
    passwordHash: hashPassword(value.password),
    role: value.role
  });

  const token = createToken({ userId: user.id, role: user.role }, context.env.APP_SECRET);
  return sendJson(res, 201, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function login(req, res, context) {
  const email = String(context.body.email || '').trim().toLowerCase();
  const password = String(context.body.password || '');
  const user = context.db.findUserByEmail(email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return sendJson(res, 401, { error: 'Invalid email or password.' });
  }

  context.db.createSession({ userId: user.id });
  const token = createToken({ userId: user.id, role: user.role }, context.env.APP_SECRET);
  return sendJson(res, 200, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function me(req, res, context) {
  return sendJson(res, 200, { user: { id: context.user.id, name: context.user.name, email: context.user.email, role: context.user.role } });
}

module.exports = { register, login, me };
