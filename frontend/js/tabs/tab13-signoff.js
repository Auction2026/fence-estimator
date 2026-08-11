(function () {
  const MODULE = {
    app: null,
    formId: 'signoff-form',
    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      this.form?.addEventListener('input', () => this.captureState());
      this.form?.addEventListener('change', () => this.captureState());
      this.loadFromState();
    },
    captureState() {
      this.app.updateSection('signoff', UI.getFormData(this.formId));
    },
    loadFromState() {
      UI.setFormData(this.formId, this.app.state.signoff);
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.signoff = MODULE;
})();
