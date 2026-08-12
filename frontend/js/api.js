const API_BASE_URL = window.FENCE_CONFIG?.apiBaseUrl || '/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `API ${response.status}`);
  return data;
}

const api = {
  getProjects: () => apiRequest('/projects'),
  getProject: (id) => apiRequest(`/projects/${id}`),
  saveProject: (payload) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  saveEstimate: (payload) => apiRequest('/estimates', { method: 'POST', body: JSON.stringify(payload) }),
  createContract: (payload) => apiRequest('/contracts', { method: 'POST', body: JSON.stringify(payload) }),
};

window.fenceApi = api;
