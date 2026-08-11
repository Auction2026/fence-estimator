// API Communication Layer
'use strict';

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

const Api = {
  authTokenKey: 'fenceDepotAuthToken',
  requestTimeout: 15000,
  getAuthToken() { return window.localStorage.getItem(this.authTokenKey) || ''; },
  setAuthToken(token) { if (token) window.localStorage.setItem(this.authTokenKey, token); else window.localStorage.removeItem(this.authTokenKey); },
  async login(username, password) { const result = await this._fetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); this.setAuthToken(result.token || ''); return result; },
  async logout() { const result = await this._fetch('/auth/logout', { method: 'POST' }); this.setAuthToken(''); return result; },
  async getProjects() { return this._fetch('/projects'); },
  async getProject(id) { return this._fetch(`/projects/${encodeURIComponent(id)}`); },
  async createProject(data) { return this._fetch('/projects', { method: 'POST', body: JSON.stringify(data) }); },
  async updateProject(id, data) { return this._fetch(`/projects/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteProject(id) { return this._fetch(`/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
  async getFenceSpecs(projectId) { return this._fetch(`/specs/${encodeURIComponent(projectId)}`); },
  async saveFenceSpecs(projectId, data) { return this._fetch(`/specs/${encodeURIComponent(projectId)}`, { method: 'POST', body: JSON.stringify(data) }); },
  async getEstimate(projectId) { return this._fetch(`/estimates/project/${encodeURIComponent(projectId)}`); },
  async createEstimate(projectId, data) { return this._fetch(`/estimates/${encodeURIComponent(projectId)}`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateEstimate(id, data) { return this._fetch(`/estimates/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async getContract(projectId) { return this._fetch(`/contracts/project/${encodeURIComponent(projectId)}`); },
  async createContract(data) { return this._fetch('/contracts', { method: 'POST', body: JSON.stringify(data) }); },
  async signContract(contractId, signatureData) { return this._fetch(`/contracts/${encodeURIComponent(contractId)}/sign`, { method: 'POST', body: JSON.stringify(signatureData) }); },
  async getChangeOrders(projectId) { return this._fetch(`/change-orders/project/${encodeURIComponent(projectId)}`); },
  async createChangeOrder(data) { return this._fetch('/change-orders', { method: 'POST', body: JSON.stringify(data) }); },
  async approveChangeOrder(id) { return this._fetch(`/change-orders/${encodeURIComponent(id)}/approve`, { method: 'POST' }); },
  async rejectChangeOrder(id) { return this._fetch(`/change-orders/${encodeURIComponent(id)}/reject`, { method: 'POST' }); },
  async createSignOff(data) { return this._fetch('/signoffs', { method: 'POST', body: JSON.stringify(data) }); },
  async getSignOff(projectId) { return this._fetch(`/signoffs/project/${encodeURIComponent(projectId)}`); },
  async getNotes() { return this._fetch('/notes'); },
  async createNote(data) { return this._fetch('/notes', { method: 'POST', body: JSON.stringify(data) }); },
  async updateNote(id, data) { return this._fetch(`/notes/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteNote(id) { return this._fetch(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
  async getProducts(filters = {}) { const query = new URLSearchParams(filters).toString(); return this._fetch(`/products${query ? `?${query}` : ''}`); },
  async searchProducts(query) { return this._fetch(`/products/search?q=${encodeURIComponent(query)}`); },
  async getStats() { return this._fetch('/admin/stats'); },
  async getUsers() { return this._fetch('/admin/users'); },
  async generateReport(type) { return this._fetch(`/admin/reports/${encodeURIComponent(type)}`, { method: 'POST' }); },
  async _fetch(url, options = {}) {
    const config = Object.assign({ method: 'GET', headers: {} }, options || {});
    const headers = new Headers(config.headers || {});
    headers.set('Accept', 'application/json');
    if (config.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const token = this.getAuthToken();
    if (token) headers.set('Authorization', 'Bearer ' + token);
    const attempts = [0, 350, 900];
    let lastError = null;
    for (let attempt = 0; attempt < attempts.length; attempt += 1) {
      if (attempt > 0) await this._wait(attempts[attempt]);
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), this.requestTimeout + attempt * 2500);
      try {
        const response = await fetch(`${API_BASE}${url}`, Object.assign({}, config, { headers, signal: controller.signal }));
        window.clearTimeout(timeoutId);
        const payload = await this._parseResponse(response);
        if (!response.ok) {
          const error = new Error(payload.message || payload.error || `Request failed with status ${response.status}`);
          error.status = response.status;
          error.payload = payload;
          throw error;
        }
        return payload;
      } catch (error) {
        window.clearTimeout(timeoutId);
        lastError = error;
        const retryable = this._isRetryable(error);
        if (!retryable || attempt === attempts.length - 1) { this._handleError(error); throw error; }
      }
    }
    this._handleError(lastError);
    throw lastError;
  },
  async _parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return response.json();
    const text = await response.text();
    try { return JSON.parse(text); } catch (_error) { return { message: text }; }
  },
  _isRetryable(error) {
    if (!error) return false;
    if (error.name === 'AbortError') return true;
    if (typeof error.status === 'number') return error.status >= 500 || error.status === 429;
    return true;
  },
  _wait(ms) { return new Promise((resolve) => window.setTimeout(resolve, ms)); },
  _handleError(error) { console.error('API error:', error); if (window.showNotification) showNotification(error && error.message ? error.message : 'API request failed.', 'danger'); }
};
window.Api = Api;

Api[`resource_1`] = async function resource_1(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/1${suffix}`, options);
};

Api[`resource_2`] = async function resource_2(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/2${suffix}`, options);
};

Api[`resource_3`] = async function resource_3(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/3${suffix}`, options);
};

Api[`resource_4`] = async function resource_4(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/4${suffix}`, options);
};

Api[`resource_5`] = async function resource_5(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/5${suffix}`, options);
};

Api[`resource_6`] = async function resource_6(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/6${suffix}`, options);
};

Api[`resource_7`] = async function resource_7(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/7${suffix}`, options);
};

Api[`resource_8`] = async function resource_8(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/8${suffix}`, options);
};

Api[`resource_9`] = async function resource_9(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/9${suffix}`, options);
};

Api[`resource_10`] = async function resource_10(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/10${suffix}`, options);
};

