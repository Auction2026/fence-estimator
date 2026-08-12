/**
 * FENCE DEPOT ESTIMATOR - Main Application Controller
 * app.js — initializes the app, manages view state, wires up events
 */

'use strict';

// ============================================================
// APP CONFIGURATION
// ============================================================
const AppConfig = {
  name:    'Fence Depot Estimator',
  version: '1.0.0',
  api: {
    baseUrl: window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api'
      : '/api',
    timeout: 30000,
  },
  estimatePrefix: 'FDE',
  taxRate: 0.05,          // GST/HST 5 %
  currency: 'CAD',
  currencySymbol: '$',
};

// ============================================================
// APPLICATION STATE
// ============================================================
const AppState = {
  currentView:   'landing',   // landing | app
  currentTab:    'dashboard',
  isLoggedIn:    false,
  user:          null,
  currentProject: null,
  currentEstimate: null,
  toastTimer:    null,
};

// ============================================================
// INITIALISE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log(`${AppConfig.name} v${AppConfig.version} — starting`);

  // Restore session from localStorage
  const saved = Storage.getSession();
  if (saved && saved.user) {
    AppState.isLoggedIn = true;
    AppState.user = saved.user;
    showApp();
  } else {
    showLanding();
  }

  // Wire up global event listeners
  bindGlobalEvents();

  // Initialize sub-modules
  UI.init();
  Validation.init();
  Calculations.init();
});

// ============================================================
// VIEW SWITCHING
// ============================================================
function showLanding() {
  AppState.currentView = 'landing';
  document.getElementById('landingPage').style.display = 'flex';
  document.getElementById('appPage').style.display    = 'none';
}

function showApp() {
  AppState.currentView = 'app';
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('appPage').style.display    = 'flex';
  switchTab(AppState.currentTab);
  updateUserPanel();
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show requested tab
  const tabEl  = document.getElementById(tabName + '-tab');
  const navEl  = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  if (tabEl) tabEl.classList.add('active');
  if (navEl) navEl.classList.add('active');

  AppState.currentTab = tabName;
  console.log(`Switched to tab: ${tabName}`);
}

// ============================================================
// USER PANEL
// ============================================================
function updateUserPanel() {
  const u = AppState.user;
  if (!u) return;
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  if (nameEl) nameEl.textContent = u.name || u.username || 'Estimator';
  if (roleEl) roleEl.textContent = u.role  || 'Staff';
}

// ============================================================
// AUTH HELPERS
// ============================================================
function handleLogin(userData) {
  AppState.isLoggedIn = true;
  AppState.user = userData;
  Storage.saveSession({ user: userData });
  showApp();
  UI.showToast(`Welcome back, ${userData.name || userData.username}! 👋`, 'success');
}

function handleLogout() {
  AppState.isLoggedIn = false;
  AppState.user = null;
  Storage.clearSession();
  showLanding();
  UI.showToast('You have been signed out.', 'info');
}

// ============================================================
// GLOBAL EVENT BINDING
// ============================================================
function bindGlobalEvents() {
  // Nav items
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Landing "Start" button
  // NOTE: Demo mode — shows a simple credential prompt.
  // In production: replace with a proper login form / auth flow
  // and remove or gate this demo bypass behind a feature flag.
  const startBtn = document.getElementById('btnGetStarted');
  if (startBtn) startBtn.addEventListener('click', () => {
    const username = window.prompt('Username (demo: press OK to continue):');
    if (username === null) return; // cancelled
    handleLogin({ name: username || 'Demo User', role: 'estimator' });
  });

  // Logout button
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) UI.closeModal(overlay.id);
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(o => {
        UI.closeModal(o.id);
      });
    }
  });
}

// ============================================================
// UTILITY — number formatting
// ============================================================
function formatCurrency(amount) {
  return AppConfig.currencySymbol + Number(amount || 0).toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(n, decimals = 0) {
  return Number(n || 0).toLocaleString('en-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function generateId(prefix = 'FDE') {
  const year = new Date().getFullYear();
  const seq  = Storage.nextEstimateSeq();
  return `${prefix}-${year}-${String(seq).padStart(4, '0')}`;
}

// Expose to global scope for inline HTML handlers
window.switchTab      = switchTab;
window.handleLogout   = handleLogout;
window.formatCurrency = formatCurrency;
window.formatNumber   = formatNumber;
window.generateId     = generateId;
