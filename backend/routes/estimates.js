'use strict';

/**
 * @module routes/estimates
 * Express router for estimate CRUD, calculations, PDF generation, email delivery, and revision history.
 */

const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const {
  verifyToken,
  rateLimiter,
  requestLogger,
} = require('../middleware/auth');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const ESTIMATE_STATUSES = ['draft', 'sent', 'accepted', 'rejected'];

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

function getModel(name) {
  const model = mongoose.models[name];
  if (!model) {
    throw createHttpError(500, `Mongoose model \"${name}\" is not registered.`, null, 'MODEL_NOT_REGISTERED');
  }
  return model;
}

function ensureEstimateSchemaExtensions(Estimate) {
  if (!Estimate.schema.path('versionHistory')) {
    Estimate.schema.add({
      versionHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
      emailedHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
      pdfHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
      calculatedAt: { type: Date, default: null },
      lastEmailedAt: { type: Date, default: null },
      lastPdfAt: { type: Date, default: null },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
      deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    });
  }
}

function ensureProjectSchemaExtensions(Project) {
  if (!Project.schema.path('isDeleted')) {
    Project.schema.add({
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
      deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    });
  }
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function generateEstimateNumber() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `EST-${stamp}-${random}`;
}

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function calculateMaterialCost(fenceType, linearFeet, height, barchedWire) {
  const baseCosts = {
    'Chain Link': { base: 8, perFoot: 2 },
    Wood: { base: 15, perFoot: 3.5 },
    Vinyl: { base: 12, perFoot: 4 },
    'Wrought Iron': { base: 20, perFoot: 5 },
    Composite: { base: 18, perFoot: 4.5 },
    Metal: { base: 14, perFoot: 3 },
    PVC: { base: 11, perFoot: 3.8 },
    Aluminum: { base: 13, perFoot: 3.2 },
  };

  const resolvedFence = baseCosts[fenceType] || baseCosts['Chain Link'];
  let cost = resolvedFence.base + (Number(linearFeet) || 0) * resolvedFence.perFoot;
  cost *= (Number(height) || 48) / 48;
  if (barchedWire) {
    cost += (Number(linearFeet) || 0) * 0.5;
  }
  return roundCurrency(cost);
}

function calculateLabor(linearFeet, fenceType, installationType, laborRate) {
  const baseHoursPerFoot = {
    'Chain Link': 0.015,
    Wood: 0.02,
    Vinyl: 0.018,
    'Wrought Iron': 0.025,
    Composite: 0.022,
    Metal: 0.016,
    PVC: 0.017,
    Aluminum: 0.016,
  };

  const installationMultipliers = {
    Residential: 1,
    Commercial: 1.2,
    Industrial: 1.5,
    Specialty: 1.8,
  };

  const rate = Number(laborRate) || 50;
  const hoursPerFoot = baseHoursPerFoot[fenceType] || 0.015;
  const multiplier = installationMultipliers[installationType] || 1;
  const hours = (Number(linearFeet) || 0) * hoursPerFoot * multiplier;

  return {
    hours: roundCurrency(hours),
    cost: roundCurrency(hours * rate),
  };
}

function calculateEquipmentCost(linearFeet) {
  const resolvedFeet = Number(linearFeet) || 0;
  const equipmentDailyRate = resolvedFeet > 500 ? 250 : 150;
  const estimatedDays = Math.max(Math.ceil(resolvedFeet / 200), 1);
  return roundCurrency(equipmentDailyRate * estimatedDays);
}

function calculateTotals(payload) {
  const materialCost = roundCurrency(payload.materialCost);
  const laborCost = roundCurrency(payload.laborCost);
  const equipmentCost = roundCurrency(payload.equipmentCost);
  const permitCost = roundCurrency(payload.permitCost);
  const utilityCost = roundCurrency(payload.utilityCost);
  const contingency = roundCurrency(payload.contingency);

  const subtotal = roundCurrency(materialCost + laborCost + equipmentCost + permitCost + utilityCost + contingency);
  const tax = roundCurrency(subtotal * 0.13);
  const total = roundCurrency(subtotal + tax);

  return { materialCost, laborCost, equipmentCost, permitCost, utilityCost, contingency, subtotal, tax, total };
}