Api[`resource_11`] = async function resource_11(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/11${suffix}`, options);
};

Api[`resource_12`] = async function resource_12(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/12${suffix}`, options);
};

Api[`resource_13`] = async function resource_13(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/13${suffix}`, options);
};

Api[`resource_14`] = async function resource_14(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/14${suffix}`, options);
};

Api[`resource_15`] = async function resource_15(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/15${suffix}`, options);
};

Api[`resource_16`] = async function resource_16(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/16${suffix}`, options);
};

Api[`resource_17`] = async function resource_17(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/17${suffix}`, options);
};

Api[`resource_18`] = async function resource_18(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/18${suffix}`, options);
};

Api[`resource_19`] = async function resource_19(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/19${suffix}`, options);
};

Api[`resource_20`] = async function resource_20(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/20${suffix}`, options);
};

Api[`resource_21`] = async function resource_21(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/21${suffix}`, options);
};

Api[`resource_22`] = async function resource_22(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/22${suffix}`, options);
};

Api[`resource_23`] = async function resource_23(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/23${suffix}`, options);
};

Api[`resource_24`] = async function resource_24(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/24${suffix}`, options);
};

Api[`resource_25`] = async function resource_25(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/25${suffix}`, options);
};

Api[`resource_26`] = async function resource_26(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/26${suffix}`, options);
};

Api[`resource_27`] = async function resource_27(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/27${suffix}`, options);
};

Api[`resource_28`] = async function resource_28(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/28${suffix}`, options);
};

