const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'change-me-in-production') {
    throw new Error('JWT_SECRET must be configured before protected routes can be used');
  }
  return secret;
}

function extractBearerToken(headerValue = '') {
  if (!headerValue.startsWith('Bearer ')) return '';
  return headerValue.slice(7).trim();
}

function authenticateRequest(req, res, next) {
  const token = extractBearerToken(req.header('Authorization') || '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided', message: 'Authorization denied. Please login first.' });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    return next();
  } catch (error) {
    if (error.message.includes('JWT_SECRET must be configured')) {
      return res.status(500).json({ error: 'Configuration Error', message: error.message });
    }
    return res.status(401).json({ error: 'Invalid token', message: 'Token is not valid or has expired' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
    }
    return next();
  };
}

module.exports = { extractBearerToken, authenticateRequest, authorizeRoles, getJwtSecret };
