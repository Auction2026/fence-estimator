const Project = require('../models/Project');
const { sendJson } = require('../utils/helpers');
const { sendValidationErrors } = require('../middleware/validation');

const TAB_DEFINITIONS = [
  'project', 'specs', 'layout', 'installation', 'shop-drawings', 'permits', 'utilities',
  'estimate', 'contract', 'extras', 'crew-breakdown', 'change-order', 'sign-off', 'notes',
  'admin', 'catalog', 'mapping'
];

async function listProjects(req, res, context) {
  return sendJson(res, 200, { data: context.db.listProjects() });
}

async function createProject(req, res, context) {
  const { errors, value } = Project.validate(context.body);
  if (errors.length) return sendValidationErrors(res, errors);
  return sendJson(res, 201, { data: context.db.createProject(value) });
}

async function getProject(req, res, context) {
  const project = context.db.getProject(context.params.id);
  if (!project) return sendJson(res, 404, { error: 'Project not found.' });
  return sendJson(res, 200, { data: project, tabs: context.db.listTabs(project.id) });
}

async function updateProject(req, res, context) {
  const existing = context.db.getProject(context.params.id);
  if (!existing) return sendJson(res, 404, { error: 'Project not found.' });
  const merged = { ...existing, ...context.body };
  const { errors, value } = Project.validate(merged);
  if (errors.length) return sendValidationErrors(res, errors);
  return sendJson(res, 200, { data: context.db.updateProject(existing.id, value) });
}

async function listTabs(req, res) {
  return sendJson(res, 200, { data: TAB_DEFINITIONS });
}

async function getProjectTab(req, res, context) {
  const project = context.db.getProject(context.params.projectId);
  if (!project) return sendJson(res, 404, { error: 'Project not found.' });
  const tab = context.db.getTab(project.id, context.params.tabKey);
  return sendJson(res, 200, { data: tab || { projectId: project.id, tabKey: context.params.tabKey, payload: {} } });
}

async function updateProjectTab(req, res, context) {
  const project = context.db.getProject(context.params.projectId);
  if (!project) return sendJson(res, 404, { error: 'Project not found.' });
  return sendJson(res, 200, { data: context.db.upsertTab(project.id, context.params.tabKey, context.body) });
}

module.exports = {
  TAB_DEFINITIONS,
  listProjects,
  createProject,
  getProject,
  updateProject,
  listTabs,
  getProjectTab,
  updateProjectTab
};
