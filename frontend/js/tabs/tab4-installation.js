// Installation tab
'use strict';

const Tab4 = {
  init() { this.body = document.getElementById('installationTableBody'); this.bindEvents(); this.load(); },
  bindEvents() {
    const addButton = document.getElementById('addInstallationRowBtn'); if (addButton) addButton.addEventListener('click', () => this.addRow());
    if (this.body) { this.body.addEventListener('click', (event) => { if (event.target.matches('.remove-installation-row')) { event.target.closest('tr').remove(); this.updateTotals(); } }); this.body.addEventListener('input', () => this.updateTotals()); }
    const saveButton = document.getElementById('saveInstallationBtn'); if (saveButton) saveButton.addEventListener('click', () => this.save());
  },
  addRow(data = {}) {
    if (!this.body) return;
    const row = document.createElement('tr');
    row.innerHTML = `<td><input class="form-control" data-key="task" type="text" value="${data.task || ''}"></td><td><input class="form-control" data-key="startDate" type="date" value="${data.startDate || ''}"></td><td><input class="form-control" data-key="endDate" type="date" value="${data.endDate || ''}"></td><td><input class="form-control installation-hours" data-key="laborHours" type="number" min="0" value="${data.laborHours || 0}"></td><td><input class="form-control installation-workers" data-key="workers" type="number" min="1" value="${data.workers || 1}"></td><td><input class="form-control installation-cost" data-key="cost" type="number" min="0" step="0.01" value="${data.cost || 0}"></td><td><button type="button" class="btn btn-danger btn-sm remove-installation-row">Remove</button></td>`;
    this.body.appendChild(row); this.updateTotals();
  },
  updateTotals() { const rows = Array.from(this.body ? this.body.querySelectorAll('tr') : []); const totalHours = rows.reduce((sum, row) => sum + App.safeNumber(row.querySelector('.installation-hours') && row.querySelector('.installation-hours').value), 0); const totalWorkers = rows.reduce((sum, row) => sum + App.safeNumber(row.querySelector('.installation-workers') && row.querySelector('.installation-workers').value), 0); const totalCost = rows.reduce((sum, row) => sum + App.safeNumber(row.querySelector('.installation-cost') && row.querySelector('.installation-cost').value), 0); const hoursNode = document.getElementById('installationTotalHours'); const workersNode = document.getElementById('installationTotalWorkers'); const costNode = document.getElementById('installationTotalCost'); if (hoursNode) hoursNode.textContent = String(totalHours); if (workersNode) workersNode.textContent = String(totalWorkers); if (costNode) costNode.textContent = formatCurrency(totalCost); },
  load() { const tasks = Storage.load('installation-tasks'); if (tasks && this.body) { this.body.innerHTML = ''; tasks.forEach((task) => this.addRow(task)); } this.updateTotals(); },
  save() { AppState.installationTasks = App.serializeTable('installationTableBody'); Storage.save('installation-tasks', AppState.installationTasks); this.updateTotals(); showNotification('Installation plan saved.', 'success'); return true; },
  validate() { return true; }
};
window.Tab4 = Tab4;
