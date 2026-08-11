const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export class ApiError extends Error {
  constructor(message, { status = 500, payload = null, url = '' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.url = url;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
}

function serializeQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

export class ApiClient {
  constructor({ baseUrl = '/api', retries = 2, retryDelay = 300, timeout = 12000 } = {}) {
    this.baseUrl = baseUrl;
    this.retries = retries;
    this.retryDelay = retryDelay;
    this.timeout = timeout;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  clearToken() {
    this.token = null;
    return this;
  }

  getHeaders(headers = {}) {
    const resolved = { ...DEFAULT_HEADERS, ...headers };
    if (this.token) resolved.Authorization = 'Bearer ' + this.token;
    return resolved;
  }

  async request(path, { method = 'GET', headers = {}, body, query, retries = this.retries, signal } = {}) {
    const controller = signal ? null : new AbortController();
    const activeSignal = signal || controller.signal;
    const timeoutId = controller ? setTimeout(() => controller.abort(), this.timeout) : null;
    const url = `${joinUrl(this.baseUrl, path)}${serializeQuery(query)}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(headers),
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: activeSignal,
      });
      const payload = await parseResponse(response);
      if (!response.ok) {
        throw new ApiError(payload?.message || `Request failed with status ${response.status}`, { status: response.status, payload, url });
      }
      return payload;
    } catch (error) {
      if (retries > 0 && !(error instanceof ApiError && error.status < 500)) {
        await wait(this.retryDelay);
        return this.request(path, { method, headers, body, query, retries: retries - 1, signal });
      }
      if (error.name === 'AbortError') throw new ApiError('The request timed out. Please try again.', { status: 408, url });
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Unable to contact the server.', { status: 0, url });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  get(path, options = {}) { return this.request(path, { ...options, method: 'GET' }); }
  post(path, body, options = {}) { return this.request(path, { ...options, method: 'POST', body }); }
  put(path, body, options = {}) { return this.request(path, { ...options, method: 'PUT', body }); }
  patch(path, body, options = {}) { return this.request(path, { ...options, method: 'PATCH', body }); }
  delete(path, options = {}) { return this.request(path, { ...options, method: 'DELETE' }); }

  health() { return this.get('health'); }
  register(payload) { return this.post('auth/register', payload); }
  login(payload) { return this.post('auth/login', payload); }
  me() { return this.get('auth/me'); }

  listProjects(query = {}) { return this.get('projects', { query }); }
  getProject(projectId) { return this.get(`projects/${projectId}`); }
  createProject(payload) { return this.post('projects', payload); }
  updateProject(projectId, payload) { return this.put(`projects/${projectId}`, payload); }
  deleteProject(projectId) { return this.delete(`projects/${projectId}`); }

  listEstimates(query = {}) { return query.projectId ? this.get(`estimates/${query.projectId}`) : this.get('estimates', { query }); }
  getEstimate(estimateId) { return this.get(`estimates/${estimateId}`); }
  createEstimate(payload) { return this.post('estimates', payload); }
  updateEstimate(estimateId, payload) { return this.put(`estimates/${estimateId}`, payload); }
  deleteEstimate(estimateId) { return this.delete(`estimates/${estimateId}`); }

  listCustomers(query = {}) { return this.get('customers', { query }); }
  getCustomer(customerId) { return this.get(`customers/${customerId}`); }
  createCustomer(payload) { return this.post('customers', payload); }
  updateCustomer(customerId, payload) { return this.put(`customers/${customerId}`, payload); }
  deleteCustomer(customerId) { return this.delete(`customers/${customerId}`); }

  listMaterials(query = {}) { return this.get('materials', { query }); }
  getMaterial(materialId) { return this.get(`materials/${materialId}`); }
  createMaterial(payload) { return this.post('materials', payload); }
  updateMaterial(materialId, payload) { return this.put(`materials/${materialId}`, payload); }
  deleteMaterial(materialId) { return this.delete(`materials/${materialId}`); }

  listSuppliers(query = {}) { return this.get('suppliers', { query }); }
  getSupplier(supplierId) { return this.get(`suppliers/${supplierId}`); }
  createSupplier(payload) { return this.post('suppliers', payload); }
  updateSupplier(supplierId, payload) { return this.put(`suppliers/${supplierId}`, payload); }
  deleteSupplier(supplierId) { return this.delete(`suppliers/${supplierId}`); }

  listContracts(query = {}) { return query.projectId ? this.get(`contracts/${query.projectId}`) : this.get('contracts', { query }); }
  createContract(payload) { return this.post('contracts', payload); }

  batch(requests = []) {
    return Promise.all(requests.map((request) => this.request(request.path, request)));
  }
}

export const apiClient = new ApiClient();

export async function authenticateAndPrime(credentials, client = apiClient) {
  const payload = await client.login(credentials);
  if (payload?.token) client.setToken(payload.token);
  return payload;
}

export async function loadDashboardData(client = apiClient) {
  const [projects, materials, suppliers, health] = await Promise.allSettled([
    client.listProjects(),
    client.listMaterials(),
    client.listSuppliers(),
    client.health(),
  ]);

  return {
    projects: projects.status === 'fulfilled' ? projects.value.projects || [] : [],
    materials: materials.status === 'fulfilled' ? materials.value.materials || [] : [],
    suppliers: suppliers.status === 'fulfilled' ? suppliers.value.suppliers || [] : [],
    health: health.status === 'fulfilled' ? health.value : null,
    errors: [projects, materials, suppliers, health].filter((result) => result.status === 'rejected').map((result) => result.reason),
  };
}

export async function saveEstimateWorkflow({ customer, project, estimate }, client = apiClient) {
  const savedCustomer = customer?.id ? await client.updateCustomer(customer.id, customer) : await client.createCustomer(customer);
  const projectPayload = { ...project, customerId: savedCustomer.customer?.id || savedCustomer.customer?._id || customer?.id };
  const savedProject = project?.projectId ? await client.updateProject(project.projectId, projectPayload) : await client.createProject(projectPayload);
  const estimatePayload = {
    ...estimate,
    projectId: savedProject.project?.projectId || project.projectId,
    customerName: estimate.customerName || `${customer.firstName} ${customer.lastName}`.trim(),
  };
  const savedEstimate = estimate?.estimateId ? await client.updateEstimate(estimate.estimateId, estimatePayload) : await client.createEstimate(estimatePayload);
  return {
    customer: savedCustomer.customer || savedCustomer,
    project: savedProject.project || savedProject,
    estimate: savedEstimate.estimate || savedEstimate,
  };
}

export function withGracefulErrors(fn, onError = console.error) {
  return async (...args) => {
    try { return await fn(...args); }
    catch (error) { onError(error); throw error; }
  };
}

export function buildCrudFacade(resource, client = apiClient) {
  return {
    list: (query) => client.get(resource, { query }),
    get: (id) => client.get(`${resource}/${id}`),
    create: (payload) => client.post(resource, payload),
    update: (id, payload) => client.put(`${resource}/${id}`, payload),
    remove: (id) => client.delete(`${resource}/${id}`),
  };
}

export const customerApi = buildCrudFacade('customers');
export const materialApi = buildCrudFacade('materials');
export const supplierApi = buildCrudFacade('suppliers');
export const projectApi = buildCrudFacade('projects');
export const estimateApi = buildCrudFacade('estimates');
export const contractApi = buildCrudFacade('contracts');

export async function syncReferenceData(client = apiClient) {
  const [materials, suppliers] = await Promise.all([client.listMaterials(), client.listSuppliers()]);
  return { materials: materials.materials || materials, suppliers: suppliers.suppliers || suppliers };
}

export async function fetchProjectBundle(projectId, client = apiClient) {
  const [project, estimates, contracts] = await Promise.all([
    client.getProject(projectId),
    client.listEstimates({ projectId }),
    client.listContracts({ projectId }),
  ]);
  return {
    project: project.project || project,
    estimates: estimates.estimates || estimates,
    contracts: contracts.contracts || contracts,
  };
}

if (typeof window !== 'undefined') {
  window.FenceEstimatorApi = apiClient;
}


export function normalizeCollectionResponse(payload, preferredKey) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (preferredKey && Array.isArray(payload[preferredKey])) return payload[preferredKey];
  const firstArrayKey = Object.keys(payload).find((key) => Array.isArray(payload[key]));
  return firstArrayKey ? payload[firstArrayKey] : [];
}

export async function fetchAllCrudCollections(client = apiClient) {
  const [projects, estimates, customers, materials, suppliers] = await Promise.allSettled([
    client.listProjects(),
    client.listEstimates(),
    client.listCustomers(),
    client.listMaterials(),
    client.listSuppliers(),
  ]);

  return {
    projects: projects.status === 'fulfilled' ? normalizeCollectionResponse(projects.value, 'projects') : [],
    estimates: estimates.status === 'fulfilled' ? normalizeCollectionResponse(estimates.value, 'estimates') : [],
    customers: customers.status === 'fulfilled' ? normalizeCollectionResponse(customers.value, 'customers') : [],
    materials: materials.status === 'fulfilled' ? normalizeCollectionResponse(materials.value, 'materials') : [],
    suppliers: suppliers.status === 'fulfilled' ? normalizeCollectionResponse(suppliers.value, 'suppliers') : [],
    errors: [projects, estimates, customers, materials, suppliers].filter((item) => item.status === 'rejected').map((item) => item.reason),
  };
}

export function createRetryingCaller(client = apiClient, defaultRetries = 1) {
  return async (path, options = {}) => client.request(path, { retries: defaultRetries, ...options });
}

export async function upsertProjectEstimateBundle(bundle, client = apiClient) {
  const project = bundle.project?.projectId
    ? await client.updateProject(bundle.project.projectId, bundle.project)
    : await client.createProject(bundle.project);

  const estimatePayload = {
    ...bundle.estimate,
    projectId: project.project?.projectId || bundle.project?.projectId,
  };

  const estimate = bundle.estimate?.estimateId
    ? await client.updateEstimate(bundle.estimate.estimateId, estimatePayload)
    : await client.createEstimate(estimatePayload);

  return {
    project: project.project || project,
    estimate: estimate.estimate || estimate,
  };
}

export async function removeProjectCascade(projectId, client = apiClient) {
  const details = await fetchProjectBundle(projectId, client).catch(() => ({ estimates: [], contracts: [] }));
  const estimateDeletes = (details.estimates || []).map((estimate) => {
    const estimateId = estimate.estimateId || estimate.id || estimate._id;
    return estimateId ? client.deleteEstimate(estimateId).catch(() => null) : Promise.resolve(null);
  });
  await Promise.allSettled(estimateDeletes);
  return client.deleteProject(projectId);
}

export function createScopedClient(baseUrl, token) {
  const client = new ApiClient({ baseUrl });
  if (token) client.setToken(token);
  return client;
}

