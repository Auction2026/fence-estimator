const Project = require('../models/Project');

async function listProjects(req, res) {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 }).limit(100);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load projects' });
  }
}

async function getProject(req, res) {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load project' });
  }
}

async function createProject(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.projectId || !payload.customerName || !payload.customerEmail) {
      return res.status(400).json({ message: 'projectId, customerName, customerEmail required' });
    }
    const project = await Project.create(payload);
    return res.status(201).json(project);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Project ID already exists' });
    }
    return res.status(500).json({ message: 'Failed to create project' });
  }
}

module.exports = { listProjects, getProject, createProject };
