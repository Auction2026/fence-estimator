
window.FenceApp = {
  state: {
    activeTab: 'project',
    tabs: {},
    estimate: null
  },
  tabs: {},
  registerTab(tab) {
    this.tabs[tab.id] = tab;
  }
};

window.registerFenceTab = function registerFenceTab(tabConfig) {
  window.FenceApp.registerTab(tabConfig);
};

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupTabSystem();
  setupEventListeners();
  loadUserSession();
  initializeStorage();
  setupErrorHandling();
  initializeTabs();
  refreshSessionSummary();
  switchTab(window.FenceApp.state.activeTab);
});

function initializeApp() {
  console.log('Fence Estimator App Initializing...');
  window.FenceUI.hideLoading();
}

function initializeTabs() {
  Object.values(window.FenceApp.tabs).forEach((tab) => {
    if (typeof tab.init === 'function') {
      tab.init(createTabContext(tab.id));
    }
  });
}

function setupTabSystem() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });
}

function switchTab(tabName) {
  window.FenceApp.state.activeTab = tabName;
  window.FenceUI.showTab(tabName);
  const tab = window.FenceApp.tabs[tabName];
  if (tab && typeof tab.activate === 'function') {
    tab.activate(createTabContext(tabName));
  }
  refreshSessionSummary();
}

function setupEventListeners() {
  document.getElementById('saveAllBtn')?.addEventListener('click', saveAllData);
  document.getElementById('clearStorageBtn')?.addEventListener('click', function() {
    window.FenceUI.showConfirmDialog('Clear all locally saved project data?', () => {
      window.FenceStorage.clearAllStorage();
      initializeStorage();
      refreshSessionSummary();
      window.FenceUI.showNotification('Local data cleared.', 'success');
    });
  });
  document.getElementById('printCurrentTabBtn')?.addEventListener('click', function() {
    window.FencePrinting.printCurrentTab(window.FenceApp.state.activeTab);
  });
  document.getElementById('calculateEstimateBtn')?.addEventListener('click', runEstimate);
  document.getElementById('exportEstimateBtn')?.addEventListener('click', function() {
    const estimate = window.FenceStorage.getEstimate();
    if (!estimate) {
      window.FenceUI.showNotification('Calculate an estimate before exporting.', 'warning');
      return;
    }
    window.FenceExport.downloadEstimateCsv(estimate);
  });
  document.getElementById('printEstimateBtn')?.addEventListener('click', function() {
    window.FencePrinting.printElement('tab-estimate');
  });
  document.getElementById('printContractBtn')?.addEventListener('click', function() {
    window.FencePrinting.printElement('tab-contract');
  });
  document.getElementById('generateContractBtn')?.addEventListener('click', renderContractPreview);
  document.getElementById('catalogSearchBtn')?.addEventListener('click', renderCatalogResults);
  document.getElementById('mappingGeocodeBtn')?.addEventListener('click', function() {
    window.FenceMapping.loadAddress(document.getElementById('mapAddress')?.value || '');
  });
  document.getElementById('mappingRouteBtn')?.addEventListener('click', function() {
    window.FenceMapping.renderRouteSummary(document.getElementById('mapDirections')?.value || '');
  });
}

function loadUserSession() {
  const savedState = window.FenceStorage.getAllState();
  window.FenceApp.state.tabs = savedState.tabs || {};
  if (savedState.project) {
    window.FenceUI.populateForm('project-form', savedState.project);
  }
  if (savedState.specs) {
    window.FenceUI.populateForm('specs-form', savedState.specs);
  }
  if (savedState.estimate) {
    window.FenceApp.state.estimate = savedState.estimate;
    renderEstimate(savedState.estimate);
  }
}

function initializeStorage() {
  window.FenceStorage.enableAutoSave(() => {
    saveAllData(false);
  }, 30000);
}

function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error(event.error || event.message);
    window.FenceUI.showNotification('An unexpected error occurred.', 'error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error(event.reason);
    window.FenceUI.showNotification('A network or processing error occurred.', 'error');
  });
}

function createTabContext(tabId) {
  return {
    id: tabId,
    state: window.FenceApp.state,
    storage: window.FenceStorage,
    ui: window.FenceUI,
    validation: window.FenceValidation,
    calculations: window.FenceCalculations,
    api: window.FenceAPI
  };
}

function collectProjectData() {
  return window.FenceUI.formToObject('project-form');
}

function collectSpecsData() {
  return window.FenceUI.formToObject('specs-form');
}

function collectEstimateControls() {
  return window.FenceUI.formToObject('estimate-controls-form');
}

