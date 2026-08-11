(function () {
  const MODULE = {
    app: null,
    formId: 'contract-form',

    init(app) {
      this.app = app;
      this.preview = document.getElementById('contract-preview');
      document.getElementById('contractTerms')?.addEventListener('input', () => this.captureState());
      document.getElementById('generate-contract-btn')?.addEventListener('click', () => this.generatePreview());
      document.addEventListener('contract:updated', () => this.renderSummary());
      document.getElementById(this.formId)?.addEventListener('input', () => this.captureState());
      this.loadFromState();
    },

    captureState() {
      const formData = UI.getFormData(this.formId);
      this.app.updateSection('contract', {
        ...this.app.state.contract,
        ...formData,
        contractTerms: document.getElementById('contractTerms')?.value || ''
      });
      this.renderSummary();
    },

    renderSummary() {
      const contract = this.app.state.contract;
      document.getElementById('contractLockedPrice').textContent = Calculations.formatCurrency(contract.lockedPrice || 0);
      document.getElementById('contractLockedDate').textContent = contract.lockedDate
        ? `Locked ${new Date(contract.lockedDate).toLocaleString()}`
        : 'Price not locked';
      if (document.getElementById('contractTerms')) {
        document.getElementById('contractTerms').value = contract.contractTerms || document.getElementById('contractTerms').value;
      }
    },

    generatePreview() {
      this.captureState();
      const data = this.app.state.contract;
      const validation = Validation.validateContract(data);
      if (!validation.valid) {
        UI.showNotification('Contract details are incomplete.', 'warning');
        return;
      }
      const project = this.app.state.project;
      this.preview.innerHTML = `
        <h3>Fence Depot Contract Preview</h3>
        <p><strong>Project:</strong> ${project.projectId || 'Draft'} • ${project.customerName || 'Customer'}</p>
        <p><strong>Address:</strong> ${project.address || ''}, ${project.city || ''}, ${project.province || ''}</p>
        <p><strong>Contract Price:</strong> ${Calculations.formatCurrency(data.lockedPrice || 0)}</p>
        <p><strong>Deposit:</strong> ${Calculations.formatCurrency(data.depositAmount || 0)}</p>
        <p><strong>Terms:</strong><br>${(data.contractTerms || '').replace(/\\n/g, '<br>')}</p>
        <p><strong>Customer:</strong> ${data.customerSignature || ''} &nbsp; | &nbsp; <strong>Fence Depot:</strong> ${data.salesSignature || ''}</p>`;
      UI.showNotification('Contract preview generated.', 'success');
    },

    loadFromState() {
      UI.setFormData(this.formId, this.app.state.contract);
      this.renderSummary();
      if (this.app.state.contract.contractTerms) {
        document.getElementById('contractTerms').value = this.app.state.contract.contractTerms;
      }
      if (this.preview && this.app.state.contract.lockedPrice && this.app.state.contract.customerSignature && this.app.state.contract.salesSignature) {
        this.generatePreview();
      }
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.contract = MODULE;
})();
