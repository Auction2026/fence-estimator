const { createRoute } = require('../utils/helpers');
const projectController = require('../controllers/projectController');

module.exports = [
  createRoute('GET', '/api/tabs', projectController.listTabs, { auth: true }),
  createRoute('GET', '/api/projects', projectController.listProjects, { auth: true }),
  createRoute('POST', '/api/projects', projectController.createProject, { auth: true }),
  createRoute('GET', '/api/projects/:id', projectController.getProject, { auth: true }),
  createRoute('PUT', '/api/projects/:id', projectController.updateProject, { auth: true }),
  createRoute('GET', '/api/projects/:projectId/tabs/:tabKey', projectController.getProjectTab, { auth: true }),
  createRoute('PUT', '/api/projects/:projectId/tabs/:tabKey', projectController.updateProjectTab, { auth: true })
];
