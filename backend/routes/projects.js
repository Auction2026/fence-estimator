'use strict';

/**
 * @module routes/projects
 * Express router for project CRUD, project summaries, duplication, and exports.
 */

const express = require('express');
const projectController = require('../controllers/projectController');
const {
  verifyToken,
  rateLimiter,
  requestLogger,
} = require('../middleware/auth');

const router = express.Router();

function validateIdentifier(req, res, next) {
  const identifier = String(req.params.id || '').trim();
  if (!identifier) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PROJECT_ID_REQUIRED',
        message: 'A project identifier is required.',
      },
    });
  }
  return next();
}

function validateBodyObject(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST_BODY',
        message: 'Request body must be a JSON object.',
      },
    });
  }
  return next();
}

function validateProjectCreateShape(req, res, next) {
  const required = [
    'customerName',
    'customerEmail',
    'customerPhone',
    'address',
    'city',
    'province',
    'postalCode',
  ];

  const missing = required.filter((field) => !req.body[field]);
  if (missing.length) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PROJECT_REQUIRED_FIELDS_MISSING',
        message: 'Missing required project fields.',
        details: missing,
      },
    });
  }

  return next();
}

function validateProjectUpdateShape(req, res, next) {
  if (Object.keys(req.body || {}).length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PROJECT_UPDATE_EMPTY',
        message: 'Provide at least one field to update.',
      },
    });
  }
  return next();
}

router.use(requestLogger);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 400 }));
router.use(verifyToken);

router
  .route('/')
  .get(projectController.getProjects)
  .post(validateBodyObject, validateProjectCreateShape, projectController.createProject);

router.get('/:id/summary', validateIdentifier, projectController.getProjectSummary);
router.get('/:id/export', validateIdentifier, projectController.exportProject);
router.post('/:id/duplicate', validateIdentifier, validateBodyObject, projectController.duplicateProject);

router
  .route('/:id')
  .get(validateIdentifier, projectController.getProjectById)
  .put(validateIdentifier, validateBodyObject, validateProjectUpdateShape, projectController.updateProject)
  .delete(validateIdentifier, projectController.deleteProject);

module.exports = router;
