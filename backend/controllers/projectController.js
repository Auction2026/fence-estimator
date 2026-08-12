'use strict';

/**
 * @module controllers/projectController
 * Controller functions for managing fence estimator projects and their related data.
 */

const mongoose = require('mongoose');

const PROJECT_REQUIRED_FIELDS = [
  'customerName',
  'customerEmail',
  'customerPhone',
  'address',
  'city',
  'province',
  'postalCode',
];

const PROJECT_ALLOWED_FIELDS = [
  'customerName',
  'customerEmail',
  'customerPhone',
  'address',
  'city',
  'province',
  'postalCode',
  'propertySize',
  'projectNotes',
  'photos',
  'status',
  'estimator',
];

const STATUS_VALUES = ['draft', 'estimate', 'contract', 'active', 'completed'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function log(level, message, meta) {
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  const printer = level === 'error' ? console.error : console.log;
  printer(`[projectController:${level}] ${new Date().toISOString()} ${message}${payload}`);
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

function getModel(name) {
  const model = mongoose.models[name];
  if (!model) {
    throw createHttpError(500, `Mongoose model \"${name}\" is not registered.`, null, 'MODEL_NOT_REGISTERED');
  }
  return model;
}

function ensureProjectSchemaExtensions(Project) {
  if (!Project.schema.path('isDeleted')) {
    Project.schema.add({
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
      deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      duplicatedFrom: { type: String, default: null },
      lastExportedAt: { type: Date, default: null },
      exportCount: { type: Number, default: 0 },
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

function buildSort(sortBy, sortOrder) {
  const allowed = new Set(['createdAt', 'updatedAt', 'customerName', 'city', 'status', 'projectId']);
  const direction = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;
  const field = allowed.has(sortBy) ? sortBy : 'createdAt';
  return { [field]: direction };
}

function sanitizeProjectPayload(body, options) {
  const partial = Boolean(options && options.partial);
  const payload = {};

  for (const field of PROJECT_ALLOWED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      continue;
    }

    const value = body[field];

    if (field === 'photos') {
      payload.photos = Array.isArray(value)
        ? value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
        : [];
      continue;
    }

    payload[field] = typeof value === 'string' ? value.trim() : value;
  }

  if (!partial && !payload.status) {
    payload.status = 'draft';
  }

  return payload;
}

function validateProjectPayload(payload, options) {
  const partial = Boolean(options && options.partial);
  const errors = [];

  for (const field of PROJECT_REQUIRED_FIELDS) {
    if (!partial && !payload[field]) {
      errors.push(`${field} is required.`);
    }
  }

  if (payload.customerEmail && !EMAIL_REGEX.test(payload.customerEmail)) {
    errors.push('customerEmail must be a valid email address.');
  }

  if (payload.status && !STATUS_VALUES.includes(payload.status)) {
    errors.push(`status must be one of: ${STATUS_VALUES.join(', ')}.`);
  }

  if (payload.photos && !Array.isArray(payload.photos)) {
    errors.push('photos must be an array of strings.');
  }

  if (payload.estimator && !mongoose.Types.ObjectId.isValid(String(payload.estimator))) {
    errors.push('estimator must be a valid user identifier.');
  }

  return errors;
}

function buildProjectLookup(id, includeDeleted) {
  const query = mongoose.Types.ObjectId.isValid(String(id))
    ? { $or: [{ _id: id }, { projectId: String(id) }] }
    : { projectId: String(id) };

  if (!includeDeleted) {
    query.isDeleted = { $ne: true };
  }

  return query;
}

async function loadProjectByIdentifier(id, options) {
  const settings = {
    includeDeleted: false,
    lean: false,
    ...options,
  };

  const Project = getModel('Project');
  ensureProjectSchemaExtensions(Project);

  let query = Project.findOne(buildProjectLookup(id, settings.includeDeleted));
  if (settings.populateEstimator) {
    query = query.populate('estimator', 'username email company role');
  }
  if (settings.lean) {
    query = query.lean();
  }
  return query.exec();
}

function userOwnsProject(user, project) {
  if (!user || !project) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  const estimatorId = project.estimator && project.estimator._id ? project.estimator._id : project.estimator;
  return String(estimatorId) === String(user._id || user.id);
}

function ensureProjectAccess(req, project) {
  if (!project) {
    throw createHttpError(404, 'Project not found.', null, 'PROJECT_NOT_FOUND');
  }

  if (!userOwnsProject(req.user, project)) {
    throw createHttpError(403, 'You do not have access to this project.', null, 'PROJECT_FORBIDDEN');
  }
}

function generateProjectId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `PRJ-${stamp}-${random}`;
}

function buildPagination(total, page, limit) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

async function fetchProjectRelations(projectId) {
  const FenceSpecs = mongoose.models.FenceSpecs;
  const Estimate = mongoose.models.Estimate;
  const Contract = mongoose.models.Contract;
  const ChangeOrder = mongoose.models.ChangeOrder;
  const SignOff = mongoose.models.SignOff;

  const [fenceSpecs, estimates, contracts, changeOrders, signOffs] = await Promise.all([
    FenceSpecs ? FenceSpecs.find({ projectId }).sort({ createdAt: -1 }).lean() : Promise.resolve([]),
    Estimate ? Estimate.find({ projectId }).sort({ createdAt: -1 }).populate('estimator', 'username email company role').lean() : Promise.resolve([]),
    Contract ? Contract.find({ projectId }).sort({ createdAt: -1 }).lean() : Promise.resolve([]),
    ChangeOrder ? ChangeOrder.find({ projectId }).sort({ createdAt: -1 }).lean() : Promise.resolve([]),
    SignOff ? SignOff.find({ projectId }).sort({ createdAt: -1 }).lean() : Promise.resolve([]),
  ]);

  return {
    fenceSpecs,
    estimates,
    contracts,
    changeOrders,
    signOffs,
  };
}

function summarizeProject(project, relations) {
  const estimates = relations.estimates || [];
  const contracts = relations.contracts || [];
  const changeOrders = relations.changeOrders || [];
  const signOffs = relations.signOffs || [];
  const acceptedEstimate = estimates.find((estimate) => estimate.status === 'accepted') || estimates[0] || null;
  const activeContract = contracts.find((contract) => ['signed', 'active'].includes(contract.status)) || contracts[0] || null;

  const estimateTotals = estimates.reduce(
    (accumulator, estimate) => {
      accumulator.count += 1;
      accumulator.subtotal += Number(estimate.subtotal || 0);
      accumulator.tax += Number(estimate.tax || 0);
      accumulator.total += Number(estimate.total || 0);
      return accumulator;
    },
    { count: 0, subtotal: 0, tax: 0, total: 0 }
  );

  const contractTotals = contracts.reduce(
    (accumulator, contract) => {
      accumulator.count += 1;
      accumulator.totalPrice += Number(contract.totalPrice || 0);
      accumulator.depositAmount += Number(contract.depositAmount || 0);
      accumulator.finalBalance += Number(contract.finalBalance || 0);
      return accumulator;
    },
    { count: 0, totalPrice: 0, depositAmount: 0, finalBalance: 0 }
  );

  const changeOrderTotals = changeOrders.reduce(
    (accumulator, order) => {
      accumulator.count += 1;
      accumulator.materialCostChange += Number(order.materialCostChange || 0);
      accumulator.laborCostChange += Number(order.laborCostChange || 0);
      accumulator.newTotal += Number(order.newTotal || 0);
      return accumulator;
    },
    { count: 0, materialCostChange: 0, laborCostChange: 0, newTotal: 0 }
  );

  return {
    projectId: project.projectId,
    status: project.status,
    counts: {
      fenceSpecs: (relations.fenceSpecs || []).length,
      estimates: estimateTotals.count,
      contracts: contractTotals.count,
      changeOrders: changeOrderTotals.count,
      signOffs: signOffs.length,
    },
    latest: {
      estimate: acceptedEstimate,
      contract: activeContract,
      signOff: signOffs[0] || null,
    },
    financials: {
      estimates: estimateTotals,
      contracts: contractTotals,
      changeOrders: changeOrderTotals,
      expectedRevenue: Math.max(contractTotals.totalPrice, estimateTotals.total),
    },
  };
}

async function createProject(req, res, next) {
  try {
    const Project = getModel('Project');
    ensureProjectSchemaExtensions(Project);

    const payload = sanitizeProjectPayload(req.body || {}, { partial: false });
    const errors = validateProjectPayload(payload, { partial: false });
    if (errors.length) {
      throw createHttpError(400, 'Project validation failed.', errors, 'PROJECT_VALIDATION_FAILED');
    }

    const estimatorId = req.user.role === 'admin' && payload.estimator ? payload.estimator : req.user._id || req.user.id;
    const project = await Project.create({
      ...payload,
      customerEmail: String(payload.customerEmail).toLowerCase(),
      projectId: generateProjectId(),
      estimator: estimatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const populatedProject = await Project.findById(project._id).populate('estimator', 'username email company role');

    log('info', 'Project created', {
      projectId: populatedProject.projectId,
      createdBy: String(req.user._id || req.user.id),
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: populatedProject,
    });
  } catch (error) {
    log('error', 'Failed to create project', { message: error.message });
    return next(error);
  }
}

async function getProjects(req, res, next) {
  try {
    const Project = getModel('Project');
    ensureProjectSchemaExtensions(Project);

    const page = parseInteger(req.query.page, 1);
    const limit = Math.min(parseInteger(req.query.limit, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    const sort = buildSort(req.query.sortBy, req.query.sortOrder);
    const includeDeleted = req.user.role === 'admin' && String(req.query.includeDeleted).toLowerCase() === 'true';

    const query = includeDeleted ? {} : { isDeleted: { $ne: true } };

    if (req.user.role !== 'admin') {
      query.estimator = req.user._id || req.user.id;
    } else if (req.query.estimator && mongoose.Types.ObjectId.isValid(String(req.query.estimator))) {
      query.estimator = req.query.estimator;
    }

    if (req.query.status && STATUS_VALUES.includes(String(req.query.status))) {
      query.status = String(req.query.status);
    }

    if (req.query.city) {
      query.city = new RegExp(normalizeString(req.query.city), 'i');
    }

    if (req.query.province) {
      query.province = new RegExp(normalizeString(req.query.province), 'i');
    }

    if (req.query.projectId) {
      query.projectId = String(req.query.projectId).trim();
    }

    if (req.query.q) {
      const search = normalizeString(req.query.q);
      query.$or = [
        { projectId: new RegExp(search, 'i') },
        { customerName: new RegExp(search, 'i') },
        { customerEmail: new RegExp(search, 'i') },
        { customerPhone: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    const [total, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .populate('estimator', 'username email company role')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const Estimate = mongoose.models.Estimate;
    const Contract = mongoose.models.Contract;
    const projectIds = projects.map((project) => project.projectId);

    let estimateStats = [];
    let contractStats = [];

    if (projectIds.length && Estimate) {
      estimateStats = await Estimate.aggregate([
        { $match: { projectId: { $in: projectIds } } },
        {
          $group: {
            _id: '$projectId',
            count: { $sum: 1 },
            total: { $sum: '$total' },
          },
        },
      ]);
    }

    if (projectIds.length && Contract) {
      contractStats = await Contract.aggregate([
        { $match: { projectId: { $in: projectIds } } },
        {
          $group: {
            _id: '$projectId',
            count: { $sum: 1 },
            totalPrice: { $sum: '$totalPrice' },
          },
        },
      ]);
    }

    const estimateMap = new Map(estimateStats.map((entry) => [entry._id, entry]));
    const contractMap = new Map(contractStats.map((entry) => [entry._id, entry]));

    const enrichedProjects = projects.map((project) => ({
      ...project,
      stats: {
        estimates: estimateMap.get(project.projectId)?.count || 0,
        estimateTotal: estimateMap.get(project.projectId)?.total || 0,
        contracts: contractMap.get(project.projectId)?.count || 0,
        contractTotal: contractMap.get(project.projectId)?.totalPrice || 0,
      },
    }));

    return res.status(200).json({
      success: true,
      filters: {
        status: req.query.status || null,
        city: req.query.city || null,
        province: req.query.province || null,
        q: req.query.q || null,
      },
      pagination: buildPagination(total, page, limit),
      projects: enrichedProjects,
    });
  } catch (error) {
    log('error', 'Failed to list projects', { message: error.message });
    return next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const project = await loadProjectByIdentifier(req.params.id, { populateEstimator: true });
    ensureProjectAccess(req, project);

    const relations = await fetchProjectRelations(project.projectId);
    const summary = summarizeProject(project.toObject ? project.toObject() : project, relations);

    return res.status(200).json({
      success: true,
      project,
      related: relations,
      summary,
    });
  } catch (error) {
    log('error', 'Failed to load project', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const Project = getModel('Project');
    ensureProjectSchemaExtensions(Project);

    const project = await loadProjectByIdentifier(req.params.id, { populateEstimator: true });
    ensureProjectAccess(req, project);

    const payload = sanitizeProjectPayload(req.body || {}, { partial: true });
    if (Object.keys(payload).length === 0) {
      throw createHttpError(400, 'At least one project field must be provided for update.', null, 'PROJECT_UPDATE_EMPTY');
    }

    if (req.user.role !== 'admin') {
      delete payload.estimator;
    }

    const errors = validateProjectPayload(payload, { partial: true });
    if (errors.length) {
      throw createHttpError(400, 'Project update validation failed.', errors, 'PROJECT_UPDATE_VALIDATION_FAILED');
    }

    Object.assign(project, payload, {
      customerEmail: payload.customerEmail ? String(payload.customerEmail).toLowerCase() : project.customerEmail,
      updatedAt: new Date(),
    });

    await project.save();
    await project.populate('estimator', 'username email company role');

    log('info', 'Project updated', {
      projectId: project.projectId,
      updatedBy: String(req.user._id || req.user.id),
    });

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    log('error', 'Failed to update project', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await loadProjectByIdentifier(req.params.id, { populateEstimator: true, includeDeleted: true });
    ensureProjectAccess(req, project);

    if (project.isDeleted) {
      throw createHttpError(410, 'Project has already been deleted.', null, 'PROJECT_ALREADY_DELETED');
    }

    project.isDeleted = true;
    project.deletedAt = new Date();
    project.deletedBy = req.user._id || req.user.id;
    project.updatedAt = new Date();
    await project.save();

    log('info', 'Project soft deleted', {
      projectId: project.projectId,
      deletedBy: String(req.user._id || req.user.id),
    });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      project: {
        id: project._id,
        projectId: project.projectId,
        isDeleted: project.isDeleted,
        deletedAt: project.deletedAt,
      },
    });
  } catch (error) {
    log('error', 'Failed to delete project', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

async function duplicateProject(req, res, next) {
  try {
    const Project = getModel('Project');
    const FenceSpecs = mongoose.models.FenceSpecs;
    ensureProjectSchemaExtensions(Project);

    const sourceProject = await loadProjectByIdentifier(req.params.id, { populateEstimator: true });
    ensureProjectAccess(req, sourceProject);

    const duplicateEstimator = req.user.role === 'admin' && req.body && req.body.estimator
      ? req.body.estimator
      : req.user._id || req.user.id;

    const duplicateProjectData = {
      customerName: sourceProject.customerName,
      customerEmail: sourceProject.customerEmail,
      customerPhone: sourceProject.customerPhone,
      address: sourceProject.address,
      city: sourceProject.city,
      province: sourceProject.province,
      postalCode: sourceProject.postalCode,
      propertySize: sourceProject.propertySize,
      projectNotes: sourceProject.projectNotes
        ? `${sourceProject.projectNotes}\n\nDuplicated from ${sourceProject.projectId} on ${new Date().toISOString()}.`
        : `Duplicated from ${sourceProject.projectId} on ${new Date().toISOString()}.`,
      photos: Array.isArray(sourceProject.photos) ? [...sourceProject.photos] : [],
      status: 'draft',
      estimator: duplicateEstimator,
      projectId: generateProjectId(),
      duplicatedFrom: sourceProject.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const duplicate = await Project.create(duplicateProjectData);

    let duplicatedFenceSpecs = 0;
    if (FenceSpecs) {
      const fenceSpecs = await FenceSpecs.find({ projectId: sourceProject.projectId }).lean();
      if (fenceSpecs.length) {
        await FenceSpecs.insertMany(
          fenceSpecs.map((spec) => {
            const cloned = { ...spec };
            delete cloned._id;
            delete cloned.__v;
            return {
              ...cloned,
              projectId: duplicate.projectId,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          })
        );
        duplicatedFenceSpecs = fenceSpecs.length;
      }
    }

    await duplicate.populate('estimator', 'username email company role');

    log('info', 'Project duplicated', {
      sourceProjectId: sourceProject.projectId,
      duplicateProjectId: duplicate.projectId,
      duplicatedFenceSpecs,
    });

    return res.status(201).json({
      success: true,
      message: 'Project duplicated successfully.',
      project: duplicate,
      duplicated: {
        sourceProjectId: sourceProject.projectId,
        fenceSpecs: duplicatedFenceSpecs,
      },
    });
  } catch (error) {
    log('error', 'Failed to duplicate project', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

async function exportProject(req, res, next) {
  try {
    const project = await loadProjectByIdentifier(req.params.id, { populateEstimator: true });
    ensureProjectAccess(req, project);

    const relations = await fetchProjectRelations(project.projectId);
    const summary = summarizeProject(project.toObject ? project.toObject() : project, relations);

    project.lastExportedAt = new Date();
    project.exportCount = Number(project.exportCount || 0) + 1;
    project.updatedAt = new Date();
    await project.save();

    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: req.user._id || req.user.id,
        role: req.user.role,
      },
      project,
      related: relations,
      summary,
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${project.projectId}.json"`);
    return res.status(200).send(JSON.stringify(payload, null, 2));
  } catch (error) {
    log('error', 'Failed to export project', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

async function getProjectSummary(req, res, next) {
  try {
    const project = await loadProjectByIdentifier(req.params.id, { populateEstimator: true });
    ensureProjectAccess(req, project);

    const relations = await fetchProjectRelations(project.projectId);
    const summary = summarizeProject(project.toObject ? project.toObject() : project, relations);

    return res.status(200).json({
      success: true,
      project: {
        id: project._id,
        projectId: project.projectId,
        customerName: project.customerName,
        status: project.status,
      },
      summary,
    });
  } catch (error) {
    log('error', 'Failed to build project summary', { projectId: req.params.id, message: error.message });
    return next(error);
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  duplicateProject,
  exportProject,
  getProjectSummary,
};
