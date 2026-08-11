// Admin tab
'use strict';

const Tab15 = {
  init() {
    this.statsGrid = document.getElementById('adminStatsGrid');
    this.userTable = document.getElementById('userManagementTable');
    this.initVisibility();
    this.bindEvents();
    if (!this.isHidden) this.load();
  },
  initVisibility() {
    const user = AppState.user;
    const isAdmin = !user || String(user.role || '').toLowerCase() === 'admin';
    const tab = document.getElementById('tab-15');
    const button = document.getElementById('tabBtn15');
    this.isHidden = !isAdmin;
    if (tab) tab.style.display = isAdmin ? '' : 'none';
    if (button) button.style.display = isAdmin ? '' : 'none';
  },
  bindEvents() {
    document.querySelectorAll('.report-btn').forEach((button) => {
      button.addEventListener('click', () => this.generateReport(button.dataset.report));
    });
  },
  statCards(stats) {
    return [
      { icon: '📁', label: 'Total Projects', value: stats.totalProjects || 0 },
      { icon: '💵', label: 'Revenue This Month', value: Calculator.formatCurrency(stats.revenueThisMonth || 0) },
      { icon: '📝', label: 'Pending Estimates', value: stats.pendingEstimates || 0 },
      { icon: '🚧', label: 'Active Projects', value: stats.activeProjects || 0 }
    ];
  },
  renderStatCards(stats) {
    if (!this.statsGrid) return;
    this.statsGrid.innerHTML = this.statCards(stats).map((card) => `
      <div class="stat-card">
        <span>${card.icon} ${card.label}</span>
        <strong>${card.value}</strong>
      </div>`).join('');
  },
  activeLabel(user) {
    if (user.active === false) return 'No';
    if (user.status) return user.status;
    return 'Yes';
  },
  rememberAdminSnapshot(stats, users) {
    Storage.save('admin-stats', stats || {});
    Storage.save('admin-users', users || []);
  },
  mergeSnapshot(stats, users) {
    this.rememberAdminSnapshot(stats, users);
    return { stats, users };
  },
  renderUserTable(users) {
    if (!this.userTable) return;
    this.userTable.innerHTML = `
      <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Last Login</th><th>Active</th></tr></thead>
      <tbody>${(users || []).map((user) => `
        <tr>
          <td>${user.username || user.name || 'Unknown'}</td>
          <td>${user.email || ''}</td>
          <td>${user.role || 'User'}</td>
          <td>${user.lastLogin ? formatDate(user.lastLogin) : '—'}</td>
          <td>${this.activeLabel(user)}</td>
        </tr>`).join('') || '<tr><td colspan="5">No users found.</td></tr>'}</tbody>`;
  },
  fallbackStats() {
    const cached = Storage.load('admin-stats');
    if (cached) return cached;
    const projects = App.safeNumber((Storage.loadProject() || {}).projectId ? 1 : 0);
    const total = App.safeNumber(((AppState.estimate || {}).totals || {}).total);
    return { totalProjects: projects, revenueThisMonth: total, pendingEstimates: total ? 1 : 0, activeProjects: projects };
  },
  fallbackUsers() {
    const cached = Storage.load('admin-users');
    if (cached) return cached;
    return [{ username: 'Local User', email: 'offline@example.com', role: (AppState.user || {}).role || 'Admin', lastLogin: new Date().toISOString(), active: true }];
  },
  async loadStats() {
    try {
      const stats = await Api.getStats();
      this.renderStatCards(stats || {});
      this.mergeSnapshot(stats || {}, this.fallbackUsers());
      return stats;
    } catch (_error) {
      const fallback = this.fallbackStats();
      this.renderStatCards(fallback);
      UI.showNotification('Unable to refresh admin stats.', 'warning');
      return fallback;
    }
  },
  async loadUsers() {
    try {
      const users = await Api.getUsers();
      this.renderUserTable(users || []);
      this.mergeSnapshot(this.fallbackStats(), users || []);
      return users;
    } catch (_error) {
      const fallback = this.fallbackUsers();
      this.renderUserTable(fallback);
      UI.showNotification('Unable to refresh users list.', 'warning');
      return fallback;
    }
  },
  downloadBlob(filename, text, type = 'application/json') {
    const blob = new Blob([text], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },
  exportCsv(filename, rows) {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    this.downloadBlob(filename, csv, 'text/csv');
  },
  async generateReport(type) {
    try {
      const result = await Api.generateReport(type);
      if (result && result.url) {
        window.open(result.url, '_blank');
        return true;
      }
      const payload = JSON.stringify(result || { type, generatedAt: new Date().toISOString() }, null, 2);
      this.downloadBlob(`${type}.json`, payload);
      return true;
    } catch (_error) {
      this.exportCsv(`${type}.csv`, [['report_type', 'generated_at', 'source'], [type, new Date().toISOString(), 'local-fallback']]);
      UI.showNotification('Report generated from fallback data.', 'warning');
      return true;
    }
  },
  async load() {
    if (this.isHidden) return false;
    await Promise.all([this.loadStats(), this.loadUsers()]);
    return true;
  },
  refresh() {
    return this.load();
  },
  save() {
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab15 = Tab15;
