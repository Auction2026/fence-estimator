// Installation breakdown tab
'use strict';

const Tab4 = {
  storageKey: 'installation-tasks',
  laborRate: 75,
  init() {
    this.body = document.getElementById('installationTableBody');
    this.addButton = document.getElementById('addInstallationRowBtn');
    this.saveButton = document.getElementById('saveInstallationBtn');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    if (this.addButton) this.addButton.addEventListener('click', () => this.addTask());
    if (this.saveButton) this.saveButton.addEventListener('click', () => this.save(true));
    if (!this.body) return;
    this.body.addEventListener('click', (event) => {
      const button = event.target.closest('[data-delete-task]');
      if (!button) return;
      this.removeTask(Number(button.dataset.deleteTask));
    });
    this.body.addEventListener('input', () => {
      this.syncFromDom();
      this.renderTotals();
      this.save(false);
    });
  },
  defaultTask() {
    return {
      taskName: '',
      startDate: '',
      endDate: '',
      laborHours: 8,
      workers: 2,
      unitCost: this.laborRate
    };
  },
  addTask(task = {}) {
    AppState.installationTasks = Array.isArray(AppState.installationTasks) ? AppState.installationTasks : [];
    AppState.installationTasks.push(Object.assign(this.defaultTask(), task));
    this.renderTable();
    this.save(false);
  },
  removeTask(index) {
    AppState.installationTasks.splice(index, 1);
    this.renderTable();
    this.save(false);
  },
  calculateTaskCost(task) {
    return App.safeNumber(task.laborHours) * App.safeNumber(task.workers) * this.laborRate;
  },
  syncFromDom() {
    if (!this.body) return;
    AppState.installationTasks = Array.from(this.body.querySelectorAll('tr')).map((row) => ({
      taskName: row.querySelector('[data-field="taskName"]').value,
      startDate: row.querySelector('[data-field="startDate"]').value,
      endDate: row.querySelector('[data-field="endDate"]').value,
      laborHours: App.safeNumber(row.querySelector('[data-field="laborHours"]').value),
      workers: App.safeNumber(row.querySelector('[data-field="workers"]').value),
      unitCost: App.safeNumber(row.querySelector('[data-field="unitCost"]').value) || this.laborRate
    }));
  },
  renderTable() {
    if (!this.body) return;
    const tasks = Array.isArray(AppState.installationTasks) ? AppState.installationTasks : [];
    this.body.innerHTML = tasks.map((task, index) => {
      const total = this.calculateTaskCost(task);
      return `
        <tr>
          <td><input class="form-control" data-field="taskName" value="${task.taskName || ''}"></td>
          <td><input class="form-control" data-field="startDate" type="date" value="${task.startDate || ''}"></td>
          <td><input class="form-control" data-field="endDate" type="date" value="${task.endDate || ''}"></td>
          <td><input class="form-control" data-field="laborHours" type="number" min="0" step="0.25" value="${App.safeNumber(task.laborHours)}"></td>
          <td><input class="form-control" data-field="workers" type="number" min="1" step="1" value="${Math.max(1, App.safeNumber(task.workers) || 1)}"></td>
          <td>
            <input class="form-control mb-1" data-field="unitCost" type="number" min="0" step="0.01" value="${App.safeNumber(task.unitCost) || this.laborRate}">
            <div class="small-text">Line total: ${Calculator.formatCurrency(total)}</div>
          </td>
          <td><button type="button" class="btn btn-danger btn-sm" data-delete-task="${index}">Delete</button></td>
        </tr>`;
    }).join('');
    this.renderTotals();
  },
  renderTotals() {
    const tasks = Array.isArray(AppState.installationTasks) ? AppState.installationTasks : [];
    const hours = tasks.reduce((sum, task) => sum + App.safeNumber(task.laborHours), 0);
    const workers = tasks.reduce((sum, task) => sum + App.safeNumber(task.workers), 0);
    const totalCost = tasks.reduce((sum, task) => sum + this.calculateTaskCost(task), 0);
    const hoursNode = document.getElementById('installationTotalHours');
    const workersNode = document.getElementById('installationTotalWorkers');
    const costNode = document.getElementById('installationTotalCost');
    if (hoursNode) hoursNode.textContent = String(hours.toFixed(2)).replace(/\.00$/, '');
    if (workersNode) workersNode.textContent = String(workers);
    if (costNode) costNode.textContent = Calculator.formatCurrency(totalCost);
  },
  load() {
    const stored = Storage.load(this.storageKey) || AppState.installationTasks || [];
    AppState.installationTasks = Array.isArray(stored) ? stored : [];
    if (!AppState.installationTasks.length) AppState.installationTasks = [this.defaultTask()];
    this.renderTable();
  },
  async save(showToast = true) {
    this.syncFromDom();
    Storage.save(this.storageKey, AppState.installationTasks);
    const projectId = ((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id || (AppState.currentProject || {}).projectId || '');
    if (projectId) {
      try {
        await Api.updateProject(projectId, { installationTasks: AppState.installationTasks });
      } catch (_error) {
        if (showToast) UI.showNotification('Installation plan saved locally.', 'warning');
        return true;
      }
    }
    if (showToast) UI.showNotification('Installation plan saved.', 'success');
    return true;
  },
  validate() {
    return Array.isArray(AppState.installationTasks);
  }
};

window.Tab4 = Tab4;
