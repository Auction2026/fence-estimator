/**
 * TAB 15 - Admin Dashboard
 * frontend/js/tabs/tab15-admin.js
 */

'use strict';

var Tab15Admin = (function () {

  function init() {
    refresh();
  }

  function refresh() {
    loadLocalStats();
    renderProjectList();
    loadSettings();
    bindEvents();
  }

  function loadLocalStats() {
    var projects = Storage.getAllProjects();
    UI.setText('admin-project-count', projects.length);

    var settings = Storage.loadSettings();
    UI.setText('admin-company-name', settings.company || 'Fence Depot');
    UI.setText('admin-version', FenceApp.version || '1.0.0');
    UI.setText('admin-storage-used', getStorageUsed() + ' KB');
  }

  function getStorageUsed() {
    var total = 0;
    try {
      for (var k in localStorage) {
        if (localStorage.hasOwnProperty(k) && k.startsWith('fe_')) {
          total += localStorage.getItem(k).length;
        }
      }
    } catch (e) {}
    return Math.round(total / 1024);
  }

  function renderProjectList() {
    var projects = Storage.getAllProjects();
    var tbody    = document.getElementById('admin-projects-tbody');
    if (!tbody) return;

    if (projects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:20px">No projects saved yet.</td></tr>';
      return;
    }

    tbody.innerHTML = projects.map(function (proj) {
      var estimate = (proj.estimate || {}).grandTotal || 0;
      return '<tr>' +
        '<td class="fw-bold">' + UI.escapeHtml(proj.id || '--') + '</td>' +
        '<td>' + UI.escapeHtml((proj.customer && proj.customer.name) || proj.name || 'Unnamed') + '</td>' +
        '<td>' + formatDate(proj.updatedAt || proj.createdAt) + '</td>' +
        '<td>' + (estimate ? formatCurrency(estimate) : '--') + '</td>' +
        '<td>' +
          '<button class="btn btn-sm btn-primary" onclick="Tab15Admin.loadProject(\'' + UI.escapeHtml(proj.id) + '\')">📂 Open</button> ' +
          '<button class="btn btn-sm btn-danger"  onclick="Tab15Admin.deleteProject(\'' + UI.escapeHtml(proj.id) + '\')">🗑</button>' +
        '</td>' +
        '</tr>';
    }).join('');
  }

  function loadSettings() {
    var settings = Storage.loadSettings();
    UI.populateForm('form-admin-settings', {
      admin_company:   settings.company || '',
      admin_phone:     settings.phone   || '',
      admin_email:     settings.email   || '',
      admin_license:   settings.license || '',
      admin_tax_rate:  settings.taxRate || 8,
      admin_markup:    settings.markup  || 30,
    });
  }

  function bindEvents() {
    var btnSaveSettings = document.getElementById('btn-save-admin-settings');
    if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettings);

    var btnClearAll = document.getElementById('btn-clear-all-data');
    if (btnClearAll) btnClearAll.addEventListener('click', clearAllData);

    var btnExportAll = document.getElementById('btn-export-all');
    if (btnExportAll) btnExportAll.addEventListener('click', exportAllProjects);

    var btnImport = document.getElementById('btn-import-project');
    if (btnImport) btnImport.addEventListener('click', function () {
      document.getElementById('import-file-input').click();
    });

    var fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];
      if (file) {
        Storage.importProjectJSON(file).then(function (proj) {
          UI.showToast('Project imported: ' + proj.id, 'success');
          renderProjectList();
        }).catch(function () {
          UI.showToast('Import failed - invalid file', 'error');
        });
        fileInput.value = '';
      }
    });
  }

  function loadProject(id) {
    var proj = Storage.loadProject(id);
    if (!proj) { UI.showToast('Project not found', 'error'); return; }
    FenceApp.project = proj;
    FenceApp.currentProject = id;
    Storage.saveSession();
    switchTab(1);
    UI.showToast('Opened: ' + id, 'success');
  }

  function deleteProject(id) {
    if (!window.confirm('Delete project ' + id + '? This cannot be undone.')) return;
    Storage.deleteProject(id);
    renderProjectList();
    UI.showToast('Project deleted', 'info');
  }

  function saveSettings() {
    var data = UI.getFormData('form-admin-settings');
    var settings = {
      company:  data.admin_company,
      phone:    data.admin_phone,
      email:    data.admin_email,
      license:  data.admin_license,
      taxRate:  parseFloat(data.admin_tax_rate) || 8,
      markup:   parseFloat(data.admin_markup)   || 30,
    };
    Storage.saveSettings(settings);
    Calculations.TAX_RATES.materials = settings.taxRate / 100;
    Calculations.MARKUP              = settings.markup  / 100;
    UI.showToast('Settings saved ✓', 'success');
  }

  function clearAllData() {
    if (!window.confirm('Delete ALL saved data? This cannot be undone.')) return;
    Storage.clearAll();
    renderProjectList();
    UI.showToast('All data cleared', 'warning');
  }

  function exportAllProjects() {
    var projects = Storage.getAllProjects();
    var blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = 'fence-estimator-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return { init, refresh, loadProject, deleteProject };

})();

window.Tab15Admin = Tab15Admin;
