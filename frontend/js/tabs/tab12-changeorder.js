// Change order tab
'use strict';

const Tab12 = {
  storageKey: 'change-orders',
  init() {
    this.prepareForm();
    this.form = document.getElementById('changeOrderForm');
    this.listBody = document.getElementById('changeOrdersTableBody');
    this.bindEvents();
    this.load();
  },
  prepareForm() {
    const form = document.getElementById('changeOrderForm');
    if (!form) return;
    form.innerHTML = `
      <div class="form-group"><label class="form-label" for="changeOrderDescription">Description</label><textarea class="form-control" id="changeOrderDescription" rows="4"></textarea></div>
      <div class="form-group"><label class="form-label" for="changeOrderReason">Reason</label><input class="form-control" id="changeOrderReason" type="text"></div>
      <div class="row">
        <div class="col col-4"><label class="form-label" for="materialsChange">Materials Change</label><input class="form-control" id="materialsChange" type="number" step="0.01"></div>
        <div class="col col-4"><label class="form-label" for="laborChange">Labor Change</label><input class="form-control" id="laborChange" type="number" step="0.01"></div>
        <div class="col col-4"><label class="form-label" for="timelineChangeDays">Timeline Change (days)</label><input class="form-control" id="timelineChangeDays" type="number" step="1"></div>
      </div>
      <div class="totals-row mt-3"><span>Total Change</span><strong id="totalChangeDisplay">$0.00</strong></div>
      <button type="button" id="createChangeOrderBtn" class="btn btn-primary mt-3">Create Change Order</button>`;
  },
  bindEvents() {
    const createButton = document.getElementById('createChangeOrderBtn');
    if (createButton) createButton.addEventListener('click', () => this.createChangeOrder());
    ['materialsChange', 'laborChange'].forEach((id) => {
      const field = document.getElementById(id);
      if (field) field.addEventListener('input', () => this.updateTotalDisplay());
    });
    if (!this.listBody) return;
    this.listBody.addEventListener('click', (event) => {
      const approve = event.target.closest('[data-approve-co]');
      const reject = event.target.closest('[data-reject-co]');
      if (approve) this.onApprove(Number(approve.dataset.approveCo));
      if (reject) this.onReject(Number(reject.dataset.rejectCo));
    });
  },
  statusBadge(status) {
    const colors = { Pending: '#f0c419', Approved: '#2e7d32', Rejected: '#c62828' };
    return `<span class="badge" style="background:${colors[status] || '#607d8b'};color:#fff;">${status}</span>`;
  },
  getFormData() {
    const materialsChange = App.safeNumber(document.getElementById('materialsChange') && document.getElementById('materialsChange').value);
    const laborChange = App.safeNumber(document.getElementById('laborChange') && document.getElementById('laborChange').value);
    return {
      description: document.getElementById('changeOrderDescription') ? document.getElementById('changeOrderDescription').value.trim() : '',
      reason: document.getElementById('changeOrderReason') ? document.getElementById('changeOrderReason').value.trim() : '',
      materialsChange,
      laborChange,
      timelineChangeDays: App.safeNumber(document.getElementById('timelineChangeDays') && document.getElementById('timelineChangeDays').value),
      totalChange: materialsChange + laborChange
    };
  },
  updateTotalDisplay() {
    const node = document.getElementById('totalChangeDisplay');
    if (node) node.textContent = Calculator.formatCurrency(this.getFormData().totalChange);
  },
  async createChangeOrder() {
    const data = this.getFormData();
    if (!data.description) {
      UI.showNotification('Enter a change order description.', 'warning');
      return false;
    }
    const payload = Object.assign({
      id: `CO-${Date.now()}`,
      projectId: (AppState.currentProject || {}).projectId || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    }, data);
    try {
      const response = await Api.createChangeOrder(payload);
      payload.id = response.id || payload.id;
    } catch (_error) {
      UI.showNotification('Change order saved locally; API sync pending.', 'warning');
    }
    AppState.changeOrders = Array.isArray(AppState.changeOrders) ? AppState.changeOrders : [];
    AppState.changeOrders.unshift(payload);
    Storage.save(this.storageKey, AppState.changeOrders);
    this.renderList();
    this.form.reset();
    this.updateTotalDisplay();
    return true;
  },
  renderList() {
    if (!this.listBody) return;
    const orders = Array.isArray(AppState.changeOrders) ? AppState.changeOrders : [];
    this.listBody.innerHTML = orders.map((order, index) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.description}</td>
        <td>${order.reason}</td>
        <td>${Calculator.formatCurrency(order.totalChange)}</td>
        <td>${order.timelineChangeDays} day(s)</td>
        <td>${this.statusBadge(order.status)}</td>
        <td>
          <button type="button" class="btn btn-success btn-sm" data-approve-co="${index}">Approve</button>
          <button type="button" class="btn btn-danger btn-sm" data-reject-co="${index}">Reject</button>
        </td>
      </tr>`).join('');
    if (!orders.length) this.listBody.innerHTML = '<tr><td colspan="7">No change orders recorded.</td></tr>';
  },
  updateEstimateTotal(changeAmount) {
    if (!AppState.estimate) return;
    const totals = AppState.estimate.totals || AppState.estimate;
    totals.subtotal = App.safeNumber(totals.subtotal) + App.safeNumber(changeAmount);
    totals.total = App.safeNumber(totals.total) + App.safeNumber(changeAmount);
    AppState.estimate.total = totals.total;
    Storage.saveEstimate(AppState.estimate);
    if (window.Tab8) Tab8.render(AppState.estimate);
  },
  async onApprove(index) {
    const order = AppState.changeOrders[index];
    if (!order) return;
    try {
      await Api.approveChangeOrder(order.id);
    } catch (_error) {
      UI.showNotification('Approval saved locally; API sync pending.', 'warning');
    }
    order.status = 'Approved';
    this.updateEstimateTotal(order.totalChange);
    Storage.save(this.storageKey, AppState.changeOrders);
    this.renderList();
  },
  async onReject(index) {
    const order = AppState.changeOrders[index];
    if (!order) return;
    if (typeof Api.rejectChangeOrder === 'function') {
      try { await Api.rejectChangeOrder(order.id); } catch (_error) { /* local fallback */ }
    }
    order.status = 'Rejected';
    Storage.save(this.storageKey, AppState.changeOrders);
    this.renderList();
  },
  async load() {
    const projectId = ((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id || (AppState.currentProject || {}).projectId || '');
    if (projectId) {
      try {
        AppState.changeOrders = await Api.getChangeOrders(projectId);
      } catch (_error) {
        AppState.changeOrders = Storage.load(this.storageKey) || AppState.changeOrders || [];
      }
    } else {
      AppState.changeOrders = Storage.load(this.storageKey) || AppState.changeOrders || [];
    }
    this.renderList();
    this.updateTotalDisplay();
  },
  save() {
    Storage.save(this.storageKey, AppState.changeOrders || []);
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab12 = Tab12;
