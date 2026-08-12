'use strict';

/**
 * @module routes/contracts
 * Express router for contract CRUD, signing, PDF generation, and status reporting.
 */

const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const {
  verifyToken,
  rateLimiter,
  requestLogger,
} = require('../middleware/auth');

const router = express.Router();
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const CONTRACT_STATUSES = ['pending', 'signed', 'active', 'completed'];

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

function ensureContractSchemaExtensions(Contract) {
  if (!Contract.schema.path('versionHistory')) {
    Contract.schema.add({
      versionHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
      pdfHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
      signedAt: { type: Date, default: null },
      signedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
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

function generateContractNumber() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CON-${stamp}-${random}`;
}

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function buildSort(sortBy, sortOrder) {
  const allowed = new Set(['createdAt', 'updatedAt', 'contractNumber', 'customerName', 'status', 'totalPrice']);
  const field = allowed.has(sortBy) ? sortBy : 'createdAt';
  const direction = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;
  return { [field]: direction };
}

function buildLookup(identifier, includeDeleted) {
  const query = mongoose.Types.ObjectId.isValid(String(identifier))
    ? { $or: [{ _id: identifier }, { contractNumber: String(identifier) }] }
    : { contractNumber: String(identifier) };
  if (!includeDeleted) {
    query.isDeleted = { $ne: true };
  }
  return query;
}

async function loadProject(projectId) {
  const Project = getModel('Project');
  ensureProjectSchemaExtensions(Project);
  return Project.findOne({ projectId, isDeleted: { $ne: true } }).populate('estimator', 'username email company role');
}

function ensureProjectAccess(req, project) {
  if (!project) {
    throw createHttpError(404, 'Project not found for contract.', null, 'PROJECT_NOT_FOUND');
  }
  if (req.user.role === 'admin') {
    return true;
  }
  if (String(project.estimator && project.estimator._id ? project.estimator._id : project.estimator) !== String(req.user._id || req.user.id)) {
    throw createHttpError(403, 'You do not have access to this contract.', null, 'CONTRACT_FORBIDDEN');
  }
  return true;
}

async function loadEstimate(estimateNumber) {
  const Estimate = getModel('Estimate');
  return Estimate.findOne({ estimateNumber });
}

async function loadContract(identifier, options) {
  const settings = { includeDeleted: false, populate: false, ...options };
  const Contract = getModel('Contract');
  ensureContractSchemaExtensions(Contract);
  const contract = await Contract.findOne(buildLookup(identifier, settings.includeDeleted));
  if (!contract) {
    throw createHttpError(404, 'Contract not found.', null, 'CONTRACT_NOT_FOUND');
  }
  return contract;
}

function sanitizeContractPayload(body) {
  const payload = {
    estimateNumber: normalizeString(body.estimateNumber),
    projectId: normalizeString(body.projectId),
    customerName: normalizeString(body.customerName),
    scopeOfWork: normalizeString(body.scopeOfWork),
    materials: normalizeString(body.materials),
    labor: normalizeString(body.labor),
    timeline: normalizeString(body.timeline),
    totalPrice: body.totalPrice,
    priceLocked: body.priceLocked,
    depositAmount: body.depositAmount,
    depositPaid: body.depositPaid,
    finalBalance: body.finalBalance,
    warranty: normalizeString(body.warranty),
    terms: normalizeString(body.terms),
    customerSignature: normalizeString(body.customerSignature),
    companySignature: normalizeString(body.companySignature),
    status: normalizeString(body.status),
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

function validateContractPayload(payload, partial) {
  const errors = [];
  if (!partial && !payload.estimateNumber) {
    errors.push('estimateNumber is required.');
  }
  if (!partial && !payload.projectId) {
    errors.push('projectId is required.');
  }
  if (payload.status && !CONTRACT_STATUSES.includes(payload.status)) {
    errors.push(`status must be one of: ${CONTRACT_STATUSES.join(', ')}.`);
  }
  return errors;
}

function snapshotContract(contract) {
  return {
    contractNumber: contract.contractNumber,
    estimateNumber: contract.estimateNumber,
    projectId: contract.projectId,
    customerName: contract.customerName,
    scopeOfWork: contract.scopeOfWork,
    materials: contract.materials,
    labor: contract.labor,
    timeline: contract.timeline,
    totalPrice: contract.totalPrice,
    depositAmount: contract.depositAmount,
    depositPaid: contract.depositPaid,
    finalBalance: contract.finalBalance,
    warranty: contract.warranty,
    terms: contract.terms,
    status: contract.status,
    customerSignDate: contract.customerSignDate,
    companySignDate: contract.companySignDate,
  };
}

function appendVersionHistory(contract, action, userId, note) {
  const existing = Array.isArray(contract.versionHistory) ? contract.versionHistory : [];
  existing.push({
    action,
    note: note || null,
    userId: userId ? String(userId) : null,
    timestamp: new Date(),
    snapshot: snapshotContract(contract),
  });
  contract.versionHistory = existing.slice(-50);
}

async function buildContractPdfBuffer(contract, project) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Fence Installation Contract', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Contract Number: ${contract.contractNumber}`);
    doc.text(`Estimate Number: ${contract.estimateNumber}`);
    doc.text(`Project ID: ${contract.projectId}`);
    doc.text(`Customer: ${contract.customerName}`);
    if (project) {
      doc.text(`Property Address: ${project.address}, ${project.city}, ${project.province}`);
    }
    doc.moveDown();
    doc.text(`Scope of Work: ${contract.scopeOfWork}`);
    doc.moveDown(0.5);
    doc.text(`Materials: ${contract.materials}`);
    doc.moveDown(0.5);
    doc.text(`Labor: ${contract.labor}`);
    doc.moveDown(0.5);
    doc.text(`Timeline: ${contract.timeline || 'To be scheduled'}`);
    doc.moveDown(0.5);
    doc.text(`Warranty: ${contract.warranty || 'Standard workmanship warranty applies.'}`);
    doc.moveDown();
    doc.text(`Total Price: $${roundCurrency(contract.totalPrice).toFixed(2)}`);
    doc.text(`Deposit Amount: $${roundCurrency(contract.depositAmount).toFixed(2)}`);
    doc.text(`Final Balance: $${roundCurrency(contract.finalBalance).toFixed(2)}`);
    doc.text(`Status: ${contract.status}`);
    doc.moveDown();
    if (contract.terms) {
      doc.text('Terms:', { underline: true });
      doc.text(contract.terms);
    }

    doc.end();
  });
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.use(requestLogger);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 350 }));
router.use(verifyToken);

