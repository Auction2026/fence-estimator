(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  const defaultState = {
    activeTab: 'tab1',
    project: {
      projectId: '',
      customerName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      customerPhone: '',
      customerEmail: '',
      projectDate: new Date().toISOString().slice(0, 10),
      projectType: 'Residential',
      propertySize: '',
      projectNotes: ''
    },
    specs: {
      fenceType: 'chain-link',
      fenceHeight: 6,
      fenceColor: 'Galvanized',
      fenceGauge: '9',
      totalFootage: '',
      cornerPosts: 2,
      gateCount: 0,
      gateWidth: 4,
      privacyOption: 'none',
      specNotes: ''
    },
    layout: { drawing: [], imageData: '', notes: '' },
    installation: { laborHours: '', crewSize: 2, equipmentList: '', startDate: '', endDate: '', timelineNotes: '' },
    drawings: { files: [], notes: '' },
    permits: { permitRequired: false, permitStatus: 'not-required', permitNumber: '', permitAuthority: '', permitNotes: '' },
    utilities: { utilityLocateRequired: false, utilityCompany: '', clearanceDate: '', utilityTicket: '', utilityNotes: '' },
    estimate: { laborRate: 65, markupPercent: 18, materials: [], labor: {}, subtotal: 0, total: 0, markupAmount: 0, extrasTotal: 0 },
    contract: { lockedPrice: 0, lockedDate: '', contractTerms: '', customerSignature: '', salesSignature: '', depositAmount: '', contractDate: '' },
    extras: [],
    crew: { foreman: '', members: [] },
    changeOrders: [],
    signoff: {},
    notes: [],
    admin: {},
    catalog: {},
    mapping: { points: [] }
  };

  const App = {
    storageKey: 'fenceDepot:appState',
    autoSaveIntervalMs: 30000,
    state: clone(defaultState),

    init() {
      this.restoreState();
      this.cacheDom();
      this.bindGlobalEvents();
      this.initTabs();
      this.refreshAllModules();
      this.switchTab(this.state.activeTab || 'tab1');
      this.startAutoSave();
      this.updateLastSaved(this.state.lastSavedAt || null);
      document.getElementById('api-status').textContent = Api.token ? 'Ready' : 'Offline Draft';
      if (!Api.token) {
        document.getElementById('api-status').classList.add('status-warning');
      }
      UI.showNotification('Fence Depot estimator loaded.', 'success');
    },

    cacheDom() {
      this.tabButtons = Array.from(document.querySelectorAll('.tab-button'));
      this.panels = Array.from(document.querySelectorAll('.tab-panel'));
    },

    bindGlobalEvents() {
      this.tabButtons.forEach((button) => button.addEventListener('click', () => this.switchTab(button.dataset.tab)));
      document.getElementById('new-project-btn')?.addEventListener('click', () => this.newProject());
      document.getElementById('save-project-btn')?.addEventListener('click', () => this.saveAll());
      document.getElementById('export-json-btn')?.addEventListener('click', () => Storage.exportToJSON(this.state));
      document.getElementById('export-pdf-btn')?.addEventListener('click', () => FenceEstimatorTools.exporter.exportToPDF(this.state.activeTab));
      document.getElementById('print-tab-btn')?.addEventListener('click', () => FenceEstimatorTools.printing.printSelectedTab(this.state.activeTab));
      document.getElementById('import-json-input')?.addEventListener('change', (event) => this.importJSON(event));
      window.addEventListener('beforeunload', () => this.persistLocal(false));
    },

    initTabs() {
      Object.values(window.FenceEstimatorTabs || {}).forEach((module) => module.init?.(this));
    },

    refreshAllModules() {
      Object.values(window.FenceEstimatorTabs || {}).forEach((module) => module.loadFromState?.());
      window.FenceEstimatorTabs.extras?.render?.();
      window.FenceEstimatorTabs.notes?.render?.();
      window.FenceEstimatorTabs.changeOrders?.render?.();
      window.FenceEstimatorTabs.crew?.render?.();
      window.FenceEstimatorTabs.admin?.renderDashboard?.(window.FenceEstimatorTabs.admin.buildProjectRows?.() || []);
      window.FenceEstimatorTabs.estimate?.renderEstimate?.(this.state.estimate);
      window.FenceEstimatorTabs.specs?.renderSummary?.();
      window.FenceEstimatorTabs.drawings?.render?.();
      window.FenceEstimatorTabs.mapping?.renderPoints?.();
      window.FenceEstimatorTabs.contract?.renderSummary?.();
      window.FenceEstimatorTabs.project?.refreshHeader?.();
    },

    switchTab(tabId) {
      this.state.activeTab = tabId;
      this.tabButtons.forEach((button) => button.classList.toggle('active', button.dataset.tab === tabId));
      this.panels.forEach((panel) => panel.classList.toggle('active', panel.id === tabId));
      this.persistLocal(false);
    },

    setSection(section, value, persist = true) {
      this.state[section] = value;
      if (persist) this.persistLocal(false);
    },

    updateSection(section, patch, persist = true) {
      const current = this.state[section] || {};
      this.state[section] = typeof current === 'object' && !Array.isArray(current)
        ? { ...current, ...patch }
        : patch;
      if (persist) this.persistLocal(false);
    },

    persistLocal(showNotice = true) {
      this.state.lastSavedAt = new Date().toISOString();
      Storage.saveToLocalStorage(this.storageKey, this.state);
      Storage.autoSave(this.state);
      this.updateLastSaved(this.state.lastSavedAt);
      if (showNotice) UI.showNotification('Draft saved locally.', 'success');
    },

    restoreState() {
      const saved = Storage.loadFromLocalStorage(this.storageKey);
      const autoSaved = Storage.loadAutoSave();
      const latest = autoSaved?.savedAt && (!saved?.lastSavedAt || autoSaved.savedAt > saved.lastSavedAt) ? autoSaved.data : saved;
      if (!latest) {
        this.state = clone(defaultState);
        return;
      }
      this.state = { ...clone(defaultState), ...latest };
      Object.keys(defaultState).forEach((key) => {
        if (typeof defaultState[key] === 'object' && !Array.isArray(defaultState[key])) {
          this.state[key] = { ...clone(defaultState[key]), ...(latest[key] || {}) };
        }
      });
    },

    updateLastSaved(value) {
      const node = document.getElementById('last-saved-at');
      node.textContent = value ? new Date(value).toLocaleString() : 'Not yet saved';
    },

    startAutoSave() {
      window.setInterval(() => this.persistLocal(false), this.autoSaveIntervalMs);
    },

    newProject() {
      this.state = clone(defaultState);
      this.state.project.projectId = `LOCAL-${Date.now()}`;
      this.state.project.projectDate = new Date().toISOString().slice(0, 10);
      this.refreshAllModules();
      this.switchTab('tab1');
      this.persistLocal(false);
      UI.showNotification('Started a new project draft.', 'success');
    },

    async saveAll() {
      window.FenceEstimatorTabs.project?.captureState?.();
      window.FenceEstimatorTabs.specs?.renderSummary?.();
      window.FenceEstimatorTabs.estimate?.recalculate?.(false);
      this.persistLocal(false);
      await window.FenceEstimatorTabs.project?.saveRemote?.();
      if (this.state.estimate.materials?.length) {
        await window.FenceEstimatorTabs.estimate?.saveRemote?.();
      }
      UI.showNotification('Project workspace saved.', 'success');
    },

    async importJSON(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const imported = await Storage.importFromJSON(file);
        this.state = { ...clone(defaultState), ...imported };
        this.refreshAllModules();
        this.switchTab(this.state.activeTab || 'tab1');
        this.persistLocal(false);
        UI.showNotification('Project JSON imported.', 'success');
      } catch (error) {
        UI.showNotification(error.message, 'error');
      } finally {
        event.target.value = '';
      }
    }
  };

  window.FenceEstimatorApp = App;
  document.addEventListener('DOMContentLoaded', () => App.init());
})();
