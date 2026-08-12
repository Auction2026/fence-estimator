const { rateLimit } = require('express-rate-limit');

const routeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, try again later' },
});

module.exports = { routeLimiter };
