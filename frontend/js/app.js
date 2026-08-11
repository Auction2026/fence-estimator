/**
 * app.js – Main application initialization for Fence Estimator Pro
 * Loads after all other scripts
 */

(function () {
  'use strict';

  // ── App state ─────────────────────────────────────────────────
  const AppState = {
    currentTab: 'tab1',
    project: null,
    specs: null,
    estimate: null,
    contract: null,
    user: null,
    notes: [],
    tasks: [],
    crew: [],
    extras: [],
    changeOrders: [],
    isAdmin: false
  };

  // ── Initialize ────────────────────────────────────────────────
  function init() {
    console.log('🏗️ Fence Estimator Pro – Loading...');

    // Load saved data
    loadPersistedData();

    // Setup tab navigation
    setupTabs();

    // Setup global event listeners
    setupGlobalEvents();

    // Setup auto-save
    Storage.startAutoSave(autoSave);

    // Check for saved user session
    checkSession();

    // Initialize all tab modules
    initTabModules();

    // Set default date
    const dateEl = document.getElementById('estimate-date');
    if (dateEl && !dateEl.value) dateEl.value = UI.todayISO();

    // Setup validation
    Validation.setupProjectValidation();

    console.log('✅ Fence Estimator Pro – Ready!');
    UI.showNotification('Fence Estimator Pro loaded', 'success', 2000);
  }

  // ── Load persisted data ────────────────────────────────────────
  function loadPersistedData() {
    AppState.project      = Storage.loadProject();
    AppState.specs        = Storage.loadSpecs();
    AppState.estimate     = Storage.loadEstimate();
    AppState.contract     = Storage.loadContract();
    AppState.notes        = Storage.loadNotes();
    AppState.tasks        = Storage.loadTasks();
    AppState.crew         = Storage.loadCrew();
    AppState.extras       = Storage.loadExtras();
    AppState.changeOrders = Storage.loadChangeOrders();
    AppState.user         = Storage.loadUser();
  }

  // ── Tab navigation ─────────────────────────────────────────────
  function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        switchToTab(tabId);
      });
    });
  }

  function switchToTab(tabId) {
    AppState.currentTab = tabId;
    UI.activateTab(tabId);
    Storage.set('last_tab', tabId);

    // Fire tab-specific load events
    const event = new CustomEvent('tabActivated', { detail: { tabId } });
    document.dispatchEvent(event);
  }

  // ── Global events ──────────────────────────────────────────────
  function setupGlobalEvents() {
    // New project button
    const btnNew = document.getElementById('btn-new-project');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        if (UI.confirm('Start a new project? Unsaved changes will be lost.')) {
          resetProject();
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', async () => {
        await API.logout();
        AppState.user = null;
        updateUserDisplay();
        UI.showNotification('Logged out successfully', 'info');
      });
    }

    // Open project (placeholder)
    const btnOpen = document.getElementById('btn-open-project');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        UI.showNotification('Connect to backend to load saved projects', 'info');
      });
    }

    // Navigate to last tab
    const lastTab = Storage.get('last_tab');
    if (lastTab) switchToTab(lastTab);
  }

  // ── Session check ──────────────────────────────────────────────
  function checkSession() {
    AppState.user = Storage.loadUser();
    AppState.isAdmin = AppState.user && AppState.user.role === 'admin';
    updateUserDisplay();

    // If no user, show demo mode
    if (!AppState.user) {
      UI.setText('user-badge', 'Demo Mode');
    }
  }

  function updateUserDisplay() {
    const user = AppState.user;
    const badgeEl = document.getElementById('user-badge');
    if (badgeEl) {
      badgeEl.textContent = user ? `👤 ${user.username}` : 'Not Logged In';
    }

    // Show/hide admin tab
    const adminBtn = document.querySelector('[data-tab="tab15"]');
    if (adminBtn) {
      adminBtn.style.display = (!user || user.role === 'admin') ? '' : 'none';
    }
  }

  // ── Reset project ──────────────────────────────────────────────
  function resetProject() {
    Storage.clear();
    AppState.project = {};
    AppState.specs = {};
    AppState.estimate = {};
    AppState.contract = {};
    AppState.notes = [];
    AppState.tasks = [];
    AppState.crew = [];
    AppState.extras = [];
    AppState.changeOrders = [];

    UI.clearForm('form-project');
    UI.clearForm('form-specs');
    UI.setText('current-project-label', 'No Project Open');
    UI.showNotification('New project started', 'success');
    switchToTab('tab1');
  }

  // ── Auto-save ──────────────────────────────────────────────────
  function autoSave() {
    // Collect current form data and save
    const projectData = UI.getFormData('form-project');
    if (Object.keys(projectData).length > 0) {
      Storage.saveProject({ ...AppState.project, ...projectData });
    }
    const specsData = UI.getFormData('form-specs');
    if (Object.keys(specsData).length > 0) {
      Storage.saveSpecs({ ...AppState.specs, ...specsData });
    }
    console.log('💾 Auto-saved at', new Date().toLocaleTimeString());
  }

  // ── Initialize tab modules ─────────────────────────────────────
  function initTabModules() {
    // Each tab module self-initializes; dispatch ready event
    const modules = [
      'Tab1Project', 'Tab2Specs', 'Tab3Layout', 'Tab4Installation',
      'Tab5Drawings', 'Tab6Permits', 'Tab7Utilities', 'Tab8Estimate',
      'Tab9Contract', 'Tab10Extras', 'Tab11Crew', 'Tab12ChangeOrder',
      'Tab13SignOff', 'Tab14Notes', 'Tab15Admin', 'Tab16Catalog',
      'Tab17Mapping'
    ];

    modules.forEach(mod => {
      if (window[mod] && typeof window[mod].init === 'function') {
        try {
          window[mod].init(AppState);
        } catch (e) {
          console.warn(`Failed to init ${mod}:`, e);
        }
      }
    });
  }

  // ── Expose global API ──────────────────────────────────────────
  window.App = {
    state: AppState,
    switchToTab,
    resetProject,
    autoSave
  };

  // ── Kickoff ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