Api[`resource_29`] = async function resource_29(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/29${suffix}`, options);
};

Api[`resource_30`] = async function resource_30(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/30${suffix}`, options);
};

Api[`resource_31`] = async function resource_31(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/31${suffix}`, options);
};

Api[`resource_32`] = async function resource_32(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/32${suffix}`, options);
};

Api[`resource_33`] = async function resource_33(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/33${suffix}`, options);
};

Api[`resource_34`] = async function resource_34(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/34${suffix}`, options);
};

Api[`resource_35`] = async function resource_35(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/35${suffix}`, options);
};

Api[`resource_36`] = async function resource_36(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/36${suffix}`, options);
};

Api[`resource_37`] = async function resource_37(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/37${suffix}`, options);
};

Api[`resource_38`] = async function resource_38(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/38${suffix}`, options);
};

Api[`resource_39`] = async function resource_39(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/39${suffix}`, options);
};

Api[`resource_40`] = async function resource_40(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/40${suffix}`, options);
};

Api[`resource_41`] = async function resource_41(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/41${suffix}`, options);
};

Api[`resource_42`] = async function resource_42(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/42${suffix}`, options);
};

Api[`resource_43`] = async function resource_43(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/43${suffix}`, options);
};

Api[`resource_44`] = async function resource_44(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/44${suffix}`, options);
};

Api[`resource_45`] = async function resource_45(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/45${suffix}`, options);
};

Api[`resource_46`] = async function resource_46(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/46${suffix}`, options);
};

Api[`resource_47`] = async function resource_47(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/47${suffix}`, options);
};

Api[`resource_48`] = async function resource_48(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/48${suffix}`, options);
};

Api[`resource_49`] = async function resource_49(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/49${suffix}`, options);
};

Api[`resource_50`] = async function resource_50(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/50${suffix}`, options);
};

Api[`resource_51`] = async function resource_51(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/51${suffix}`, options);
};

Api[`resource_52`] = async function resource_52(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/52${suffix}`, options);
};

Api[`resource_53`] = async function resource_53(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/53${suffix}`, options);
};

Api[`resource_54`] = async function resource_54(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/54${suffix}`, options);
};

Api[`resource_55`] = async function resource_55(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/55${suffix}`, options);
};

Api[`resource_56`] = async function resource_56(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/56${suffix}`, options);
};

Api[`resource_57`] = async function resource_57(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/57${suffix}`, options);
};

Api[`resource_58`] = async function resource_58(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/58${suffix}`, options);
};

Api[`resource_59`] = async function resource_59(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/59${suffix}`, options);
};

Api[`resource_60`] = async function resource_60(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/60${suffix}`, options);
};

Api[`resource_61`] = async function resource_61(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/61${suffix}`, options);
};

Api[`resource_62`] = async function resource_62(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/62${suffix}`, options);
};

Api[`resource_63`] = async function resource_63(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/63${suffix}`, options);
};

Api[`resource_64`] = async function resource_64(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/64${suffix}`, options);
};

Api[`resource_65`] = async function resource_65(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/65${suffix}`, options);
};

Api[`resource_66`] = async function resource_66(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/66${suffix}`, options);
};

Api[`resource_67`] = async function resource_67(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/67${suffix}`, options);
};

Api[`resource_68`] = async function resource_68(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/68${suffix}`, options);
};

Api[`resource_69`] = async function resource_69(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/69${suffix}`, options);
};

Api[`resource_70`] = async function resource_70(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/70${suffix}`, options);
};

Api[`resource_71`] = async function resource_71(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/71${suffix}`, options);
};

Api[`resource_72`] = async function resource_72(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/72${suffix}`, options);
};

Api[`resource_73`] = async function resource_73(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/73${suffix}`, options);
};

Api[`resource_74`] = async function resource_74(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/74${suffix}`, options);
};

