const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.originalUrl });
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
