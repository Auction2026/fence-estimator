
const API = (() => {
  const BASE_URL = '/api';
  const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
  class HttpError extends Error {
    constructor(status, message) {
      super(message);
      this.name = 'HttpError';
      this.status = status;
    }
  }

  async function request(endpoint, options = {}, retries = 1) {
    const method = String(options.method || 'GET').toUpperCase();
    const canRetry = method === 'GET' || method === 'HEAD';
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) }
      });
      if (!response.ok) {
        const detail = await safeJson(response);
        throw new HttpError(response.status, detail?.message || `Request failed: ${response.status}`);
      }
      return safeJson(response);
    } catch (error) {
      const isNetworkError = error instanceof TypeError;
      if (isNetworkError && canRetry && retries > 0) return request(endpoint, options, retries - 1);
      console.error('API error:', error);
      throw error;
    }
  }

  async function safeJson(response) {
    const text = await response.text();
    try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }
  }

  return {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
    getProjects: () => request('/projects'),
    getProject: (id) => request(`/projects/${id}`),
    updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    createFenceSpec: (payload) => request('/fence-specs', { method: 'POST', body: JSON.stringify(payload) }),
    getFenceSpecs: (projectId) => request(`/fence-specs?projectId=${encodeURIComponent(projectId)}`),
    updateFenceSpec: (id, payload) => request(`/fence-specs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteFenceSpec: (id) => request(`/fence-specs/${id}`, { method: 'DELETE' }),
    createEstimate: (payload) => request('/estimates', { method: 'POST', body: JSON.stringify(payload) }),
    calculateEstimate: (payload) => request('/estimates/calculate', { method: 'POST', body: JSON.stringify(payload) }),
    getEstimate: (id) => request(`/estimates/${id}`),
    createContract: (payload) => request('/contracts', { method: 'POST', body: JSON.stringify(payload) }),
    signContract: (id, payload) => request(`/contracts/${id}/sign`, { method: 'POST', body: JSON.stringify(payload) }),
    createChangeOrder: (payload) => request('/change-orders', { method: 'POST', body: JSON.stringify(payload) }),
    approveChangeOrder: (id, payload) => request(`/change-orders/${id}/approve`, { method: 'POST', body: JSON.stringify(payload) }),
    createSignOff: (payload) => request('/signoffs', { method: 'POST', body: JSON.stringify(payload) }),
    completeSignOff: (id, payload) => request(`/signoffs/${id}/complete`, { method: 'POST', body: JSON.stringify(payload) }),
    getNotes: (projectId) => request(`/notes?projectId=${encodeURIComponent(projectId)}`),
    createNote: (payload) => request('/notes', { method: 'POST', body: JSON.stringify(payload) }),
    updateNote: (id, payload) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
    searchProducts: (query) => request(`/products/search?q=${encodeURIComponent(query)}`),
    filterProducts: (category) => request(`/products?category=${encodeURIComponent(category)}`),
    getAllProducts: () => request('/products')
  };
})();