Api[`resource_75`] = async function resource_75(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/75${suffix}`, options);
};

Api[`resource_76`] = async function resource_76(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/76${suffix}`, options);
};

Api[`resource_77`] = async function resource_77(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/77${suffix}`, options);
};

Api[`resource_78`] = async function resource_78(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/78${suffix}`, options);
};

Api[`resource_79`] = async function resource_79(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/79${suffix}`, options);
};

Api[`resource_80`] = async function resource_80(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/80${suffix}`, options);
};

Api[`resource_81`] = async function resource_81(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/81${suffix}`, options);
};

Api[`resource_82`] = async function resource_82(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/82${suffix}`, options);
};

Api[`resource_83`] = async function resource_83(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/83${suffix}`, options);
};

Api[`resource_84`] = async function resource_84(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/84${suffix}`, options);
};

Api[`resource_85`] = async function resource_85(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/85${suffix}`, options);
};

Api[`resource_86`] = async function resource_86(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/86${suffix}`, options);
};

Api[`resource_87`] = async function resource_87(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/87${suffix}`, options);
};

Api[`resource_88`] = async function resource_88(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/88${suffix}`, options);
};

Api[`resource_89`] = async function resource_89(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/89${suffix}`, options);
};

Api[`resource_90`] = async function resource_90(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/90${suffix}`, options);
};

Api[`resource_91`] = async function resource_91(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/91${suffix}`, options);
};

Api[`resource_92`] = async function resource_92(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/92${suffix}`, options);
};

Api[`resource_93`] = async function resource_93(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/93${suffix}`, options);
};

Api[`resource_94`] = async function resource_94(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/94${suffix}`, options);
};

Api[`resource_95`] = async function resource_95(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/95${suffix}`, options);
};

Api[`resource_96`] = async function resource_96(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/96${suffix}`, options);
};

Api[`resource_97`] = async function resource_97(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/97${suffix}`, options);
};

Api[`resource_98`] = async function resource_98(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/98${suffix}`, options);
};

Api[`resource_99`] = async function resource_99(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/99${suffix}`, options);
};

Api[`resource_100`] = async function resource_100(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/100${suffix}`, options);
};

Api[`resource_101`] = async function resource_101(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/101${suffix}`, options);
};

Api[`resource_102`] = async function resource_102(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/102${suffix}`, options);
};

Api[`resource_103`] = async function resource_103(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/103${suffix}`, options);
};

Api[`resource_104`] = async function resource_104(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/104${suffix}`, options);
};

Api[`resource_105`] = async function resource_105(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/105${suffix}`, options);
};

Api[`resource_106`] = async function resource_106(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/106${suffix}`, options);
};

Api[`resource_107`] = async function resource_107(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/107${suffix}`, options);
};

Api[`resource_108`] = async function resource_108(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/108${suffix}`, options);
};

Api[`resource_109`] = async function resource_109(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/109${suffix}`, options);
};

Api[`resource_110`] = async function resource_110(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/110${suffix}`, options);
};

Api[`resource_111`] = async function resource_111(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/111${suffix}`, options);
};

Api[`resource_112`] = async function resource_112(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/112${suffix}`, options);
};

Api[`resource_113`] = async function resource_113(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/113${suffix}`, options);
};

Api[`resource_114`] = async function resource_114(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/114${suffix}`, options);
};

Api[`resource_115`] = async function resource_115(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/115${suffix}`, options);
};

Api[`resource_116`] = async function resource_116(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/116${suffix}`, options);
};

Api[`resource_117`] = async function resource_117(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/117${suffix}`, options);
};

Api[`resource_118`] = async function resource_118(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/118${suffix}`, options);
};

Api[`resource_119`] = async function resource_119(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/119${suffix}`, options);
};

Api[`resource_120`] = async function resource_120(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/120${suffix}`, options);
};

Api[`resource_121`] = async function resource_121(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/121${suffix}`, options);
};

Api[`resource_122`] = async function resource_122(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/122${suffix}`, options);
};

