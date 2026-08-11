// Extras tab
'use strict';

const Tab10 = {
  storageKey: 'extra-items',
  init() {
    this.body = document.getElementById('extrasTableBody');
    this.totalNode = document.getElementById('extrasGrandTotal');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    const addButton = document.getElementById('addExtraBtn');
    const updateButton = document.getElementById('updateEstimateWithExtrasBtn');
    if (addButton) addButton.addEventListener('click', () => this.addExtra());
    if (updateButton) updateButton.addEventListener('click', () => this.updateEstimate());
    if (!this.body) return;
    this.body.addEventListener('click', (event) => {
      const button = event.target.closest('[data-delete-extra]');
      if (button) this.deleteExtra(Number(button.dataset.deleteExtra));
    });
    this.body.addEventListener('input', App.debounce(() => {
      this.syncFromDom();
      this.renderTable();
      this.save(false);
    }, 150));
  },
  blankItem() {
    return { description: '', quantity: 1, unitCost: 0 };
  },
  normalizeItems(items) {
    return (items || []).map((item) => Object.assign(this.blankItem(), item));
  },
  hasItems() {
    return Array.isArray(AppState.extraItems) && AppState.extraItems.length > 0;
  },
  addExtra(item = {}) {
    AppState.extraItems = this.normalizeItems(AppState.extraItems);
    AppState.extraItems.push(Object.assign(this.blankItem(), item));
    this.renderTable();
    this.save(false);
  },
  deleteExtra(index) {
    AppState.extraItems.splice(index, 1);
    this.renderTable();
    this.save(false);
  },
  syncFromDom() {
    if (!this.body) return;
    AppState.extraItems = Array.from(this.body.querySelectorAll('tr[data-extra-row]')).map((row) => ({
      description: row.querySelector('[data-field="description"]').value,
      quantity: App.safeNumber(row.querySelector('[data-field="quantity"]').value),
      unitCost: App.safeNumber(row.querySelector('[data-field="unitCost"]').value)
    }));
  },
  lineTotal(item) {
    return App.safeNumber(item.quantity) * App.safeNumber(item.unitCost);
  },
  calculateTotal() {
    return (AppState.extraItems || []).reduce((sum, item) => sum + this.lineTotal(item), 0);
  },
  renderEmptyState() {
    if (this.body) this.body.innerHTML = '<tr><td colspan="5">No extras added.</td></tr>';
  },
  renderSummary() {
    if (this.totalNode) this.totalNode.textContent = Calculator.formatCurrency(this.calculateTotal());
  },
  renderTable() {
    if (!this.body) return;
    const items = this.normalizeItems(AppState.extraItems);
    AppState.extraItems = items;
    if (!this.hasItems()) {
      this.renderEmptyState();
    } else {
      this.body.innerHTML = items.map((item, index) => `
        <tr data-extra-row="${index}">
          <td><input class="form-control" data-field="description" value="${item.description || ''}"></td>
          <td><input class="form-control" data-field="quantity" type="number" min="0" step="1" value="${App.safeNumber(item.quantity) || 0}"></td>
          <td><input class="form-control" data-field="unitCost" type="number" min="0" step="0.01" value="${App.safeNumber(item.unitCost) || 0}"></td>
          <td>${Calculator.formatCurrency(this.lineTotal(item))}</td>
          <td><button type="button" class="btn btn-danger btn-sm" data-delete-extra="${index}">Delete</button></td>
        </tr>`).join('');
    }
    this.renderSummary();
  },
  updateEstimate() {
    const extrasTotal = this.calculateTotal();
    if (!AppState.estimate) {
      UI.showNotification('Calculate base estimate first.', 'warning');
      return false;
    }
    AppState.estimate.totals = Calculator.calculateTotal(
      AppState.estimate.materials,
      AppState.estimate.labor,
      AppState.estimate.equipment,
      AppState.estimate.concrete,
      (((AppState.permit || {}).permitCost) || 0),
      extrasTotal
    );
    AppState.estimate.total = AppState.estimate.totals.total;
    Storage.saveEstimate(AppState.estimate);
    if (window.Tab8) Tab8.render(AppState.estimate);
    UI.showNotification('Estimate updated with extras.', 'success');
    return true;
  },
  load() {
    const items = Storage.load(this.storageKey) || AppState.extraItems || [];
    AppState.extraItems = this.normalizeItems(items);
    if (!this.hasItems()) AppState.extraItems = [];
    this.renderTable();
  },
  save(showToast = true) {
    Storage.save(this.storageKey, this.normalizeItems(AppState.extraItems));
    if (showToast) UI.showNotification('Extras saved.', 'success');
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab10 = Tab10;
