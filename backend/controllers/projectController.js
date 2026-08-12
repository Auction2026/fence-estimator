const buildProjectId = () => `PRJ-${Date.now()}`;

function normalizeProjectInput(body = {}) {
  return {
    customerName: String(body.customerName || '').trim(),
    customerEmail: String(body.customerEmail || '').trim().toLowerCase(),
    customerPhone: String(body.customerPhone || '').trim(),
    address: String(body.address || '').trim(),
    city: String(body.city || '').trim(),
    province: String(body.province || '').trim(),
    postalCode: String(body.postalCode || '').trim(),
    propertySize: Number(body.propertySize || 0),
    projectNotes: String(body.projectNotes || '').trim(),
    status: String(body.status || 'draft').trim() || 'draft',
  };
}

function validateProjectPayload(project) {
  const errors = [];
  if (!project.customerName) errors.push('customerName is required');
  if (!project.customerEmail) errors.push('customerEmail is required');
  if (!project.customerPhone) errors.push('customerPhone is required');
  if (!project.address) errors.push('address is required');
  if (!project.city) errors.push('city is required');
  if (!project.province) errors.push('province is required');
  if (!project.postalCode) errors.push('postalCode is required');
  return errors;
}

async function createProject(req, res) {
  const Project = req.app.locals.models?.Project;
  if (!Project) {
    return res.status(503).json({ error: 'Unavailable', message: 'Project model is not configured' });
  }
  const payload = normalizeProjectInput(req.body);
  const errors = validateProjectPayload(payload);
  if (errors.length) {
    return res.status(400).json({ error: 'Validation Error', message: errors.join(', ') });
  }
  const project = new Project(Object.assign({ projectId: buildProjectId(), estimator: req.userId }, payload));
  await project.save();
  return res.status(201).json({ success: true, project });
}

async function listProjects(req, res) {
  const Project = req.app.locals.models?.Project;
  if (!Project) {
    return res.status(503).json({ error: 'Unavailable', message: 'Project model is not configured' });
  }
  const projects = await Project.find(req.userRole === 'admin' ? {} : { estimator: req.userId }).sort({ createdAt: -1 });
  return res.json({ success: true, count: projects.length, projects });
}

async function getProject(req, res) {
  const Project = req.app.locals.models?.Project;
  if (!Project) {
    return res.status(503).json({ error: 'Unavailable', message: 'Project model is not configured' });
  }
  const project = await Project.findOne({ projectId: req.params.projectId });
  if (!project) return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
  return res.json({ success: true, project });
}

async function updateProject(req, res) {
  const Project = req.app.locals.models?.Project;
  if (!Project) {
    return res.status(503).json({ error: 'Unavailable', message: 'Project model is not configured' });
  }
  const payload = normalizeProjectInput(req.body);
  const project = await Project.findOneAndUpdate({ projectId: req.params.projectId }, payload, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
  return res.json({ success: true, project });
}

module.exports = { buildProjectId, normalizeProjectInput, validateProjectPayload, createProject, listProjects, getProject, updateProject };