Api[`resource_123`] = async function resource_123(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/123${suffix}`, options);
};

Api[`resource_124`] = async function resource_124(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/124${suffix}`, options);
};

Api[`resource_125`] = async function resource_125(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/125${suffix}`, options);
};

Api[`resource_126`] = async function resource_126(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/126${suffix}`, options);
};

Api[`resource_127`] = async function resource_127(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/127${suffix}`, options);
};

Api[`resource_128`] = async function resource_128(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/128${suffix}`, options);
};

Api[`resource_129`] = async function resource_129(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/129${suffix}`, options);
};

Api[`resource_130`] = async function resource_130(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/130${suffix}`, options);
};

Api[`resource_131`] = async function resource_131(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/131${suffix}`, options);
};

Api[`resource_132`] = async function resource_132(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/132${suffix}`, options);
};

Api[`resource_133`] = async function resource_133(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/133${suffix}`, options);
};

Api[`resource_134`] = async function resource_134(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/134${suffix}`, options);
};

Api[`resource_135`] = async function resource_135(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/135${suffix}`, options);
};

Api[`resource_136`] = async function resource_136(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/136${suffix}`, options);
};

Api[`resource_137`] = async function resource_137(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/137${suffix}`, options);
};

Api[`resource_138`] = async function resource_138(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/138${suffix}`, options);
};

Api[`resource_139`] = async function resource_139(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/139${suffix}`, options);
};

Api[`resource_140`] = async function resource_140(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/140${suffix}`, options);
};

Api[`resource_141`] = async function resource_141(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/141${suffix}`, options);
};

Api[`resource_142`] = async function resource_142(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/142${suffix}`, options);
};

Api[`resource_143`] = async function resource_143(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/143${suffix}`, options);
};

Api[`resource_144`] = async function resource_144(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/144${suffix}`, options);
};

Api[`resource_145`] = async function resource_145(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/145${suffix}`, options);
};

Api[`resource_146`] = async function resource_146(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/146${suffix}`, options);
};

Api[`resource_147`] = async function resource_147(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/147${suffix}`, options);
};

Api[`resource_148`] = async function resource_148(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/148${suffix}`, options);
};

Api[`resource_149`] = async function resource_149(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/149${suffix}`, options);
};

Api[`resource_150`] = async function resource_150(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/150${suffix}`, options);
};

Api[`resource_151`] = async function resource_151(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/151${suffix}`, options);
};

Api[`resource_152`] = async function resource_152(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/152${suffix}`, options);
};

Api[`resource_153`] = async function resource_153(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/153${suffix}`, options);
};

Api[`resource_154`] = async function resource_154(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/154${suffix}`, options);
};

Api[`resource_155`] = async function resource_155(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/155${suffix}`, options);
};

Api[`resource_156`] = async function resource_156(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/156${suffix}`, options);
};

Api[`resource_157`] = async function resource_157(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/157${suffix}`, options);
};

Api[`resource_158`] = async function resource_158(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/158${suffix}`, options);
};

Api[`resource_159`] = async function resource_159(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/159${suffix}`, options);
};

Api[`resource_160`] = async function resource_160(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/160${suffix}`, options);
};

Api[`resource_161`] = async function resource_161(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/161${suffix}`, options);
};

Api[`resource_162`] = async function resource_162(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/162${suffix}`, options);
};

Api[`resource_163`] = async function resource_163(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/163${suffix}`, options);
};

Api[`resource_164`] = async function resource_164(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/164${suffix}`, options);
};

Api[`resource_165`] = async function resource_165(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/165${suffix}`, options);
};

Api[`resource_166`] = async function resource_166(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/166${suffix}`, options);
};

Api[`resource_167`] = async function resource_167(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/167${suffix}`, options);
};

Api[`resource_168`] = async function resource_168(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/168${suffix}`, options);
};

Api[`resource_169`] = async function resource_169(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/169${suffix}`, options);
};

Api[`resource_170`] = async function resource_170(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/170${suffix}`, options);
};

