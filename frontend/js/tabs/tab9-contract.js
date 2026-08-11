// Contract tab
'use strict';

const Tab9 = {
  storageKey: 'contract-data',
  init() {
    this.container = document.getElementById('contractDisplay');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    document.addEventListener('click', (event) => {
      if (event.target.matches('#signContractBtn')) this.signContract();
      if (event.target.matches('#generateContractBtn')) this.generateContract(true);
      if (event.target.matches('#lockPriceBtn')) this.togglePriceLock();
    });
  },
  baseContractData() {
    const project = AppState.currentProject || {};
    const estimate = AppState.estimate || { totals: { total: 0 } };
    const totals = estimate.totals || estimate;
    return {
      id: (AppState.contract || {}).id || `contract-${Date.now()}`,
      projectId: project.projectId || project.id || App.nextProjectId(),
      customerName: project.customerName || '',
      projectSummary: [project.customerName, project.addressStreet, project.addressCity, project.addressState].filter(Boolean).join(' • ') || 'Project summary pending.',
      scopeOfWork: estimate.scopeOfWork || `${(estimate.specs || {}).fenceType || 'Fence'} installation including materials, labor, equipment, and clean-up.`,
      total: totals.total || 0,
      paymentTerms: '50% deposit, 40% material delivery, 10% upon completion.',
      warrantyInfo: '1 year workmanship warranty; manufacturer warranties apply where eligible.',
      price_locked: Boolean((AppState.contract || {}).price_locked),
      status: (AppState.contract || {}).status || 'Draft'
    };
  },
  generateContract(showToast = false) {
    const contract = Object.assign({}, this.baseContractData(), AppState.contract || {});
    AppState.contract = contract;
    Storage.save(this.storageKey, contract);
    this.render(contract);
    if (showToast) UI.showNotification('Contract generated from current estimate.', 'success');
    return contract;
  },
  renderClauses() {
    return [
      'Customer provides clear access to work areas.',
      'Fence Depot is not responsible for unmarked private utilities.',
      'Scope changes require written change orders.',
      'Weather and permit delays may adjust schedule.',
      'Final invoice is due upon substantial completion.'
    ].map((clause, index) => `<div class="contract-clause"><strong>Clause ${index + 1}.</strong> ${clause}</div>`).join('');
  },
  render(contractData) {
    const contract = contractData || this.generateContract(false);
    const badge = document.getElementById('priceLockedBadge');
    if (badge) {
      badge.style.display = contract.price_locked ? 'inline-flex' : 'none';
      badge.style.background = contract.price_locked ? '#caa646' : '';
      badge.style.color = contract.price_locked ? '#1f1a0a' : '';
    }
    if (!this.container) this.container = document.getElementById('contractDisplay');
    if (!this.container) return;
    this.container.innerHTML = `
      <section class="mb-3">
        <h2 id="contractProjectSummary">${contract.projectSummary}</h2>
        <div class="small-text">Project ID: ${contract.projectId}</div>
      </section>
      <section class="contract-clause"><strong>Scope of Work</strong><p id="contractScopeOfWork">${contract.scopeOfWork}</p></section>
      <section class="contract-grid">
        <div><h3>Price</h3><p id="contractPrice">${Calculator.formatCurrency(contract.total)}</p>${contract.price_locked ? '<span class="badge" style="background:#caa646;color:#1f1a0a;">PRICE LOCKED</span>' : ''}</div>
        <div><h3>Payment Terms</h3><p>${contract.paymentTerms}</p></div>
        <div><h3>Warranty</h3><p>${contract.warrantyInfo}</p></div>
        <div><h3>Status</h3><p id="contractStatusIndicator">${contract.status}</p></div>
      </section>
      ${this.renderClauses()}
      <section class="mt-4">
        <div class="signature-grid">
          <div class="signature-panel">
            <label class="form-label" for="contractCustomerName">Customer Name</label>
            <input class="form-control" id="contractCustomerName" value="${contract.customerName || ''}">
            <label class="form-label mt-2" for="contractCustomerDate">Date</label>
            <input class="form-control" id="contractCustomerDate" type="date" value="${contract.customerDate || ''}">
          </div>
          <div class="signature-panel">
            <label class="form-label" for="contractRepName">Fence Depot Representative</label>
            <input class="form-control" id="contractRepName" value="${contract.repName || 'Fence Depot'}">
            <label class="form-label mt-2" for="contractRepDate">Date</label>
            <input class="form-control" id="contractRepDate" type="date" value="${contract.repDate || ''}">
          </div>
        </div>
      </section>
      <div class="actions-inline mt-4">
        <button type="button" id="generateContractBtn" class="btn btn-primary">Generate Contract</button>
        <button type="button" id="signContractBtn" class="btn btn-success">Sign Contract</button>
        <button type="button" id="lockPriceBtn" class="btn btn-warning">${contract.price_locked ? 'Unlock Price' : 'Lock Price'}</button>
        <button type="button" id="printContractBtn" class="btn btn-secondary">Print Contract</button>
      </div>`;
    if (window.UI) UI.renderContract(contract);
  },
  togglePriceLock() {
    AppState.contract = Object.assign({}, AppState.contract || {}, { price_locked: !Boolean((AppState.contract || {}).price_locked) });
    this.render(AppState.contract);
    Storage.save(this.storageKey, AppState.contract);
  },
  signatureData() {
    return {
      customerName: document.getElementById('contractCustomerName') ? document.getElementById('contractCustomerName').value.trim() : '',
      customerDate: document.getElementById('contractCustomerDate') ? document.getElementById('contractCustomerDate').value : '',
      repName: document.getElementById('contractRepName') ? document.getElementById('contractRepName').value.trim() : '',
      repDate: document.getElementById('contractRepDate') ? document.getElementById('contractRepDate').value : ''
    };
  },
  async signContract() {
    const contract = this.generateContract(false);
    const signatureData = this.signatureData();
    if (!signatureData.customerName || !signatureData.customerDate) {
      UI.showNotification('Enter customer name and signature date first.', 'warning');
      return false;
    }
    try {
      const response = await Api.signContract(contract.id, signatureData);
      AppState.contract = Object.assign({}, contract, response, signatureData, { status: 'Signed' });
      UI.showNotification('Contract signed successfully.', 'success');
    } catch (_error) {
      AppState.contract = Object.assign({}, contract, signatureData, { status: 'Signed (Local)' });
      UI.showNotification('Contract saved locally; API sync pending.', 'warning');
    }
    Storage.save(this.storageKey, AppState.contract);
    this.render(AppState.contract);
    return true;
  },
  async load() {
    const projectId = ((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id || (AppState.currentProject || {}).projectId || '');
    if (projectId) {
      try {
        const contract = await Api.getContract(projectId);
        AppState.contract = Object.assign({}, this.baseContractData(), contract);
        Storage.save(this.storageKey, AppState.contract);
        this.render(AppState.contract);
        return contract;
      } catch (_error) {
        const local = Storage.load(this.storageKey) || AppState.contract || this.baseContractData();
        AppState.contract = local;
        this.render(local);
        return local;
      }
    }
    const local = Storage.load(this.storageKey) || AppState.contract || this.baseContractData();
    AppState.contract = local;
    this.render(local);
    return local;
  },
  save() {
    Storage.save(this.storageKey, AppState.contract || {});
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab9 = Tab9;