function buildSort(sortBy, sortOrder) {
  const allowed = new Set(['createdAt', 'updatedAt', 'estimateNumber', 'customerName', 'status', 'total']);
  const field = allowed.has(sortBy) ? sortBy : 'createdAt';
  const direction = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;
  return { [field]: direction };
}

function buildLookup(identifier, includeDeleted) {
  const query = mongoose.Types.ObjectId.isValid(String(identifier))
    ? { $or: [{ _id: identifier }, { estimateNumber: String(identifier) }] }
    : { estimateNumber: String(identifier) };
  if (!includeDeleted) {
    query.isDeleted = { $ne: true };
  }
  return query;
}

async function loadProjectByProjectId(projectId) {
  const Project = getModel('Project');
  ensureProjectSchemaExtensions(Project);
  return Project.findOne({ projectId, isDeleted: { $ne: true } }).populate('estimator', 'username email company role');
}

function canAccessProject(req, project) {
  if (!project) {
    throw createHttpError(404, 'Project not found for estimate.', null, 'PROJECT_NOT_FOUND');
  }
  if (req.user.role === 'admin') {
    return true;
  }
  if (String(project.estimator && project.estimator._id ? project.estimator._id : project.estimator) !== String(req.user._id || req.user.id)) {
    throw createHttpError(403, 'You do not have access to this estimate.', null, 'ESTIMATE_FORBIDDEN');
  }
  return true;
}

async function loadEstimate(identifier, options) {
  const settings = { includeDeleted: false, lean: false, populateEstimator: true, ...options };
  const Estimate = getModel('Estimate');
  ensureEstimateSchemaExtensions(Estimate);

  let query = Estimate.findOne(buildLookup(identifier, settings.includeDeleted));
  if (settings.populateEstimator) {
    query = query.populate('estimator', 'username email company role');
  }
  if (settings.lean) {
    query = query.lean();
  }
  const estimate = await query.exec();
  if (!estimate) {
    throw createHttpError(404, 'Estimate not found.', null, 'ESTIMATE_NOT_FOUND');
  }
  return estimate;
}

function validateEstimatePayload(payload, partial) {
  const errors = [];
  if (!partial && !payload.projectId) {
    errors.push('projectId is required.');
  }
  if (!partial && !payload.fenceType) {
    errors.push('fenceType is required.');
  }
  if (!partial && !(Number(payload.linearFeet) > 0)) {
    errors.push('linearFeet must be greater than zero.');
  }
  if (payload.customerEmail && !EMAIL_REGEX.test(payload.customerEmail)) {
    errors.push('customerEmail must be a valid email address.');
  }
  if (payload.status && !ESTIMATE_STATUSES.includes(payload.status)) {
    errors.push(`status must be one of: ${ESTIMATE_STATUSES.join(', ')}.`);
  }
  return errors;
}

