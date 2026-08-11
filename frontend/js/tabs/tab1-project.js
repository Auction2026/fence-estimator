(function () {
  const MODULE = {
    app: null,
    formId: 'project-info-form',

    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      if (!this.form) return;
      this.ensureProjectIdentity();
      this.bindEvents();
      this.loadFromState();
    },

    ensureProjectIdentity() {
      if (!this.app.state.project.projectId) {
        this.app.updateSection('project', {
          projectId: `LOCAL-${Date.now()}`,
          projectDate: new Date().toISOString().slice(0, 10)
        }, false);
      }
    },

    bindEvents() {
      this.form.addEventListener('input', () => this.captureState());
      this.form.addEventListener('change', () => this.captureState());
    },

    captureState() {
      const data = UI.getFormData(this.formId);
      this.app.updateSection('project', data);
      this.refreshHeader(data);
      return data;
    },

    refreshHeader(data = this.app.state.project) {
      const label = data.customerName ? `${data.customerName} • ${data.projectId || 'Draft'}` : 'Untitled Project';
      const target = document.getElementById('current-project-name');
      if (target) target.textContent = label;
    },

    loadFromState() {
      const state = this.app.state.project;
      UI.setFormData(this.formId, state);
      this.refreshHeader(state);
    },

    async saveRemote() {
      const data = this.captureState();
      const validation = Validation.validateProjectInfo(data);
      if (!validation.valid) {
        UI.showNotification('Project information needs attention before save.', 'warning');
        return null;
      }

      const payload = { ...data };
      try {
        const saved = await Api.saveProject(payload);
        if (saved?.projectId) {
          this.app.updateSection('project', { ...payload, projectId: saved.projectId }, false);
          this.loadFromState();
        }
        UI.showNotification('Project synced to backend.', 'success');
        return saved;
      } catch (error) {
        return null;
      }
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.project = MODULE;
})();
