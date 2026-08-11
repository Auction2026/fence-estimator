// Extras tab
'use strict';

const Tab10 = {
  init() { this.body = document.getElementById('extrasTableBody'); this.bindEvents(); this.load(); this.updateTotals(); },
  bindEvents() {
    const addButton = document.getElementById('addExtraBtn'); const updateButton = document.getElementById('updateEstimateWithExtrasBtn');
    if (addButton) addButton.addEventListener('click', () => this.addRow()); if (updateButton) updateButton.addEventListener('click', () => this.applyToEstimate());
    if (this.body) { this.body.addEventListener('click', (event) => { if (event.target.matches('.remove-extra-btn')) { event.target.closest('tr').remove(); this.updateTotals(); } }); this.body.addEventListener('input', () => this.updateTotals()); }
  },
  addRow(data = {}) { if (!this.body) return; const row = document.createElement('tr'); row.innerHTML = `<td><input class="form-control" data-key="description" type="text" value="${data.description || ''}"></td><td><input class="form-control extra-qty" data-key="qty" type="number" min="0" value="${data.qty || 0}"></td><td><input class="form-control extra-unit" data-key="unitCost" type="number" step="0.01" min="0" value="${data.unitCost || 0}"></td><td class="extra-total-cell">${formatCurrency((data.qty || 0) * (data.unitCost || 0))}</td><td><button type="button" class="btn btn-danger btn-sm remove-extra-btn">Remove</button></td>`; this.body.appendChild(row); },
  updateTotals() { const rows = Array.from(this.body ? this.body.querySelectorAll('tr') : []); let total = 0; rows.forEach((row) => { const qty = App.safeNumber(row.querySelector('.extra-qty') && row.querySelector('.extra-qty').value); const unitCost = App.safeNumber(row.querySelector('.extra-unit') && row.querySelector('.extra-unit').value); const lineTotal = qty * unitCost; total += lineTotal; const cell = row.querySelector('.extra-total-cell'); if (cell) cell.textContent = formatCurrency(lineTotal); }); const grandTotal = document.getElementById('extrasGrandTotal'); if (grandTotal) grandTotal.textContent = formatCurrency(total); },
  applyToEstimate() { this.save(); if (AppState.estimate && AppState.estimate.specs) { const extrasTotal = App.safeNumber(document.getElementById('extrasGrandTotal').textContent.replace(/[^\d.-]/g, '')); App.setEstimate(Calculator.generateBreakdown(Object.assign({}, AppState.estimate.specs, { permitCost: AppState.estimate.totals ? AppState.estimate.totals.permits : 0, extrasTotal }))); syncEstimateToContract(); } showNotification('Extras applied to estimate.', 'success'); },
  load() { const data = Storage.load('extras-items') || []; if (data.length && this.body) { this.body.innerHTML = ''; data.forEach((item) => this.addRow(item)); } },
  save() { AppState.extraItems = App.serializeTable('extrasTableBody'); Storage.save('extras-items', AppState.extraItems); this.updateTotals(); return true; },
  validate() { return true; }
};
window.Tab10 = Tab10;