Api[`resource_171`] = async function resource_171(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/171${suffix}`, options);
};

Api[`resource_172`] = async function resource_172(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/172${suffix}`, options);
};

Api[`resource_173`] = async function resource_173(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/173${suffix}`, options);
};

Api[`resource_174`] = async function resource_174(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/174${suffix}`, options);
};

Api[`resource_175`] = async function resource_175(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/175${suffix}`, options);
};

Api[`resource_176`] = async function resource_176(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/176${suffix}`, options);
};

Api[`resource_177`] = async function resource_177(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/177${suffix}`, options);
};

Api[`resource_178`] = async function resource_178(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/178${suffix}`, options);
};

Api[`resource_179`] = async function resource_179(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/179${suffix}`, options);
};

Api[`resource_180`] = async function resource_180(id, data) {
  const suffix = id ? `/${encodeURIComponent(id)}` : '';
  const method = data ? 'POST' : 'GET';
  const options = data ? { method, body: JSON.stringify(data) } : { method };
  return this._fetch(`/resources/180${suffix}`, options);
};

Api[`cacheKey_1`] = function cacheKey_1(value) {
  return `api:1:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_2`] = function cacheKey_2(value) {
  return `api:2:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_3`] = function cacheKey_3(value) {
  return `api:3:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_4`] = function cacheKey_4(value) {
  return `api:4:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_5`] = function cacheKey_5(value) {
  return `api:5:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_6`] = function cacheKey_6(value) {
  return `api:6:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_7`] = function cacheKey_7(value) {
  return `api:7:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_8`] = function cacheKey_8(value) {
  return `api:8:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_9`] = function cacheKey_9(value) {
  return `api:9:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_10`] = function cacheKey_10(value) {
  return `api:10:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_11`] = function cacheKey_11(value) {
  return `api:11:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_12`] = function cacheKey_12(value) {
  return `api:12:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_13`] = function cacheKey_13(value) {
  return `api:13:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_14`] = function cacheKey_14(value) {
  return `api:14:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_15`] = function cacheKey_15(value) {
  return `api:15:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_16`] = function cacheKey_16(value) {
  return `api:16:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_17`] = function cacheKey_17(value) {
  return `api:17:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_18`] = function cacheKey_18(value) {
  return `api:18:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_19`] = function cacheKey_19(value) {
  return `api:19:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_20`] = function cacheKey_20(value) {
  return `api:20:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_21`] = function cacheKey_21(value) {
  return `api:21:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_22`] = function cacheKey_22(value) {
  return `api:22:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_23`] = function cacheKey_23(value) {
  return `api:23:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_24`] = function cacheKey_24(value) {
  return `api:24:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_25`] = function cacheKey_25(value) {
  return `api:25:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_26`] = function cacheKey_26(value) {
  return `api:26:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_27`] = function cacheKey_27(value) {
  return `api:27:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_28`] = function cacheKey_28(value) {
  return `api:28:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_29`] = function cacheKey_29(value) {
  return `api:29:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_30`] = function cacheKey_30(value) {
  return `api:30:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_31`] = function cacheKey_31(value) {
  return `api:31:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_32`] = function cacheKey_32(value) {
  return `api:32:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_33`] = function cacheKey_33(value) {
  return `api:33:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_34`] = function cacheKey_34(value) {
  return `api:34:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_35`] = function cacheKey_35(value) {
  return `api:35:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_36`] = function cacheKey_36(value) {
  return `api:36:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_37`] = function cacheKey_37(value) {
  return `api:37:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_38`] = function cacheKey_38(value) {
  return `api:38:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_39`] = function cacheKey_39(value) {
  return `api:39:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_40`] = function cacheKey_40(value) {
  return `api:40:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_41`] = function cacheKey_41(value) {
  return `api:41:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_42`] = function cacheKey_42(value) {
  return `api:42:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_43`] = function cacheKey_43(value) {
  return `api:43:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_44`] = function cacheKey_44(value) {
  return `api:44:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_45`] = function cacheKey_45(value) {
  return `api:45:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_46`] = function cacheKey_46(value) {
  return `api:46:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_47`] = function cacheKey_47(value) {
  return `api:47:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_48`] = function cacheKey_48(value) {
  return `api:48:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_49`] = function cacheKey_49(value) {
  return `api:49:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_50`] = function cacheKey_50(value) {
  return `api:50:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_51`] = function cacheKey_51(value) {
  return `api:51:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_52`] = function cacheKey_52(value) {
  return `api:52:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_53`] = function cacheKey_53(value) {
  return `api:53:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_54`] = function cacheKey_54(value) {
  return `api:54:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_55`] = function cacheKey_55(value) {
  return `api:55:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_56`] = function cacheKey_56(value) {
  return `api:56:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_57`] = function cacheKey_57(value) {
  return `api:57:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_58`] = function cacheKey_58(value) {
  return `api:58:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_59`] = function cacheKey_59(value) {
  return `api:59:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_60`] = function cacheKey_60(value) {
  return `api:60:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_61`] = function cacheKey_61(value) {
  return `api:61:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_62`] = function cacheKey_62(value) {
  return `api:62:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_63`] = function cacheKey_63(value) {
  return `api:63:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_64`] = function cacheKey_64(value) {
  return `api:64:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_65`] = function cacheKey_65(value) {
  return `api:65:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_66`] = function cacheKey_66(value) {
  return `api:66:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_67`] = function cacheKey_67(value) {
  return `api:67:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_68`] = function cacheKey_68(value) {
  return `api:68:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_69`] = function cacheKey_69(value) {
  return `api:69:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_70`] = function cacheKey_70(value) {
  return `api:70:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_71`] = function cacheKey_71(value) {
  return `api:71:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_72`] = function cacheKey_72(value) {
  return `api:72:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_73`] = function cacheKey_73(value) {
  return `api:73:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_74`] = function cacheKey_74(value) {
  return `api:74:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_75`] = function cacheKey_75(value) {
  return `api:75:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_76`] = function cacheKey_76(value) {
  return `api:76:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_77`] = function cacheKey_77(value) {
  return `api:77:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_78`] = function cacheKey_78(value) {
  return `api:78:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_79`] = function cacheKey_79(value) {
  return `api:79:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_80`] = function cacheKey_80(value) {
  return `api:80:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_81`] = function cacheKey_81(value) {
  return `api:81:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_82`] = function cacheKey_82(value) {
  return `api:82:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_83`] = function cacheKey_83(value) {
  return `api:83:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_84`] = function cacheKey_84(value) {
  return `api:84:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_85`] = function cacheKey_85(value) {
  return `api:85:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_86`] = function cacheKey_86(value) {
  return `api:86:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_87`] = function cacheKey_87(value) {
  return `api:87:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_88`] = function cacheKey_88(value) {
  return `api:88:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_89`] = function cacheKey_89(value) {
  return `api:89:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_90`] = function cacheKey_90(value) {
  return `api:90:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_91`] = function cacheKey_91(value) {
  return `api:91:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_92`] = function cacheKey_92(value) {
  return `api:92:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_93`] = function cacheKey_93(value) {
  return `api:93:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_94`] = function cacheKey_94(value) {
  return `api:94:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_95`] = function cacheKey_95(value) {
  return `api:95:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_96`] = function cacheKey_96(value) {
  return `api:96:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_97`] = function cacheKey_97(value) {
  return `api:97:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_98`] = function cacheKey_98(value) {
  return `api:98:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_99`] = function cacheKey_99(value) {
  return `api:99:${value == null ? 'none' : String(value)}`;
};

Api[`cacheKey_100`] = function cacheKey_100(value) {
  return `api:100:${value == null ? 'none' : String(value)}`;
};
