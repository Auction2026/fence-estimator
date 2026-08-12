/**
 * FENCE DEPOT ESTIMATOR - App Initialization
 * frontend/js/app.js
 */

'use strict';

// ============================================================
// APPLICATION STATE
// ============================================================
window.FenceApp = {
  version: '1.0.0',
  currentTab: 1,
  currentProject: null,
  isLoggedIn: false,
  user: null,

  // Project data model
  project: {
    id: null,
    customer: {},
    specs: {},
    layout: null,
    installation: {},
    permits: {},
    utilities: {},
    estimate: {},
    contract: {},
    extras: [],
    crew: [],
    changeOrders: [],
    signoff: {},
    notes: [],
  },
};

// ============================================================
// DOCUMENT READY
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  initApp();
});

function initApp() {
  console.log('🌿 Fence Depot Estimator v' + FenceApp.version + ' initializing...');

  // Load session data
  Storage.loadSession();

  // Set up tab navigation
  initTabs();

  // Set up global event listeners
  initGlobalEvents();

  // Check login state
  checkLoginState();

  // Auto-save every 60 seconds
  setInterval(function () {
    if (FenceApp.currentProject) {
      Storage.autoSave();
    }
  }, 60000);

  console.log('✅ App initialized');
}

// ============================================================
// TAB SYSTEM
// ============================================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tabNum = parseInt(btn.dataset.tab, 10);
      switchTab(tabNum);
    });
  });
}

function switchTab(tabNum) {
  // Hide all panels
  document.querySelectorAll('.tab-content').forEach(function (panel) {
    panel.classList.remove('active');
  });

  // Deactivate all buttons
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });

  // Show selected panel
  const panel = document.getElementById('tab-' + tabNum);
  if (panel) panel.classList.add('active');

  // Activate button
  const btn = document.querySelector('.tab-btn[data-tab="' + tabNum + '"]');
  if (btn) btn.classList.add('active');

  FenceApp.currentTab = tabNum;

  // Trigger tab-specific init if needed
  triggerTabInit(tabNum);

  // Scroll tabs button into view
  if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function triggerTabInit(tabNum) {
  switch (tabNum) {
    case 3:  if (typeof Tab3Layout !== 'undefined')   Tab3Layout.init();   break;
    case 8:  if (typeof Tab8Estimate !== 'undefined') Tab8Estimate.refresh(); break;
    case 15: if (typeof Tab15Admin !== 'undefined')   Tab15Admin.refresh();  break;
    case 17: if (typeof MappingTool !== 'undefined')  MappingTool.init();    break;
  }
}

// ============================================================
// GLOBAL EVENT LISTENERS
// ============================================================
function initGlobalEvents() {
  // Close modals on overlay click
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
      UI.closeAllModals();
    }
  });

  // Escape key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') UI.closeAllModals();
  });

  // New project button
  var btnNew = document.getElementById('btn-new-project');
  if (btnNew) btnNew.addEventListener('click', newProject);

  // Save project button
  var btnSave = document.getElementById('btn-save-project');
  if (btnSave) btnSave.addEventListener('click', saveProject);

  // Print button
  var btnPrint = document.getElementById('btn-print');
  if (btnPrint) btnPrint.addEventListener('click', PrintTool.printEstimate);

  // Export PDF button
  var btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) btnPdf.addEventListener('click', ExportTool.exportPDF);
}

// ============================================================
// PROJECT MANAGEMENT
// ============================================================
function newProject() {
  if (FenceApp.currentProject && !confirm('Start a new project? Unsaved changes will be lost.')) return;

  FenceApp.project = {
    id: generateId(),
    customer: {},
    specs: {},
    layout: null,
    installation: {},
    permits: {},
    utilities: {},
    estimate: {},
    contract: {},
    extras: [],
    crew: [],
    changeOrders: [],
    signoff: {},
    notes: [],
    createdAt: new Date().toISOString(),
  };
  FenceApp.currentProject = FenceApp.project.id;

  // Clear all forms
  UI.clearAllForms();
  switchTab(1);
  UI.showToast('New project started', 'success');
}

function saveProject() {
  Storage.saveProject(FenceApp.project);
  UI.showToast('Project saved ✓', 'success');
}

// ============================================================
// AUTH
// ============================================================
function checkLoginState() {
  var token = localStorage.getItem('fe_token');
  if (token) {
    FenceApp.isLoggedIn = true;
    var userData = localStorage.getItem('fe_user');
    if (userData) FenceApp.user = JSON.parse(userData);
    updateHeaderUser();
  }
}

function updateHeaderUser() {
  var el = document.getElementById('header-user');
  if (el && FenceApp.user) el.textContent = FenceApp.user.name || FenceApp.user.username || 'User';
}

// ============================================================
// UTILITIES
// ============================================================
function generateId() {
  return 'PRJ-' + Date.now().toString(36).toUpperCase();
}

function formatCurrency(amount) {
  return '$' + parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString('en-US');
}

// Expose globally
window.switchTab = switchTab;
window.newProject = newProject;
window.saveProject = saveProject;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.generateId = generateId;
