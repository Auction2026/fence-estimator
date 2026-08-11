(function () {
  const MODULE = {
    app: null,
    formId: 'estimate-form',

    init(app) {
      this.app = app;
      this.form = document.getElementById(this.formId);
      this.breakdown = document.getElementById('estimate-breakdown');
      this.bindEvents();
      this.loadFromState();
      this.recalculate(false);
    },

    bindEvents() {
      document.getElementById('recalculate-estimate-btn')?.addEventListener('click', () => this.recalculate());
      document.getElementById('save-estimate-btn')?.addEventListener('click', () => this.saveRemote());
      document.getElementById('lock-price-btn')?.addEventListener('click', () => this.lockPrice());
      this.form?.addEventListener('input', () => this.captureSettings());
      document.addEventListener('estimate:recalculate', () => this.recalculate(false));
    },

    captureSettings() {
      const settings = UI.getFormData(this.formId);
      this.app.updateSection('estimate', { ...this.app.state.estimate, ...settings });
    },

    recalculate(showNotice = true) {
      const specs = { ...this.app.state.specs, ...this.app.state.installation };
      const settings = { ...this.app.state.estimate, ...UI.getFormData(this.formId) };
      const materials = Calculations.calculateMaterials(specs);
      const extrasTotal = (this.app.state.extras || []).reduce((sum, item) => sum + Number(item.total || 0), 0);
      const labor = Calculations.calculateLaborCost({ ...specs, crewSize: this.app.state.installation.crewSize }, settings.laborRate || 65);
      const totals = Calculations.calculateTotal(materials, labor, settings.markupPercent || 0, extrasTotal);
      const payload = {
        ...settings,
        materials,
        labor,
        extrasTotal,
        ...totals,
        generatedAt: new Date().toISOString()
      };
      this.app.updateSection('estimate', payload, false);
      this.renderEstimate(payload);
      if (showNotice) UI.showNotification('Estimate recalculated.', 'success');
      return payload;
    },

    renderEstimate(estimate = this.app.state.estimate) {
      UI.setFormData(this.formId, estimate);
      const body = document.querySelector('#materials-table tbody');
      body.innerHTML = '';
      if (!(estimate.materials || []).length) {
        body.innerHTML = '<tr><td colspan="5">Enter project footage and fence specs to calculate materials.</td></tr>';
      } else {
        estimate.materials.forEach((item) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.item}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${Calculations.formatCurrency(item.unitCost)}</td>
            <td>${Calculations.formatCurrency(item.total)}</td>`;
          body.appendChild(row);
        });
      }

      document.getElementById('estimate-materials-total').textContent = Calculations.formatCurrency(estimate.materialsTotal || 0);
      document.getElementById('estimate-labor-total').textContent = Calculations.formatCurrency(estimate.laborTotal || 0);
      document.getElementById('estimate-markup-total').textContent = Calculations.formatCurrency(estimate.markupAmount || 0);
      document.getElementById('estimate-grand-total').textContent = Calculations.formatCurrency(estimate.total || 0);
      this.breakdown.innerHTML = `
        <p><strong>Labor Hours:</strong> ${estimate.labor?.hours || 0} hrs • <strong>Crew Size:</strong> ${estimate.labor?.crewSize || 0}</p>
        <p><strong>Extras:</strong> ${Calculations.formatCurrency(estimate.extrasTotal || 0)} • <strong>Subtotal:</strong> ${Calculations.formatCurrency(estimate.subtotal || 0)}</p>
        <p><strong>Generated:</strong> ${estimate.generatedAt ? new Date(estimate.generatedAt).toLocaleString() : 'Not yet calculated'}</p>`;
    },

    loadFromState() {
      UI.setFormData(this.formId, this.app.state.estimate);
      this.renderEstimate(this.app.state.estimate);
    },

    lockPrice() {
      const estimate = this.recalculate(false);
      this.app.updateSection('contract', {
        ...this.app.state.contract,
        lockedPrice: estimate.total,
        lockedDate: new Date().toISOString()
      });
      document.dispatchEvent(new CustomEvent('contract:updated'));
      UI.showNotification('Estimate locked for contract.', 'success');
    },

    async saveRemote() {
      const estimate = this.recalculate(false);
      const validation = Validation.validateEstimate(estimate);
      if (!validation.valid) {
        UI.showNotification('Estimate needs to be recalculated or corrected first.', 'warning');
        return null;
      }
      const project = this.app.state.project;
      const payload = {
        projectId: project.projectId,
        customerName: project.customerName,
        fenceType: this.app.state.specs.fenceType,
        linearFeet: Number(this.app.state.specs.totalFootage || 0),
        height: Number(this.app.state.specs.fenceHeight || 0),
        installationType: project.projectType,
        laborRate: Number(estimate.laborRate || 0),
        permitCost: 0,
        utilityCost: 0,
        contingency: Number(estimate.markupAmount || 0),
        notes: this.app.state.specs.specNotes || ''
      };
      try {
        await Api.saveEstimate(payload);
        UI.showNotification('Estimate synced to backend.', 'success');
        return payload;
      } catch (error) {
        return null;
      }
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.estimate = MODULE;
})();
