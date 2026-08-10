const crypto = require('crypto');
const { createCatalogSeed } = require('../models/Product');

function createIdGenerator(start = 1) {
  let next = start;
  return () => next++;
}

function createDatabase() {
  const nextUserId = createIdGenerator(2);
  const nextProjectId = createIdGenerator(1);
  const nextEstimateId = createIdGenerator(1);
  const nextContractId = createIdGenerator(1);
  const nextSessionId = createIdGenerator(1);
  const nextLogId = createIdGenerator(1);

  const state = {
    users: [
      {
        id: 1,
        name: 'Demo Estimator',
        email: 'demo@fencedepot.local',
        passwordHash: crypto.createHash('sha256').update('DemoPass123!').digest('hex'),
        role: 'admin'
      }
    ],
    projects: [],
    estimates: [],
    contracts: [],
    tabs: [],
    sessions: [],
    auditLogs: [],
    catalog: createCatalogSeed()
  };

  function log(action, detail) {
    state.auditLogs.push({
      id: nextLogId(),
      action,
      detail,
      createdAt: new Date().toISOString()
    });
  }

  return {
    state,
    log,
    createUser(user) {
      const record = { id: nextUserId(), ...user };
      state.users.push(record);
      log('user.created', { userId: record.id, email: record.email });
      return record;
    },
    findUserByEmail(email) {
      return state.users.find(user => user.email === String(email || '').toLowerCase()) || null;
    },
    getUser(id) {
      return state.users.find(user => user.id === Number(id)) || null;
    },
    createSession(session) {
      const record = { id: nextSessionId(), ...session, createdAt: new Date().toISOString() };
      state.sessions.push(record);
      return record;
    },
    createProject(project) {
      const record = { id: nextProjectId(), ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      state.projects.push(record);
      log('project.created', { projectId: record.id });
      return record;
    },
    listProjects() {
      return state.projects.slice();
    },
    getProject(id) {
      return state.projects.find(project => project.id === Number(id)) || null;
    },
    updateProject(id, updates) {
      const project = this.getProject(id);
      if (!project) return null;
      Object.assign(project, updates, { updatedAt: new Date().toISOString() });
      log('project.updated', { projectId: project.id });
      return project;
    },
    upsertTab(projectId, tabKey, payload) {
      const existing = state.tabs.find(tab => tab.projectId === Number(projectId) && tab.tabKey === tabKey);
      if (existing) {
        existing.payload = payload;
        existing.updatedAt = new Date().toISOString();
        log('tab.updated', { projectId: Number(projectId), tabKey });
        return existing;
      }

      const record = {
        projectId: Number(projectId),
        tabKey,
        payload,
        updatedAt: new Date().toISOString()
      };
      state.tabs.push(record);
      log('tab.created', { projectId: Number(projectId), tabKey });
      return record;
    },
    getTab(projectId, tabKey) {
      return state.tabs.find(tab => tab.projectId === Number(projectId) && tab.tabKey === tabKey) || null;
    },
    listTabs(projectId) {
      return state.tabs.filter(tab => tab.projectId === Number(projectId));
    },
    createEstimate(estimate) {
      const record = { id: nextEstimateId(), ...estimate, createdAt: new Date().toISOString() };
      state.estimates.push(record);
      log('estimate.created', { estimateId: record.id, projectId: record.projectId });
      return record;
    },
    listEstimates() {
      return state.estimates.slice();
    },
    getEstimate(id) {
      return state.estimates.find(estimate => estimate.id === Number(id)) || null;
    },
    createContract(contract) {
      const record = { id: nextContractId(), ...contract, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      state.contracts.push(record);
      log('contract.created', { contractId: record.id, projectId: record.projectId });
      return record;
    },
    listContracts() {
      return state.contracts.slice();
    },
    getContract(id) {
      return state.contracts.find(contract => contract.id === Number(id)) || null;
    },
    updateContract(id, updates) {
      const contract = this.getContract(id);
      if (!contract) return null;
      Object.assign(contract, updates, { updatedAt: new Date().toISOString() });
      log('contract.updated', { contractId: contract.id });
      return contract;
    },
    listCatalog() {
      return state.catalog.slice();
    },
    summary() {
      return {
        users: state.users.length,
        projects: state.projects.length,
        estimates: state.estimates.length,
        contracts: state.contracts.length,
        catalogProducts: state.catalog.length,
        recentActivity: state.auditLogs.slice(-10).reverse()
      };
    }
  };
}

module.exports = { createDatabase };
