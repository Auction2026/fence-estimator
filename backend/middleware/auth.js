const jwt = require('jsonwebtoken');

function auth(requiredRole) {
  return (req, res, next) => {
    const parts = (req.headers.authorization || '').trim().split(/\s+/);
    const token = parts[0] === 'Bearer' ? (parts[1] || '') : '';
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = payload;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;
