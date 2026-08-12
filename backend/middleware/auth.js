const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing auth token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'fence-estimator-secret-key');
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid auth token' });
  }
}

module.exports = { requireAuth };