function sanitizeEstimatePayload(body) {
  const payload = {
    projectId: normalizeString(body.projectId),
    customerName: normalizeString(body.customerName),
    customerEmail: normalizeString(body.customerEmail),
    fenceType: normalizeString(body.fenceType),
    linearFeet: body.linearFeet,
    height: body.height,
    barchedWire: Boolean(body.barchedWire),
    installationType: normalizeString(body.installationType) || 'Residential',
    materialCost: body.materialCost,
    laborHours: body.laborHours,
    laborRate: body.laborRate,
    laborCost: body.laborCost,
    equipmentCost: body.equipmentCost,
    permitCost: body.permitCost,
    utilityCost: body.utilityCost,
    contingency: body.contingency,
    notes: normalizeString(body.notes),
    status: normalizeString(body.status),
    validUntil: body.validUntil,
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

function snapshotEstimate(estimate) {
  return {
    estimateNumber: estimate.estimateNumber,
    projectId: estimate.projectId,
    customerName: estimate.customerName,
    fenceType: estimate.fenceType,
    linearFeet: estimate.linearFeet,
    height: estimate.height,
    materialCost: estimate.materialCost,
    laborHours: estimate.laborHours,
    laborRate: estimate.laborRate,
    laborCost: estimate.laborCost,
    equipmentCost: estimate.equipmentCost,
    permitCost: estimate.permitCost,
    utilityCost: estimate.utilityCost,
    contingency: estimate.contingency,
    subtotal: estimate.subtotal,
    tax: estimate.tax,
    total: estimate.total,
    notes: estimate.notes,
    status: estimate.status,
    validUntil: estimate.validUntil,
  };
}

function appendVersionHistory(estimate, action, userId, note) {
  const existing = Array.isArray(estimate.versionHistory) ? estimate.versionHistory : [];
  existing.push({
    action,
    note: note || null,
    userId: userId ? String(userId) : null,
    timestamp: new Date(),
    snapshot: snapshotEstimate(estimate),
  });
  estimate.versionHistory = existing.slice(-50);
}

async function buildEstimatePdfBuffer(estimate, project) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Fence Estimate', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Estimate Number: ${estimate.estimateNumber}`);
    doc.text(`Project ID: ${estimate.projectId}`);
    doc.text(`Customer: ${estimate.customerName}`);
    if (project) {
      doc.text(`Property Address: ${project.address}, ${project.city}, ${project.province}`);
    }
    doc.text(`Fence Type: ${estimate.fenceType}`);
    doc.text(`Linear Feet: ${estimate.linearFeet}`);
    doc.text(`Height: ${estimate.height || 48}`);
    doc.text(`Status: ${estimate.status}`);
    doc.moveDown();
    doc.text(`Material Cost: $${roundCurrency(estimate.materialCost).toFixed(2)}`);
    doc.text(`Labor Hours: ${roundCurrency(estimate.laborHours).toFixed(2)}`);
    doc.text(`Labor Cost: $${roundCurrency(estimate.laborCost).toFixed(2)}`);
    doc.text(`Equipment Cost: $${roundCurrency(estimate.equipmentCost).toFixed(2)}`);
    doc.text(`Permit Cost: $${roundCurrency(estimate.permitCost).toFixed(2)}`);
    doc.text(`Utility Cost: $${roundCurrency(estimate.utilityCost).toFixed(2)}`);
    doc.text(`Contingency: $${roundCurrency(estimate.contingency).toFixed(2)}`);
    doc.moveDown();
    doc.fontSize(14).text(`Subtotal: $${roundCurrency(estimate.subtotal).toFixed(2)}`);
    doc.text(`Tax: $${roundCurrency(estimate.tax).toFixed(2)}`);
    doc.text(`Total: $${roundCurrency(estimate.total).toFixed(2)}`);
    doc.moveDown();
    if (estimate.notes) {
      doc.fontSize(12).text('Notes:', { underline: true });
      doc.text(estimate.notes);
    }

    doc.end();
  });
}

async function getTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.use(requestLogger);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 450 }));
router.use(verifyToken);

