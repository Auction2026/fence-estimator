
(function () {
  const App = {
    initialized: false,
    state: { activeTab: 'tab1', loading: false, session: null },
    init() {
      if (this.initialized) return;
      this.setupTabs();
      this.registerEvents();
      this.loadSession();
      this.initializeStorage();
      this.setupErrorHandling();
      document.getElementById('year').textContent = new Date().getFullYear();
      this.initialized = true;
    },
    setupTabs() {
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => this.activateTab(btn.dataset.tab));
      });
    },
    activateTab(tabId) {
      this.state.activeTab = tabId;
      document.querySelectorAll('.tab-btn').forEach((el) => el.classList.toggle('active', el.dataset.tab === tabId));
      document.querySelectorAll('.tab-panel').forEach((el) => el.classList.toggle('active', el.id === tabId));
      window.StorageModule?.saveProjectData({ activeTab: tabId });
    },
    registerEvents() {
      document.querySelector('[data-action="clear-canvas"]')?.addEventListener('click', () => window.DrawingTool?.clear());
      document.querySelector('[data-action="save-layout"]')?.addEventListener('click', () => window.UIModule?.notify('Layout saved', 'success'));
    },
    loadSession() {
      this.state.session = window.StorageModule?.loadSession() || null;
    },
    initializeStorage() {
      window.StorageModule?.init();
    },
    setupErrorHandling() {
      window.addEventListener('error', (event) => {
        console.error('Unhandled error', event.error || event.message);
        window.UIModule?.notify('Unexpected error occurred', 'danger');
      });
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection', event.reason);
      });
    },
    setLoading(isLoading) {
      this.state.loading = Boolean(isLoading);
      document.body.classList.toggle('is-loading', this.state.loading);
    }
  };

  document.addEventListener('DOMContentLoaded', () => App.init());
  window.App = App;
})();
