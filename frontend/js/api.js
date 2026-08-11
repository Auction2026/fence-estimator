/**
 * api.js – API communication layer for Fence Estimator Pro
 * Talks to the Express backend at /api/*
 */

const API = (() => {
  const BASE = '/api';

  // ── Request helper ─────────────────────────────────────────────
  async function request(method, path, body = null, retries = 2) {
    const token = Storage.loadToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(BASE + path, options);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || data.error || `HTTP ${res.status}`);
        }
        return data;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  const get  = (path) => request('GET', path);
  const post = (path, body) => request('POST', path, body);
  const put  = (path, body) => request('PUT', path, body);
  const del  = (path) => request('DELETE', path);

  // ── Authentication ─────────────────────────────────────────────
  async function login(username, password) {
    const data = await post('/auth/login', { username, password });
    if (data.token) Storage.saveToken(data.token);
    if (data.user) Storage.saveUser(data.user);
    return data;
  }

  async function register(userData) {
    return post('/auth/register', userData);
  }

  async function logout() {
    try { await post('/auth/logout'); } catch (_) {}
    Storage.clearUser();
  }

  async function getProfile() {
    return get('/auth/profile');
  }

  // ── Projects ───────────────────────────────────────────────────
  const Projects = {
    create: (data) => post('/projects', data),
    getAll: () => get('/projects'),
    getOne: (id) => get(`/projects/${id}`),
    update: (id, data) => put(`/projects/${id}`, data),
    delete: (id) => del(`/projects/${id}`)
  };

  // ── Fence Specs ────────────────────────────────────────────────
  const Specs = {
    create: (data) => post('/fence-specs', data),
    get: (projectId) => get(`/fence-specs/${projectId}`),
    update: (projectId, data) => put(`/fence-specs/${projectId}`, data)
  };

  // ── Estimates ──────────────────────────────────────────────────
  const Estimates = {
    create: (data) => post('/estimates', data),
    getAll: () => get('/estimates'),
    get: (id) => get(`/estimates/${id}`),
    update: (id, data) => put(`/estimates/${id}`, data),
    calculate: (specs) => post('/estimates/calculate', specs)
  };

  // ── Contracts ──────────────────────────────────────────────────
  const Contracts = {
    create: (data) => post('/contracts', data),
    get: (id) => get(`/contracts/${id}`),
    getByProject: (projectId) => get(`/contracts/project/${projectId}`),
    sign: (id, sigData) => put(`/contracts/${id}/sign`, sigData),
    update: (id, data) => put(`/contracts/${id}`, data)
  };

  // ── Change Orders ──────────────────────────────────────────────
  const ChangeOrders = {
    create: (data) => post('/change-orders', data),
    getAll: (projectId) => get(`/change-orders?projectId=${projectId}`),
    get: (id) => get(`/change-orders/${id}`),
    approve: (id, sigData) => put(`/change-orders/${id}/approve`, sigData),
    reject: (id) => put(`/change-orders/${id}/reject`)
  };

  // ── Sign-Offs ──────────────────────────────────────────────────
  const SignOffs = {
    create: (data) => post('/sign-offs', data),
    get: (projectId) => get(`/sign-offs/${projectId}`),
    complete: (id, data) => put(`/sign-offs/${id}/complete`, data)
  };

  // ── Notes ──────────────────────────────────────────────────────
  const Notes = {
    create: (data) => post('/notes', data),
    getAll: () => get('/notes'),
    update: (id, data) => put(`/notes/${id}`, data),
    delete: (id) => del(`/notes/${id}`)
  };

  // ── Products / Inventory ───────────────────────────────────────
  const Products = {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return get(`/inventory${qs ? '?' + qs : ''}`);
    },
    search: (query, category) => {
      const qs = new URLSearchParams({ search: query, ...(category && category !== 'all' ? { category } : {}) }).toString();
      return get(`/inventory?${qs}`);
    },
    get: (sku) => get(`/inventory/${sku}`)
  };

  // ── Admin ──────────────────────────────────────────────────────
  const Admin = {
    getUsers: () => get('/admin/users'),
    createUser: (data) => post('/admin/users', data),
    updateUser: (id, data) => put(`/admin/users/${id}`, data),
    deleteUser: (id) => del(`/admin/users/${id}`),
    getStats: () => get('/admin/stats'),
    reportMonthly: () => get('/admin/reports/monthly'),
    reportProjects: () => get('/admin/reports/projects')
  };

  return {
    login, register, logout, getProfile,
    Projects, Specs, Estimates, Contracts,
    ChangeOrders, SignOffs, Notes, Products, Admin
  };
})();