router.get('/', asyncRoute(async (req, res) => {
  const Estimate = getModel('Estimate');
  ensureEstimateSchemaExtensions(Estimate);

  const page = parseInteger(req.query.page, 1);
  const limit = Math.min(parseInteger(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const query = { isDeleted: { $ne: true } };

  if (req.query.status && ESTIMATE_STATUSES.includes(String(req.query.status))) {
    query.status = String(req.query.status);
  }
  if (req.query.projectId) {
    query.projectId = String(req.query.projectId).trim();
  }
  if (req.query.fenceType) {
    query.fenceType = new RegExp(String(req.query.fenceType).trim(), 'i');
  }
  if (req.query.q) {
    const search = new RegExp(String(req.query.q).trim(), 'i');
    query.$or = [
      { estimateNumber: search },
      { projectId: search },
      { customerName: search },
      { fenceType: search },
    ];
  }
  if (req.user.role !== 'admin') {
    query.estimator = req.user._id || req.user.id;
  } else if (req.query.estimator && mongoose.Types.ObjectId.isValid(String(req.query.estimator))) {
    query.estimator = req.query.estimator;
  }

  const [total, estimates] = await Promise.all([
    Estimate.countDocuments(query),
    Estimate.find(query)
      .populate('estimator', 'username email company role')
      .sort(buildSort(req.query.sortBy, req.query.sortOrder))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return res.status(200).json({
    success: true,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
    estimates,
  });
}));

router.post('/', asyncRoute(async (req, res) => {
  const Estimate = getModel('Estimate');
  ensureEstimateSchemaExtensions(Estimate);

  const payload = sanitizeEstimatePayload(req.body || {});
  const errors = validateEstimatePayload(payload, false);
  if (errors.length) {
    throw createHttpError(400, 'Estimate validation failed.', errors, 'ESTIMATE_VALIDATION_FAILED');
  }

  const project = await loadProjectByProjectId(payload.projectId);
  canAccessProject(req, project);

  const labor = payload.laborCost && payload.laborHours
    ? { hours: roundCurrency(payload.laborHours), cost: roundCurrency(payload.laborCost) }
    : calculateLabor(payload.linearFeet, payload.fenceType, payload.installationType, payload.laborRate);

  const totals = calculateTotals({
    materialCost: payload.materialCost || calculateMaterialCost(payload.fenceType, payload.linearFeet, payload.height, payload.barchedWire),
    laborCost: labor.cost,
    equipmentCost: payload.equipmentCost || calculateEquipmentCost(payload.linearFeet),
    permitCost: payload.permitCost || 0,
    utilityCost: payload.utilityCost || 0,
    contingency: payload.contingency || 0,
  });

  const estimate = await Estimate.create({
    estimateNumber: generateEstimateNumber(),
    projectId: payload.projectId,
    customerName: payload.customerName || project.customerName,
    fenceType: payload.fenceType,
    linearFeet: Number(payload.linearFeet),
    height: Number(payload.height) || 48,
    materialCost: totals.materialCost,
    laborHours: labor.hours,
    laborRate: Number(payload.laborRate) || 50,
    laborCost: totals.laborCost,
    equipmentCost: totals.equipmentCost,
    permitCost: totals.permitCost,
    utilityCost: totals.utilityCost,
    contingency: totals.contingency,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    notes: payload.notes || '',
    status: payload.status || 'draft',
    validUntil: payload.validUntil ? new Date(payload.validUntil) : null,
    estimator: req.user._id || req.user.id,
    calculatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const populated = await Estimate.findById(estimate._id).populate('estimator', 'username email company role');
  return res.status(201).json({
    success: true,
    message: 'Estimate created successfully.',
    estimate: populated,
    breakdown: totals,
  });
}));

router.get('/:id/versions', asyncRoute(async (req, res) => {
  const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
  const project = await loadProjectByProjectId(estimate.projectId);
  canAccessProject(req, project);

  return res.status(200).json({
    success: true,
    estimateNumber: estimate.estimateNumber,
    current: snapshotEstimate(estimate),
    versions: Array.isArray(estimate.versionHistory) ? estimate.versionHistory : [],
  });
}));

router.post('/:id/calculate', asyncRoute(async (req, res) => {
  const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
  const project = await loadProjectByProjectId(estimate.projectId);
  canAccessProject(req, project);

  appendVersionHistory(estimate, 'recalculate', req.user._id || req.user.id, 'Auto recalculation requested.');

  const payload = sanitizeEstimatePayload({ ...estimate.toObject(), ...(req.body || {}) });
  const labor = payload.laborCost && payload.laborHours
    ? { hours: roundCurrency(payload.laborHours), cost: roundCurrency(payload.laborCost) }
    : calculateLabor(payload.linearFeet, payload.fenceType, payload.installationType, payload.laborRate);
  const totals = calculateTotals({
    materialCost: payload.materialCost || calculateMaterialCost(payload.fenceType, payload.linearFeet, payload.height, payload.barchedWire),
    laborCost: labor.cost,
    equipmentCost: payload.equipmentCost || calculateEquipmentCost(payload.linearFeet),
    permitCost: payload.permitCost || 0,
    utilityCost: payload.utilityCost || 0,
    contingency: payload.contingency || 0,
  });

  estimate.customerName = payload.customerName || estimate.customerName;
  estimate.fenceType = payload.fenceType;
  estimate.linearFeet = Number(payload.linearFeet);
  estimate.height = Number(payload.height) || 48;
  estimate.materialCost = totals.materialCost;
  estimate.laborHours = labor.hours;
  estimate.laborRate = Number(payload.laborRate) || estimate.laborRate || 50;
  estimate.laborCost = totals.laborCost;
  estimate.equipmentCost = totals.equipmentCost;
  estimate.permitCost = totals.permitCost;
  estimate.utilityCost = totals.utilityCost;
  estimate.contingency = totals.contingency;
  estimate.subtotal = totals.subtotal;
  estimate.tax = totals.tax;
  estimate.total = totals.total;
  estimate.notes = payload.notes !== undefined ? payload.notes : estimate.notes;
  estimate.calculatedAt = new Date();
  estimate.updatedAt = new Date();
  await estimate.save();

  return res.status(200).json({
    success: true,
    message: 'Estimate recalculated successfully.',
    estimate,
    breakdown: totals,
  });
}));

router.post('/:id/pdf', asyncRoute(async (req, res) => {
  const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
  const project = await loadProjectByProjectId(estimate.projectId);
  canAccessProject(req, project);

  const pdfBuffer = await buildEstimatePdfBuffer(estimate, project);
  estimate.lastPdfAt = new Date();
  estimate.pdfHistory = [...(estimate.pdfHistory || []), {
    generatedAt: estimate.lastPdfAt,
    generatedBy: String(req.user._id || req.user.id),
  }].slice(-20);
  estimate.updatedAt = new Date();
  await estimate.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${estimate.estimateNumber}.pdf"`);
  return res.status(200).send(pdfBuffer);
}));

router.post('/:id/email', asyncRoute(async (req, res) => {
  const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
  const project = await loadProjectByProjectId(estimate.projectId);
  canAccessProject(req, project);

  const recipient = normalizeString(req.body && req.body.to) || project.customerEmail;
  if (!recipient || !EMAIL_REGEX.test(recipient)) {
    throw createHttpError(400, 'A valid recipient email address is required.', null, 'ESTIMATE_EMAIL_INVALID');
  }

  const pdfBuffer = await buildEstimatePdfBuffer(estimate, project);
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@fence-estimator.local',
    to: recipient,
    subject: req.body && req.body.subject ? req.body.subject : `Fence Estimate ${estimate.estimateNumber}`,
    text: req.body && req.body.message
      ? req.body.message
      : `Please find attached estimate ${estimate.estimateNumber} for project ${estimate.projectId}.`,
    attachments: [
      {
        filename: `${estimate.estimateNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  estimate.lastEmailedAt = new Date();
  estimate.emailedHistory = [...(estimate.emailedHistory || []), {
    emailedAt: estimate.lastEmailedAt,
    emailedBy: String(req.user._id || req.user.id),
    recipient,
    messageId: info.messageId || null,
  }].slice(-20);
  estimate.status = estimate.status === 'draft' ? 'sent' : estimate.status;
  estimate.updatedAt = new Date();
  await estimate.save();

  return res.status(200).json({
    success: true,
    message: 'Estimate email sent successfully.',
    recipient,
    messageId: info.messageId || null,
    preview: info.message || info.response || null,
  });
}));

router
  .route('/:id')
  .get(asyncRoute(async (req, res) => {
    const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
    const project = await loadProjectByProjectId(estimate.projectId);
    canAccessProject(req, project);

    return res.status(200).json({
      success: true,
      estimate,
      project,
    });
  }))
  .put(asyncRoute(async (req, res) => {
    const estimate = await loadEstimate(req.params.id, { populateEstimator: true });
    const project = await loadProjectByProjectId(estimate.projectId);
    canAccessProject(req, project);

    const payload = sanitizeEstimatePayload(req.body || {});
    if (Object.keys(payload).length === 0) {
      throw createHttpError(400, 'Provide at least one estimate field to update.', null, 'ESTIMATE_UPDATE_EMPTY');
    }

    const errors = validateEstimatePayload(payload, true);
    if (errors.length) {
      throw createHttpError(400, 'Estimate update validation failed.', errors, 'ESTIMATE_UPDATE_VALIDATION_FAILED');
    }

    appendVersionHistory(estimate, 'update', req.user._id || req.user.id, 'Estimate updated.');

    Object.assign(estimate, payload);

    const labor = payload.laborCost && payload.laborHours
      ? { hours: roundCurrency(payload.laborHours), cost: roundCurrency(payload.laborCost) }
      : calculateLabor(estimate.linearFeet, estimate.fenceType, estimate.installationType, estimate.laborRate);
    const totals = calculateTotals({
      materialCost: payload.materialCost !== undefined
        ? payload.materialCost
        : estimate.materialCost || calculateMaterialCost(estimate.fenceType, estimate.linearFeet, estimate.height, estimate.barchedWire),
      laborCost: labor.cost,
      equipmentCost: payload.equipmentCost !== undefined ? payload.equipmentCost : estimate.equipmentCost || calculateEquipmentCost(estimate.linearFeet),
      permitCost: payload.permitCost !== undefined ? payload.permitCost : estimate.permitCost,
      utilityCost: payload.utilityCost !== undefined ? payload.utilityCost : estimate.utilityCost,
      contingency: payload.contingency !== undefined ? payload.contingency : estimate.contingency,
    });

    estimate.materialCost = totals.materialCost;
    estimate.laborHours = labor.hours;
    estimate.laborCost = totals.laborCost;
    estimate.equipmentCost = totals.equipmentCost;
    estimate.permitCost = totals.permitCost;
    estimate.utilityCost = totals.utilityCost;
    estimate.contingency = totals.contingency;
    estimate.subtotal = totals.subtotal;
    estimate.tax = totals.tax;
    estimate.total = totals.total;
    estimate.updatedAt = new Date();

    await estimate.save();
    await estimate.populate('estimator', 'username email company role');

    return res.status(200).json({
      success: true,
      message: 'Estimate updated successfully.',
      estimate,
      breakdown: totals,
    });
  }))
  .delete(asyncRoute(async (req, res) => {
    const estimate = await loadEstimate(req.params.id, { includeDeleted: true, populateEstimator: true });
    const project = await loadProjectByProjectId(estimate.projectId);
    canAccessProject(req, project);

    if (estimate.isDeleted) {
      throw createHttpError(410, 'Estimate has already been deleted.', null, 'ESTIMATE_ALREADY_DELETED');
    }

    estimate.isDeleted = true;
    estimate.deletedAt = new Date();
    estimate.deletedBy = req.user._id || req.user.id;
    estimate.updatedAt = new Date();
    await estimate.save();

    return res.status(200).json({
      success: true,
      message: 'Estimate deleted successfully.',
      estimate: {
        id: estimate._id,
        estimateNumber: estimate.estimateNumber,
        deletedAt: estimate.deletedAt,
      },
    });
  }));

module.exports = router;
