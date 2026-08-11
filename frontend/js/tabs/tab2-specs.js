(function () {
  const MODULE = {
    app: null,
    formId: 'fence-specs-form',

    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      this.summary = document.getElementById('spec-summary');
      if (!this.form) return;
      this.bindEvents();
      this.loadFromState();
      this.renderSummary();
    },

    bindEvents() {
      const handleChange = () => {
        const data = UI.getFormData(this.formId);
        this.app.updateSection('specs', data);
        this.renderSummary();
        document.dispatchEvent(new CustomEvent('estimate:recalculate'));
      };
      this.form.addEventListener('input', handleChange);
      this.form.addEventListener('change', handleChange);
    },

    loadFromState() {
      UI.setFormData(this.formId, this.app.state.specs);
    },

    renderSummary() {
      const specs = { ...this.app.state.specs, ...UI.getFormData(this.formId) };
      const materials = Calculations.calculateMaterials(specs);
      const gates = Number(specs.gateCount || 0);
      const totalMaterialCost = materials.reduce((sum, item) => sum + Number(item.total || 0), 0);
      this.summary.innerHTML = [
        `<div class="summary-pill"><small>Fence Type</small><div>${(specs.fenceType || 'chain-link').replace('-', ' ')}</div></div>`,
        `<div class="summary-pill"><small>Total Footage</small><div>${specs.totalFootage || 0} lf</div></div>`,
        `<div class="summary-pill"><small>Gates</small><div>${gates} @ ${specs.gateWidth || 4} ft</div></div>`,
        `<div class="summary-pill"><small>Estimated Materials</small><div>${Calculations.formatCurrency(totalMaterialCost)}</div></div>`
      ].join('');
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.specs = MODULE;
})();
