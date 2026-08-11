/**
 * tab15-admin.js – Admin Dashboard tab
 */
const Tab15Admin = (() => {
  function init() {
    document.addEventListener('tabActivated', (e) => {
      if (e.detail.tabId === 'tab15') loadStats();
    });
    const form = document.getElementById('form-settings');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
          companyName: UI.getValue('set-company-name'),
          taxRate: parseFloat(UI.getValue('set-tax-rate')) || 13,
          labourRate: parseFloat(UI.getValue('set-labour-rate')) || 65,
          mapsKey: UI.getValue('set-maps-key')
        };
        Storage.saveSettings(settings);
        UI.showNotification('Settings saved', 'success');
      });
      const saved = Storage.loadSettings();
      UI.setValue('set-company-name', saved.companyName || 'Fence Depot');
      UI.setValue('set-tax-rate', saved.taxRate || 13);
      UI.setValue('set-labour-rate', saved.labourRate || 65);
      UI.setValue('set-maps-key', saved.mapsKey || '');
    }
    setupReportButtons();
  }

  function loadStats() {
    // Load from local storage as offline fallback
    const proj = Storage.loadProject();
    const est  = Storage.loadEstimate();
    const cos  = Storage.loadChangeOrders();

    UI.setText('stat-projects', proj.customerName ? '1' : '0');
    UI.setText('stat-estimates', est.estimateNumber ? '1' : '0');
    UI.setText('stat-contracts', Storage.loadContract().contractNumber ? '1' : '0');
    UI.setText('stat-revenue', est.total ? Calculations.formatCurrency(est.total) : '$0');

    // Try backend
    API.Admin.getStats().then(data => {
      if (data) {
        UI.setText('stat-projects', data.projects || 0);
        UI.setText('stat-estimates', data.estimates || 0);
        UI.setText('stat-contracts', data.contracts || 0);
        UI.setText('stat-revenue', Calculations.formatCurrency(data.revenue || 0));
      }
      loadUsers();
    }).catch(() => {});
  }

  function loadUsers() {
    API.Admin.getUsers().then(users => {
      if (!Array.isArray(users)) return;
      const tbody = document.getElementById('users-tbody');
      if (!tbody) return;
      if (users.length === 0) { UI.setTableEmpty('users-tbody', 'No users found', 5); return; }
      tbody.innerHTML = '';
      users.forEach(u => {
        UI.appendRow('users-tbody', [
          u.username, u.email, u.role,
          UI.formatDate(u.created_at),
          `<button class="btn btn-sm btn-danger" onclick="Tab15Admin.deleteUser('${u.id}')">Delete</button>`
        ]);
      });
    }).catch(() => {
      UI.setTableEmpty('users-tbody', 'Backend not connected – offline mode', 5);
    });
  }

  function setupReportButtons() {
    document.getElementById('btn-report-monthly')?.addEventListener('click', () => {
      UI.showNotification('Monthly report: connect to backend for data', 'info');
    });
    document.getElementById('btn-report-projects')?.addEventListener('click', () => {
      UI.showNotification('Projects report: connect to backend for data', 'info');
    });
    document.getElementById('btn-report-inventory')?.addEventListener('click', () => {
      UI.showNotification('Inventory report: connect to backend for data', 'info');
    });
    document.getElementById('btn-report-crew')?.addEventListener('click', () => {
      UI.showNotification('Crew report: connect to backend for data', 'info');
    });
    document.getElementById('btn-add-user')?.addEventListener('click', () => {
      UI.showNotification('User management: connect to backend', 'info');
    });
  }

  function deleteUser(id) {
    if (!UI.confirm('Delete this user?')) return;
    API.Admin.deleteUser(id).then(() => {
      UI.showNotification('User deleted', 'success');
      loadUsers();
    }).catch(err => UI.showNotification('Error: ' + err.message, 'error'));
  }

  return { init, deleteUser };
})();
