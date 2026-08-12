(function initFenceEstimatorNamespace(global) {
  const existing = global.FenceEstimator || {};
  const utils = existing.utils || {};
  utils.toNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  };
  utils.formatCurrency = (value) => new Intl.NumberFormat('en-CA', {
    style: 'currency', currency: 'CAD', minimumFractionDigits: 2,
  }).format(utils.toNumber(value));
  utils.uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  utils.clone = (value) => JSON.parse(JSON.stringify(value));
  utils.today = () => new Date().toISOString().slice(0, 10);
  utils.pickForm = (form) => Object.fromEntries(new FormData(form).entries());
  utils.byId = (id) => document.getElementById(id);
  const FE = global.FenceEstimator = Object.assign(existing, {
    config: Object.assign({
      storageKey: 'fence-estimator-state-v2',
      apiBase: global.location.hostname ? `${global.location.origin.replace(/\/$/, '')}/api` : '/api',
    }, existing.config || {}),
    modules: Object.assign({ tabs: {}, tools: {} }, existing.modules || {}),
    utils,
    registerTab(name, module) { this.modules.tabs[name] = module; return module; },
    registerTool(name, tool) { this.modules.tools[name] = tool; return tool; },
  });

  FE.API = {
    async request(path, options = {}) {
      const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
      const token = FE.Storage?.getToken?.();
      if (token) headers.Authorization = 'Bearer ' + token;
      try {
        const response = await fetch(`${FE.config.apiBase}${path}`, Object.assign({}, options, { headers }));
        const contentType = response.headers.get('content-type') || '';
        const payload = contentType.includes('application/json') ? await response.json() : await response.text();
        if (!response.ok) {
          throw new Error(payload.message || payload.error || `Request failed with ${response.status}`);
        }
        return payload;
      } catch (error) {
        return { success: false, offline: true, message: error.message };
      }
    },
    saveProject(project) {
      return this.request('/projects', { method: 'POST', body: JSON.stringify(project) });
    },
    saveEstimate(estimate) {
      return this.request('/estimates', { method: 'POST', body: JSON.stringify(estimate) });
    },
    saveContract(contract) {
      return this.request('/contracts', { method: 'POST', body: JSON.stringify(contract) });
    },
    health() {
      return this.request('/health', { method: 'GET', headers: {} });
    },
  };
})(window);
