const LOCAL_KEY = 'fence-estimator-local-store';

function loadLocalStore() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || JSON.stringify({
    mode: 'local-fallback',
    token: 'local-token',
    user: { id: 1, name: 'Local Demo', email: 'demo@fencedepot.local', role: 'admin' },
    projects: [],
    tabs: {},
    estimates: [],
    contracts: [],
    catalog: []
  }));
}

function saveLocalStore(store) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = sessionStorage.getItem('fence-token');
  if (token) headers.set('Authorization', 'Bearer ' + token);

  try {
    const response = await fetch(path, { ...options, headers });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `Request failed with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    error.isOffline = true;
    throw error;
  }
}

export async function loginDemo() {
  try {
    const payload = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'demo@fencedepot.local', password: 'DemoPass123!' })
    });
    sessionStorage.setItem('fence-token', payload.token);
    return { mode: 'api', user: payload.user };
  } catch {
    const store = loadLocalStore();
    return { mode: store.mode, user: store.user };
  }
}

export async function createProject(project) {
  try {
    const payload = await request('/api/projects', { method: 'POST', body: JSON.stringify(project) });
    return payload.data;
  } catch {
    const store = loadLocalStore();
    const record = { id: store.projects.length + 1, ...project };
    store.projects.push(record);
    saveLocalStore(store);
    return record;
  }
}

export async function saveTab(projectId, tabKey, payload) {
  try {
    const result = await request(`/api/projects/${projectId}/tabs/${tabKey}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return result.data;
  } catch {
    const store = loadLocalStore();
    store.tabs[`${projectId}:${tabKey}`] = payload;
    saveLocalStore(store);
    return { projectId, tabKey, payload };
  }
}

export async function calculateEstimate(payload) {
  try {
    const result = await request('/api/estimates/calculate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return result.data;
  } catch {
    const { calculateEstimate } = await import('./calculations.js');
    return calculateEstimate(payload);
  }
}

export async function createEstimate(payload) {
  try {
    const result = await request('/api/estimates', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return result.data;
  } catch {
    const store = loadLocalStore();
    const record = { id: store.estimates.length + 1, ...payload };
    store.estimates.push(record);
    saveLocalStore(store);
    return record;
  }
}

export async function createContract(payload) {
  try {
    const result = await request('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return result.data;
  } catch {
    const store = loadLocalStore();
    const record = { id: store.contracts.length + 1, ...payload };
    store.contracts.push(record);
    saveLocalStore(store);
    return record;
  }
}

export async function listCatalog() {
  try {
    const result = await request('/api/admin/catalog');
    return result.data;
  } catch {
    const store = loadLocalStore();
    if (!store.catalog.length) {
      store.catalog = Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        sku: `LOCAL-${String(index + 1).padStart(3, '0')}`,
        name: `Catalog Product ${index + 1}`,
        category: index % 2 === 0 ? 'Chain Link' : 'Hardware',
        unit: 'ea',
        price: 10 + index * 2.5
      }));
      saveLocalStore(store);
    }
    return store.catalog;
  }
}