function saveAllData(showToast = true) {
  const project = collectProjectData();
  const projectErrors = window.FenceValidation.validateProjectForm(project);
  if (projectErrors.length) {
    window.FenceValidation.displayValidationErrors(projectErrors);
    return false;
  }

  const specs = collectSpecsData();
  const specErrors = window.FenceValidation.validateFenceSpecs(specs);
  if (specErrors.length) {
    window.FenceValidation.displayValidationErrors(specErrors);
    return false;
  }

  window.FenceValidation.displayValidationErrors([]);
  window.FenceStorage.saveProject(project);
  window.FenceStorage.saveSpecs(specs);
  window.FenceStorage.saveTabState(window.FenceApp.state.tabs || {});
  refreshSessionSummary();

  if (showToast) {
    window.FenceUI.showNotification('Project data saved locally.', 'success');
  }

  return true;
}

function runEstimate() {
  const specs = collectSpecsData();
  const specErrors = window.FenceValidation.validateFenceSpecs(specs);
  if (specErrors.length) {
    window.FenceValidation.displayValidationErrors(specErrors);
    switchTab('specs');
    return;
  }

  const controls = collectEstimateControls();
  const estimate = window.FenceCalculations.calculateEstimate(specs, controls, { rate: controls.laborRate });
  window.FenceApp.state.estimate = estimate;
  window.FenceStorage.saveEstimate(estimate);
  renderEstimate(estimate);
  switchTab('estimate');
}

function renderEstimate(estimate) {
  const cards = document.getElementById('estimateCards');
  const rows = [
    ['Materials', estimate.materialCost],
    ['Labour', estimate.laborCost],
    ['Equipment', estimate.equipmentCost],
    ['Total', estimate.total]
  ];
  if (cards) {
    cards.innerHTML = '';
    rows.forEach(([label, value]) => {
      const card = document.createElement('article');
      card.className = 'estimate-card';
      const title = document.createElement('span');
      title.textContent = label;
      const amount = document.createElement('strong');
      amount.textContent = window.FenceCalculations.formatCurrency(value);
      card.append(title, amount);
      cards.appendChild(card);
    });
  }
  window.FenceUI.updateTableWithData('estimateBreakdownTable', window.FenceCalculations.toBreakdownRows(estimate));
}

function renderContractPreview() {
  const formData = window.FenceUI.formToObject('contract-form');
  const errors = window.FenceValidation.validateContractForm(formData);
  if (errors.length) {
    window.FenceValidation.displayValidationErrors(errors);
    return;
  }
  const estimate = window.FenceStorage.getEstimate();
  const preview = document.getElementById('contractPreview');
  if (!preview) {
    return;
  }
  const total = estimate ? window.FenceCalculations.formatCurrency(estimate.total) : 'Pending estimate';
  preview.textContent = `Price locked for ${formData.priceLockDays} days. Deposit: ${formData.depositPercent}%. Estimated total: ${total}. Terms: ${formData.paymentTerms}.`;
  window.FenceUI.showNotification('Contract preview refreshed.', 'success');
}

function refreshSessionSummary() {
  const project = window.FenceStorage.getProject() || {};
  const estimate = window.FenceStorage.getEstimate();
  window.FenceUI.renderSummaryList('sessionSummary', [
    ['Active Tab', window.FenceApp.state.activeTab],
    ['Customer', project.customerName || 'Not saved'],
    ['Project #', project.projectNumber || 'Draft'],
    ['Address', project.address || 'Not saved'],
    ['Estimate', estimate ? window.FenceCalculations.formatCurrency(estimate.total) : 'Not calculated']
  ]);
  window.FenceUI.renderSummaryList('project-summary', [
    ['Customer', project.customerName || ''],
    ['Email', project.customerEmail || ''],
    ['Phone', project.customerPhone || ''],
    ['Address', project.address || ''],
    ['Sales Rep', project.salesRep || ''],
    ['Target Date', project.targetInstallDate || '']
  ]);
}

function renderCatalogResults() {
  const query = document.getElementById('catalogSearchInput')?.value?.trim()?.toLowerCase() || '';
  const catalog = window.FenceSeedCatalog || [];
  const rows = catalog
    .filter((item) => !query || item.sku.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
    .slice(0, 25)
    .map((item) => ({
      sku: item.sku,
      name: item.name,
      category: item.category,
      unit: item.unit,
      price: window.FenceCalculations.formatCurrency(item.price)
    }));
  window.FenceUI.updateTableWithData('catalogTable', rows);
}

window.initializeApp = initializeApp;
window.setupTabSystem = setupTabSystem;
window.switchTab = switchTab;
window.setupEventListeners = setupEventListeners;
window.loadUserSession = loadUserSession;
window.initializeStorage = initializeStorage;
window.setupErrorHandling = setupErrorHandling;
window.refreshSessionSummary = refreshSessionSummary;
window.renderCatalogResults = renderCatalogResults;
