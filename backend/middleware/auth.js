const crypto = require('crypto');
const { sendJson } = require('../utils/helpers');

function createToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyToken(token, secret) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (signature !== expected) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function requireAuth(req, res, context) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token, context.env.APP_SECRET);

  if (!payload) {
    sendJson(res, 401, { error: 'Authentication required.' });
    return null;
  }

  const user = context.db.getUser(payload.userId);
  if (!user) {
    sendJson(res, 401, { error: 'User not found.' });
    return null;
  }

  return user;
}

module.exports = { createToken, verifyToken, requireAuth };
