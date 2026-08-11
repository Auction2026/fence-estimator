(function () {
  const DEFAULT_BASE_URL = 'http://localhost:3001/api';

  const Api = {
    baseURL: localStorage.getItem('fenceDepot:apiBaseUrl') || DEFAULT_BASE_URL,
    token: localStorage.getItem('fenceDepot:token') || '',

    setBaseURL(url) {
      this.baseURL = url || DEFAULT_BASE_URL;
      localStorage.setItem('fenceDepot:apiBaseUrl', this.baseURL);
    },

    setAuthToken(token) {
      this.token = token || '';
      if (this.token) {
        localStorage.setItem('fenceDepot:token', this.token);
      } else {
        localStorage.removeItem('fenceDepot:token');
      }
    },

    async request(path, options = {}, useLoader = true) {
      const url = `${this.baseURL}${path}`;
      try {
        if (useLoader && window.UI) UI.toggleLoadingSpinner(true);
        const headers = {
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          ...(options.headers || {})
        };
        if (this.token) {
          headers.Authorization = 'Bearer ' + this.token;
        }

        const response = await fetch(url, {
          ...options,
          headers
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || payload.error || `Request failed with status ${response.status}`);
        }

        const status = document.getElementById('api-status');
        if (status) {
          status.classList.remove('status-warning', 'status-danger');
          status.classList.add('status-success');
          status.textContent = 'Connected';
        }

        return payload;
      } catch (error) {
        console.error(`API request failed for ${path}:`, error);
        const status = document.getElementById('api-status');
        if (status) {
          status.classList.remove('status-success', 'status-warning');
          status.classList.add('status-danger');
          status.textContent = 'Connection Error';
        }
        throw error;
      } finally {
        if (useLoader && window.UI) UI.toggleLoadingSpinner(false);
      }
    },

    async fetchProjects() {
      try {
        const payload = await this.request('/projects', { method: 'GET' });
        return payload.projects || [];
      } catch (error) {
        UI?.showNotification(`Unable to fetch projects: ${error.message}`, 'warning');
        return [];
      }
    },

    async saveProject(projectData) {
      try {
        const isServerProject = projectData.projectId && !String(projectData.projectId).startsWith('LOCAL-');
        const payload = await this.request(isServerProject ? `/projects/${projectData.projectId}` : '/projects', {
          method: isServerProject ? 'PUT' : 'POST',
          body: JSON.stringify(projectData)
        });
        return payload.project || payload;
      } catch (error) {
        UI?.showNotification(`Project saved locally only: ${error.message}`, 'warning');
        throw error;
      }
    },

    async getEstimate(projectId) {
      try {
        const payload = await this.request(`/estimates/${projectId}`, { method: 'GET' });
        return payload.estimates || [];
      } catch (error) {
        UI?.showNotification(`Unable to load estimate history: ${error.message}`, 'warning');
        return [];
      }
    },

    async saveEstimate(data) {
      try {
        const payload = await this.request('/estimates', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        return payload.estimate || payload;
      } catch (error) {
        UI?.showNotification(`Estimate saved locally only: ${error.message}`, 'warning');
        throw error;
      }
    },

    async getInventory() {
      try {
        const payload = await this.request('/inventory', { method: 'GET' });
        return payload.inventory || payload.items || [];
      } catch (error) {
        return window.FenceEstimatorCatalog || [];
      }
    },

    async getProducts() {
      try {
        const payload = await this.request('/products', { method: 'GET' });
        return payload.products || payload.items || [];
      } catch (error) {
        return window.FenceEstimatorCatalog || [];
      }
    },

    async login(credentials) {
      try {
        const payload = await this.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
        if (payload.token) {
          this.setAuthToken(payload.token);
          localStorage.setItem('fenceDepot:user', JSON.stringify(payload.user || {}));
        }
        return payload;
      } catch (error) {
        UI?.showNotification(`Login failed: ${error.message}`, 'error');
        throw error;
      }
    },

    async logout() {
      this.setAuthToken('');
      localStorage.removeItem('fenceDepot:user');
      UI?.showNotification('Logged out of Fence Depot API session.', 'success');
      return true;
    }
  };

  window.Api = Api;
})();
