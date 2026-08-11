
const API_BASE = 'http://localhost:3000/api';

async function fetchJSON(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(url, config);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error((payload && payload.message) || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

function authHeaders() {
  const user = window.FenceStorage?.getUser?.() || null;
  return user?.token ? { Authorization: 'Token ' + user.token } : {};
}

async function login(username, password) {
  return await fetchJSON(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function logout() {
  return await fetchJSON(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeaders()
  });
}

async function getCurrentUser() {
  return await fetchJSON(`${API_BASE}/auth/me`, { headers: authHeaders() });
}

async function createProject(projectData) {
  return await fetchJSON(`${API_BASE}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(projectData)
  });
}

async function listProjects(filters = {}) {
  return await fetchJSON(`${API_BASE}/projects${buildQuery(filters)}`, {
    headers: authHeaders()
  });
}

async function getProject(projectId) {
  return await fetchJSON(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, {
    headers: authHeaders()
  });
}

async function updateProject(projectId, data) {
  return await fetchJSON(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
}

async function deleteProject(projectId) {
  return await fetchJSON(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
}

async function createEstimate(projectId, estimateData) {
  return await fetchJSON(`${API_BASE}/projects/${encodeURIComponent(projectId)}/estimates`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(estimateData)
  });
}

async function getEstimate(estimateId) {
  return await fetchJSON(`${API_BASE}/estimates/${encodeURIComponent(estimateId)}`, {
    headers: authHeaders()
  });
}

async function calculateEstimateRequest(specs) {
  return await fetchJSON(`${API_BASE}/estimates/calculate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(specs)
  });
}

async function createContract(estimateId) {
  return await fetchJSON(`${API_BASE}/contracts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ estimateId })
  });
}

async function signContract(contractId, signature) {
  return await fetchJSON(`${API_BASE}/contracts/${encodeURIComponent(contractId)}/sign`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ signature })
  });
}

async function getContract(contractId) {
  return await fetchJSON(`${API_BASE}/contracts/${encodeURIComponent(contractId)}`, {
    headers: authHeaders()
  });
}

async function createChangeOrder(contractId, changeData) {
  return await fetchJSON(`${API_BASE}/contracts/${encodeURIComponent(contractId)}/change-orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(changeData)
  });
}

async function listChangeOrders(contractId) {
  return await fetchJSON(`${API_BASE}/contracts/${encodeURIComponent(contractId)}/change-orders`, {
    headers: authHeaders()
  });
}

async function searchProducts(query) {
  return await fetchJSON(`${API_BASE}/products/search${buildQuery({ q: query })}`, {
    headers: authHeaders()
  });
}

async function getProductsByCategory(category) {
  return await fetchJSON(`${API_BASE}/products/category/${encodeURIComponent(category)}`, {
    headers: authHeaders()
  });
}

async function uploadShopDrawings(projectId, files) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => formData.append('files', file));
  const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/drawings`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  });
  if (!response.ok) {
    throw new Error('Unable to upload shop drawings.');
  }
  return response.json();
}

async function saveNote(projectId, note) {
  return await fetchJSON(`${API_BASE}/projects/${encodeURIComponent(projectId)}/notes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(note)
  });
}

async function getDashboardSummary() {
  return await fetchJSON(`${API_BASE}/dashboard/summary`, {
    headers: authHeaders()
  });
}

window.FenceAPI = {
  API_BASE,
  fetchJSON,
  login,
  logout,
  getCurrentUser,
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  createEstimate,
  getEstimate,
  calculateEstimateRequest,
  createContract,
  signContract,
  getContract,
  createChangeOrder,
  listChangeOrders,
  searchProducts,
  getProductsByCategory,
  uploadShopDrawings,
  saveNote,
  getDashboardSummary
};
