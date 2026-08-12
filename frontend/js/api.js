/**
 * FENCE DEPOT ESTIMATOR - API Client
 * api.js — wraps fetch() calls to the Express backend
 */

'use strict';

const API = (() => {
  const base    = () => AppConfig.api.baseUrl;
  const timeout = () => AppConfig.api.timeout;

  // --------------------------------------------------------
  // Core fetch wrapper with timeout + auth header injection
  // --------------------------------------------------------
  async function request(method, path, body = null) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout());

    const headers = { 'Content-Type': 'application/json' };
    const token = Storage.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const opts = { method, headers, signal: controller.signal };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res  = await fetch(base() + path, opts);
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('Request timed out');
      throw err;
    }
  }

  const get    = (path)        => request('GET',    path);
  const post   = (path, body)  => request('POST',   path, body);
  const put    = (path, body)  => request('PUT',    path, body);
  const del    = (path)        => request('DELETE', path);

  // --------------------------------------------------------
  // AUTH ENDPOINTS
  // --------------------------------------------------------
  const Auth = {
    register: (data) => post('/auth/register', data),
    login:    (data) => post('/auth/login',    data),
    me:       ()     => get('/auth/me'),
  };

  // --------------------------------------------------------
  // PROJECT ENDPOINTS
  // --------------------------------------------------------
  const Projects = {
    list:    (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return get('/projects' + (q ? '?' + q : ''));
    },
    get:     (id)   => get(`/projects/${id}`),
    create:  (data) => post('/projects', data),
    update:  (id, data) => put(`/projects/${id}`, data),
    delete:  (id)   => del(`/projects/${id}`),
  };

  // --------------------------------------------------------
  // ESTIMATE ENDPOINTS
  // --------------------------------------------------------
  const Estimates = {
    list:    (projectId) => get(`/estimates/${projectId}`),
    create:  (data)      => post('/estimates', data),
    pdf:     (estimateId) => get(`/estimates/${estimateId}/pdf`),
    email:   (estimateId, email) => post(`/estimates/${estimateId}/email`, { email }),
  };

  // --------------------------------------------------------
  // CONTRACT ENDPOINTS
  // --------------------------------------------------------
  const Contracts = {
    get:    (projectId) => get(`/contracts/${projectId}`),
    create: (data)      => post('/contracts', data),
    sign:   (contractId, sig) => post(`/contracts/${contractId}/sign`, { signature: sig }),
  };

  // --------------------------------------------------------
  // INVENTORY ENDPOINTS
  // --------------------------------------------------------
  const Inventory = {
    list:   (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return get('/inventory' + (q ? '?' + q : ''));
    },
    get:    (plu) => get(`/inventory/${plu}`),
    update: (plu, data) => put(`/inventory/${plu}`, data),
  };

  // --------------------------------------------------------
  // HEALTH CHECK
  // --------------------------------------------------------
  const health = () => get('/health');

  // Public API
  return { Auth, Projects, Estimates, Contracts, Inventory, health, get, post, put, del };
})();

window.API = API;
