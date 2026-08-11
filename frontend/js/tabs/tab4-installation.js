(function () {
  const MODULE = {
    app: null,
    formId: 'installation-form',

    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      if (!this.form) return;
      this.form.addEventListener('input', () => this.captureState());
      this.form.addEventListener('change', () => this.captureState());
      this.loadFromState();
    },

    captureState() {
      const data = UI.getFormData(this.formId);
      this.app.updateSection('installation', data);
      document.dispatchEvent(new CustomEvent('estimate:recalculate'));
    },

    loadFromState() {
      UI.setFormData(this.formId, this.app.state.installation);
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.installation = MODULE;
})();
