const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.originalUrl });
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const safeMessage = status >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err.message || 'Internal server error');
  return res.status(status).json({ error: safeMessage });
}

module.exports = errorHandler;
