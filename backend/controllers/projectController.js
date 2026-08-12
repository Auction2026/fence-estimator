const Project = require('../models/Project');

async function listProjects(req, res) {
  const projects = await Project.find().sort({ updatedAt: -1 }).limit(100);
  res.json(projects);
}

async function getProject(req, res) {
  const project = await Project.findOne({ projectId: req.params.projectId });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
}

async function createProject(req, res) {
  const payload = req.body || {};
  if (!payload.projectId || !payload.customerName || !payload.customerEmail) {
    return res.status(400).json({ message: 'projectId, customerName, customerEmail required' });
  }
  const project = await Project.create(payload);
  return res.status(201).json(project);
}

module.exports = { listProjects, getProject, createProject };