router.get('/', asyncRoute(async (req, res) => {
  const Contract = getModel('Contract');
  ensureContractSchemaExtensions(Contract);

  const page = parseInteger(req.query.page, 1);
  const limit = Math.min(parseInteger(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const query = { isDeleted: { $ne: true } };

  if (req.query.status && CONTRACT_STATUSES.includes(String(req.query.status))) {
    query.status = String(req.query.status);
  }
  if (req.query.projectId) {
    query.projectId = String(req.query.projectId).trim();
  }
  if (req.query.estimateNumber) {
    query.estimateNumber = String(req.query.estimateNumber).trim();
  }
  if (req.query.q) {
    const search = new RegExp(String(req.query.q).trim(), 'i');
    query.$or = [
      { contractNumber: search },
      { estimateNumber: search },
      { projectId: search },
      { customerName: search },
    ];
  }

  let allowedProjectIds = null;
  if (req.user.role !== 'admin') {
    const Project = getModel('Project');
    ensureProjectSchemaExtensions(Project);
    const ownedProjects = await Project.find({ estimator: req.user._id || req.user.id, isDeleted: { $ne: true } }).select('projectId').lean();
    allowedProjectIds = ownedProjects.map((project) => project.projectId);
    if (typeof query.projectId === 'string') {
      query.projectId = allowedProjectIds.includes(query.projectId)
        ? query.projectId
        : '__no_access__';
    } else {
      query.projectId = { $in: allowedProjectIds };
    }
  }

  const [total, contracts] = await Promise.all([
    Contract.countDocuments(query),
    Contract.find(query)
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
    contracts,
    accessibleProjects: allowedProjectIds,
  });
}));

router.post('/', asyncRoute(async (req, res) => {
  const Contract = getModel('Contract');
  ensureContractSchemaExtensions(Contract);

  const payload = sanitizeContractPayload(req.body || {});
  const errors = validateContractPayload(payload, false);
  if (errors.length) {
    throw createHttpError(400, 'Contract validation failed.', errors, 'CONTRACT_VALIDATION_FAILED');
  }

  const project = await loadProject(payload.projectId);
  ensureProjectAccess(req, project);

  const estimate = await loadEstimate(payload.estimateNumber);
  if (!estimate) {
    throw createHttpError(404, 'Referenced estimate not found.', null, 'CONTRACT_ESTIMATE_NOT_FOUND');
  }

  const totalPrice = roundCurrency(payload.totalPrice !== undefined ? payload.totalPrice : estimate.total);
  const depositAmount = roundCurrency(payload.depositAmount !== undefined ? payload.depositAmount : totalPrice * 0.25);
  const finalBalance = roundCurrency(payload.finalBalance !== undefined ? payload.finalBalance : totalPrice - depositAmount);

  const contract = await Contract.create({
    contractNumber: generateContractNumber(),
    estimateNumber: payload.estimateNumber,
    projectId: payload.projectId,
    customerName: payload.customerName || project.customerName,
    scopeOfWork: payload.scopeOfWork || 'Installation of fence as specified in the associated estimate.',
    materials: payload.materials || `Fence Type: ${estimate.fenceType}, Linear Feet: ${estimate.linearFeet}`,
    labor: payload.labor || `Estimated labor hours: ${estimate.laborHours}`,
    timeline: payload.timeline || 'To be scheduled after permit approval and material confirmation.',
    totalPrice,
    priceLocked: payload.priceLocked !== undefined ? Boolean(payload.priceLocked) : true,
    depositAmount,
    depositPaid: Boolean(payload.depositPaid),
    finalBalance,
    warranty: payload.warranty || '2 years on materials and 1 year on labor unless otherwise specified.',
    terms: payload.terms || 'Deposit due upon signing. Remaining balance due upon completion.',
    status: payload.status || 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.status(201).json({
    success: true,
    message: 'Contract created successfully.',
    contract,
  });
}));

router.get('/:id/status', asyncRoute(async (req, res) => {
  const contract = await loadContract(req.params.id);
  const project = await loadProject(contract.projectId);
  ensureProjectAccess(req, project);

  return res.status(200).json({
    success: true,
    contractNumber: contract.contractNumber,
    status: {
      current: contract.status,
      signed: Boolean(contract.customerSignature || contract.signedAt),
      signedAt: contract.signedAt || contract.customerSignDate || null,
      depositPaid: Boolean(contract.depositPaid),
      outstandingBalance: roundCurrency((contract.finalBalance || 0) - 0),
      priceLocked: Boolean(contract.priceLocked),
    },
  });
}));

router.post('/:id/sign', asyncRoute(async (req, res) => {
  const contract = await loadContract(req.params.id);
  const project = await loadProject(contract.projectId);
  ensureProjectAccess(req, project);

  appendVersionHistory(contract, 'sign', req.user._id || req.user.id, 'Contract marked as signed.');

  contract.customerSignature = normalizeString(req.body && req.body.customerSignature) || contract.customerSignature || 'Signed electronically';
  contract.customerSignDate = req.body && req.body.customerSignDate ? new Date(req.body.customerSignDate) : contract.customerSignDate || new Date();
  contract.companySignature = normalizeString(req.body && req.body.companySignature) || contract.companySignature || req.user.username || 'Fence Estimator';
  contract.companySignDate = req.body && req.body.companySignDate ? new Date(req.body.companySignDate) : contract.companySignDate || new Date();
  contract.depositPaid = req.body && req.body.depositPaid !== undefined ? Boolean(req.body.depositPaid) : contract.depositPaid;
  contract.status = req.body && req.body.activate ? 'active' : 'signed';
  contract.signedAt = new Date();
  contract.signedBy = req.user._id || req.user.id;
  contract.updatedAt = new Date();
  await contract.save();

  return res.status(200).json({
    success: true,
    message: 'Contract marked as signed.',
    contract,
  });
}));

router.post('/:id/pdf', asyncRoute(async (req, res) => {
  const contract = await loadContract(req.params.id);
  const project = await loadProject(contract.projectId);
  ensureProjectAccess(req, project);

  const pdfBuffer = await buildContractPdfBuffer(contract, project);
  contract.lastPdfAt = new Date();
  contract.pdfHistory = [...(contract.pdfHistory || []), {
    generatedAt: contract.lastPdfAt,
    generatedBy: String(req.user._id || req.user.id),
  }].slice(-20);
  contract.updatedAt = new Date();
  await contract.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${contract.contractNumber}.pdf"`);
  return res.status(200).send(pdfBuffer);
}));

router
  .route('/:id')
  .get(asyncRoute(async (req, res) => {
    const contract = await loadContract(req.params.id);
    const project = await loadProject(contract.projectId);
    ensureProjectAccess(req, project);

    return res.status(200).json({
      success: true,
      contract,
      project,
    });
  }))
  .put(asyncRoute(async (req, res) => {
    const contract = await loadContract(req.params.id);
    const project = await loadProject(contract.projectId);
    ensureProjectAccess(req, project);

    const payload = sanitizeContractPayload(req.body || {});
    if (Object.keys(payload).length === 0) {
      throw createHttpError(400, 'Provide at least one contract field to update.', null, 'CONTRACT_UPDATE_EMPTY');
    }

    const errors = validateContractPayload(payload, true);
    if (errors.length) {
      throw createHttpError(400, 'Contract update validation failed.', errors, 'CONTRACT_UPDATE_VALIDATION_FAILED');
    }

    appendVersionHistory(contract, 'update', req.user._id || req.user.id, 'Contract updated.');
    Object.assign(contract, payload);
    if (payload.totalPrice !== undefined) {
      contract.totalPrice = roundCurrency(payload.totalPrice);
    }
    if (payload.depositAmount !== undefined) {
      contract.depositAmount = roundCurrency(payload.depositAmount);
    }
    contract.finalBalance = roundCurrency(
      payload.finalBalance !== undefined
        ? payload.finalBalance
        : (contract.totalPrice || 0) - (contract.depositAmount || 0)
    );
    contract.updatedAt = new Date();
    await contract.save();

    return res.status(200).json({
      success: true,
      message: 'Contract updated successfully.',
      contract,
    });
  }))
  .delete(asyncRoute(async (req, res) => {
    const contract = await loadContract(req.params.id, { includeDeleted: true });
    const project = await loadProject(contract.projectId);
    ensureProjectAccess(req, project);

    if (contract.isDeleted) {
      throw createHttpError(410, 'Contract has already been deleted.', null, 'CONTRACT_ALREADY_DELETED');
    }

    contract.isDeleted = true;
    contract.deletedAt = new Date();
    contract.deletedBy = req.user._id || req.user.id;
    contract.updatedAt = new Date();
    await contract.save();

    return res.status(200).json({
      success: true,
      message: 'Contract deleted successfully.',
      contract: {
        id: contract._id,
        contractNumber: contract.contractNumber,
        deletedAt: contract.deletedAt,
      },
    });
  }));

module.exports = router;
