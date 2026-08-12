'use strict';

/**
 * @module middleware/auth
 * Authentication, authorization, rate limiting, request logging, and error handling middleware.
 */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const RATE_LIMIT_STORE = new Map();
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 250;

function log(level, message, meta) {
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  const printer = level === 'error' ? console.error : console.log;
  printer(`[auth:${level}] ${new Date().toISOString()} ${message}${payload}`);
}

function createHttpError(status, message, details, code) {
  const error = new Error(message);
  error.status = status;
  if (details) {
    error.details = details;
  }
  if (code) {
    error.code = code;
  }
  return error;
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'fence-estimator-secret-key';
}

function parseBearerToken(headerValue) {
  if (!headerValue || typeof headerValue !== 'string') {
    return null;
  }

  const [scheme, token] = headerValue.trim().split(/\s+/);
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return token;
}

async function loadUser(userId) {
  const User = mongoose.models.User;
  if (!User || !userId) {
    return null;
  }

  try {
    return await User.findById(userId).select('-password');
  } catch (error) {
    log('error', 'Failed to load user for token validation', {
      userId,
      message: error.message,
    });
    return null;
  }
}

async function verifyToken(req, res, next) {
  try {
    const token = parseBearerToken(req.headers.authorization || req.header('Authorization'));

    if (!token) {
      throw createHttpError(
        401,
        'Authorization token is required.',
        { header: 'Authorization: ******' },
        'AUTH_TOKEN_MISSING'
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Authentication token has expired.', null, 'AUTH_TOKEN_EXPIRED');
      }
      throw createHttpError(401, 'Authentication token is invalid.', null, 'AUTH_TOKEN_INVALID');
    }

    const user = await loadUser(decoded.userId || decoded.id);
    const resolvedUserId = decoded.userId || decoded.id;

    req.token = token;
    req.userId = resolvedUserId;
    req.userRole = user ? user.role : decoded.role;
    req.user = user
      ? {
          _id: user._id,
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          company: user.company,
          phone: user.phone,
        }
      : {
          _id: resolvedUserId,
          id: resolvedUserId,
          role: decoded.role,
          tokenOnly: true,
        };

    if (user && user.status === 'disabled') {
      throw createHttpError(403, 'User account is disabled.', null, 'AUTH_ACCOUNT_DISABLED');
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

function requireRole(...roles) {
  const normalizedRoles = roles.flat().filter(Boolean);

  return (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, 'Authentication required before checking roles.', null, 'AUTH_REQUIRED'));
    }

    if (normalizedRoles.length === 0) {
      return next();
    }

    if (!normalizedRoles.includes(req.user.role)) {
      return next(
        createHttpError(
          403,
          'You do not have permission to access this resource.',
          { allowedRoles: normalizedRoles, actualRole: req.user.role },
          'AUTH_ROLE_FORBIDDEN'
        )
      );
    }

    return next();
  };
}

function getRateLimitKey(req, keyGenerator) {
  if (typeof keyGenerator === 'function') {
    return keyGenerator(req);
  }

  const userPart = req.userId || req.ip || 'anonymous';
  const routePart = req.baseUrl || req.path || 'global';
  return `${userPart}:${routePart}`;
}

function pruneRateLimitStore(now) {
  for (const [key, entry] of RATE_LIMIT_STORE.entries()) {
    if (entry.resetAt <= now) {
      RATE_LIMIT_STORE.delete(key);
    }
  }
}

function rateLimiter(options) {
  const config = {
    windowMs: DEFAULT_WINDOW_MS,
    max: DEFAULT_MAX_REQUESTS,
    keyGenerator: null,
    ...options,
  };

  return (req, res, next) => {
    const now = Date.now();
    pruneRateLimitStore(now);

    const key = getRateLimitKey(req, config.keyGenerator);
    const currentEntry = RATE_LIMIT_STORE.get(key);

    if (!currentEntry || currentEntry.resetAt <= now) {
      RATE_LIMIT_STORE.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });

      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(config.max - 1, 0));
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + config.windowMs) / 1000));
      return next();
    }

    currentEntry.count += 1;
    RATE_LIMIT_STORE.set(key, currentEntry);

    const remaining = Math.max(config.max - currentEntry.count, 0);
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(currentEntry.resetAt / 1000));

    if (currentEntry.count > config.max) {
      const retryAfterSeconds = Math.max(Math.ceil((currentEntry.resetAt - now) / 1000), 1);
      res.setHeader('Retry-After', retryAfterSeconds);
      return next(
        createHttpError(
          429,
          'Too many requests. Please try again later.',
          { retryAfterSeconds, key },
          'RATE_LIMIT_EXCEEDED'
        )
      );
    }

    return next();
  };
}

function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const requestId = `${startedAt}-${Math.random().toString(36).slice(2, 8)}`;

  req.requestId = requestId;

  log('info', 'Incoming request', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: req.userId || null,
  });

  res.on('finish', () => {
    log('info', 'Request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: req.userId || null,
    });
  });

  next();
}

function normalizeError(err) {
  if (!err) {
    return createHttpError(500, 'An unknown error occurred.', null, 'UNKNOWN_ERROR');
  }

  if (err.status) {
    return err;
  }

  if (err.name === 'ValidationError') {
    return createHttpError(
      400,
      'Validation failed.',
      Object.values(err.errors || {}).map((item) => item.message),
      'MONGOOSE_VALIDATION_ERROR'
    );
  }

  if (err.name === 'CastError') {
    return createHttpError(
      400,
      'Invalid identifier supplied.',
      { path: err.path, value: err.value },
      'MONGOOSE_CAST_ERROR'
    );
  }

  if (err.code === 11000) {
    return createHttpError(
      409,
      'A record with the same unique value already exists.',
      { duplicateKey: err.keyValue || null },
      'MONGOOSE_DUPLICATE_KEY'
    );
  }

  if (err.name === 'JsonWebTokenError') {
    return createHttpError(401, 'Authentication token is invalid.', null, 'AUTH_TOKEN_INVALID');
  }

  if (err.name === 'TokenExpiredError') {
    return createHttpError(401, 'Authentication token has expired.', null, 'AUTH_TOKEN_EXPIRED');
  }

  return createHttpError(500, err.message || 'Internal server error.', err.details, err.code || 'INTERNAL_SERVER_ERROR');
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (res.headersSent) {
    return next(err);
  }

  const normalizedError = normalizeError(err);

  log('error', 'Request failed', {
    requestId: req.requestId || null,
    method: req.method,
    path: req.originalUrl,
    status: normalizedError.status,
    code: normalizedError.code || 'INTERNAL_SERVER_ERROR',
    message: normalizedError.message,
  });

  return res.status(normalizedError.status).json({
    success: false,
    error: {
      code: normalizedError.code || 'INTERNAL_SERVER_ERROR',
      message: normalizedError.message,
      details: normalizedError.details || null,
    },
  });
}

module.exports = {
  verifyToken,
  requireRole,
  rateLimiter,
  requestLogger,
  errorHandler,
};
