(function () {
  const MODULE = {
    app: null,
    formId: 'permit-form',
    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      this.form?.addEventListener('input', () => this.captureState());
      this.form?.addEventListener('change', () => this.captureState());
      this.loadFromState();
    },
    captureState() {
      this.app.updateSection('permits', UI.getFormData(this.formId));
    },
    loadFromState() {
      UI.setFormData(this.formId, this.app.state.permits);
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.permits = MODULE;
})();
