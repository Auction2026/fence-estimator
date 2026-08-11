(function () {
  const MODULE = {
    app: null,
    formId: 'utilities-form',
    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      this.form?.addEventListener('input', () => this.captureState());
      this.form?.addEventListener('change', () => this.captureState());
      this.loadFromState();
    },
    captureState() {
      this.app.updateSection('utilities', UI.getFormData(this.formId));
    },
    loadFromState() {
      UI.setFormData(this.formId, this.app.state.utilities);
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.utilities = MODULE;
})();
