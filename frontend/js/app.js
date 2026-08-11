// Fence Depot Estimator - Main Application
'use strict';

const AppState = {
  currentTab: 1,
  currentProject: null,
  estimate: null,
  contract: null,
  isLoading: false,
  user: null,
  notes: [],
  changeOrders: [],
  crewMembers: [],
  extraItems: [],
  installationTasks: [],
  permit: null,
  utilities: null,
  signOff: null,
  drawings: [],
  catalog: [],
  drawingData: null,
  mapping: {
    address: '',
    coordinates: { lat: 35.7796, lng: -78.6382 },
    points: []
  },
  ui: {
    notifications: [],
    lastSavedAt: null,
    autosaveEnabled: true
  }
};

window.AppState = AppState;
window.TabsRegistry = {};

const App = {
  tabNames: { 1: 'Project Info', 2: 'Fence Specs', 3: 'Layout Diagram', 4: 'Installation', 5: 'Shop Drawings', 6: 'Permits', 7: 'Utilities', 8: 'Estimate', 9: 'Contract', 10: 'Extras', 11: 'Crew', 12: 'Change Orders', 13: 'Sign-Off', 14: 'Notes', 15: 'Admin', 16: 'Catalog', 17: 'Mapping' },
  defaultCatalog: [],
  setCurrentProject(data) {
    AppState.currentProject = Object.assign({}, AppState.currentProject || {}, data || {});
    return AppState.currentProject;
  },
  getCurrentProject() { return AppState.currentProject || {}; },
  setEstimate(estimate) {
    AppState.estimate = estimate || null;
    if (window.Storage && estimate) Storage.saveEstimate(estimate);
    if (window.UI) UI.renderEstimate(estimate || {});
    return AppState.estimate;
  },
  setContract(contract) {
    AppState.contract = contract || null;
    if (window.UI) UI.renderContract(contract || {});
    return AppState.contract;
  },
  collectFormData(form) {
    if (!form) return {};
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });
    form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      if (checkbox.name) data[checkbox.name] = checkbox.checked;
    });
    return data;
  },
  fillForm(form, data) {
    if (!form || !data) return;
    Object.keys(data).forEach((key) => {
      const field = form.querySelector(`[name="${key}"], #${key}`);
      if (!field) return;
      if (field.type === 'checkbox') field.checked = Boolean(data[key]);
      else field.value = data[key] == null ? '' : data[key];
    });
  },
  registerTab(number, tabObject) { window.TabsRegistry[number] = tabObject; },
  invokeTab(method, number) {
    const tab = window.TabsRegistry[number];
    if (tab && typeof tab[method] === 'function') return tab[method]();
    return null;
  },
  getTabObject(number) { return window.TabsRegistry[number] || null; },
  serializeTableRow(row) {
    const data = {};
    row.querySelectorAll('input, select, textarea').forEach((field, index) => {
      const key = field.name || field.dataset.key || `field_${index}`;
      data[key] = field.type === 'checkbox' ? field.checked : field.value;
    });
    return data;
  },
  serializeTable(tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return [];
    return Array.from(tbody.querySelectorAll('tr')).map((row) => App.serializeTableRow(row));
  },
  debounce(fn, wait) {
    let timeout = null;
    return function debounced(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  },
  safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  },
  sum(values) { return (values || []).reduce((total, value) => total + App.safeNumber(value), 0); },
  clone(value) { return JSON.parse(JSON.stringify(value)); },
  nextProjectId() { return `FD-${Date.now().toString().slice(-8)}`; },
  updateLastSaved() {
    AppState.ui.lastSavedAt = new Date().toISOString();
    const footer = document.querySelector('.footer div:last-child');
    if (footer) footer.textContent = `Last saved ${formatDate(AppState.ui.lastSavedAt)} • Professional fencing solutions for residential, commercial, and industrial projects.`;
  },
  saveAll() {
    [window.Tab1, window.Tab2, window.Tab4, window.Tab5, window.Tab6, window.Tab7, window.Tab10, window.Tab11, window.Tab12, window.Tab13, window.Tab14, window.Tab17].forEach((tab) => {
      if (tab && typeof tab.save === 'function') tab.save();
    });
    if (window.Storage) {
      Storage.saveProject(AppState.currentProject || {});
      Storage.save('app-state', AppState);
    }
    App.updateLastSaved();
  }
};
window.App = App;

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  tabButtons.forEach((button) => {
    button.addEventListener('click', function onTabClick() {
      const tabNumber = Number(this.dataset.tab);
      if (!tabNumber) return;
      const currentTabObject = App.getTabObject(AppState.currentTab);
      if (currentTabObject && typeof currentTabObject.validate === 'function') currentTabObject.validate();
      AppState.currentTab = tabNumber;
      tabButtons.forEach((tabButton) => tabButton.classList.toggle('active', tabButton === this));
      panes.forEach((pane) => pane.classList.toggle('active', Number(pane.dataset.tabPane) === tabNumber));
      if (window.UI) UI.showTab(tabNumber);
      App.invokeTab('load', tabNumber);
      history.replaceState({ tab: tabNumber }, '', `#tab-${tabNumber}`);
    });
  });
  window.addEventListener('popstate', (event) => {
    const tabNumber = event.state && event.state.tab ? Number(event.state.tab) : 1;
    const target = document.querySelector(`.tab-btn[data-tab="${tabNumber}"]`);
    if (target) target.click();
  });
  const hash = window.location.hash || '';
  const matched = hash.match(/tab-(\d+)/);
  if (matched) {
    const target = document.querySelector(`.tab-btn[data-tab="${matched[1]}"]`);
    if (target) target.click();
  }
}

function initForms() {
  const projectForm = document.getElementById('projectInfoForm');
  if (projectForm) projectForm.addEventListener('submit', (event) => { event.preventDefault(); if (window.Tab1) Tab1.save(); });
  const specCalculateBtn = document.getElementById('specsCalculateBtn');
  if (specCalculateBtn) specCalculateBtn.addEventListener('click', () => { if (window.Tab2) Tab2.calculate(); });
  const quickSaveBtn = document.getElementById('headerSaveProject');
  if (quickSaveBtn) quickSaveBtn.addEventListener('click', () => { App.saveAll(); showNotification('Project saved locally.', 'success'); });
  const resetBtn = document.getElementById('projectInfoReset');
  if (resetBtn && projectForm) resetBtn.addEventListener('click', () => { projectForm.reset(); Validation.clearAllErrors(projectForm); showNotification('Project form reset.', 'info'); });
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('input', App.debounce(() => {
      if (AppState.ui.autosaveEnabled && window.Storage) Storage.save('draft-' + (form.id || 'form'), App.collectFormData(form));
    }, 250));
  });
  document.addEventListener('click', (event) => {
    if (event.target.matches('#globalModalClose, #globalModalDismiss')) {
      if (window.UI) UI.hideModal();
    }
  });
  window.addEventListener('beforeunload', () => { try { App.saveAll(); } catch (error) { console.warn('Autosave before unload failed', error); } });
}

function loadSavedProject() {
  if (!window.Storage) return;
  const savedState = Storage.load('app-state');
  if (savedState) Object.assign(AppState, savedState);
  const savedProject = Storage.loadProject();
  const savedEstimate = Storage.loadEstimate();
  AppState.currentProject = savedProject ? Object.assign({ projectId: savedProject.projectId || App.nextProjectId() }, savedProject) : { projectId: App.nextProjectId(), createdAt: new Date().toISOString() };
  if (savedEstimate) AppState.estimate = savedEstimate;
  if (window.Tab1) Tab1.load();
  if (window.Tab2) Tab2.load();
  if (window.Tab8) Tab8.load();
}

function initDrawingCanvas() { if (window.DrawingTool && document.getElementById('layoutCanvas')) DrawingTool.initCanvas('layoutCanvas'); }
function initCatalog() {
  App.defaultCatalog = [
    { sku: 'CL-001', name: 'Galvanized Chain Link Mesh 4 ft', category: 'Chain Link', unit: 'LF', cost: 1.20, price: 2.40 },
    { sku: 'CL-002', name: 'Galvanized Chain Link Mesh 6 ft', category: 'Chain Link', unit: 'LF', cost: 1.75, price: 3.15 },
    { sku: 'WD-001', name: 'Pressure Treated Privacy Pickets 6 ft', category: 'Wood', unit: 'LF', cost: 3.80, price: 6.95 },
    { sku: 'VN-001', name: 'Vinyl Privacy Panel 6 ft x 8 ft', category: 'Vinyl', unit: 'EA', cost: 102.40, price: 165.00 },
    { sku: 'WI-001', name: 'Wrought Iron Panel 6 ft x 8 ft', category: 'Wrought Iron', unit: 'EA', cost: 256.00, price: 398.00 }
  ];
  AppState.catalog = App.clone(App.defaultCatalog);
}
function showNotification(message, type = 'info') {
  if (window.UI && typeof UI.showNotification === 'function') return UI.showNotification(message, type);
  const container = document.getElementById('notificationContainer');
  if (!container) return null;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
  return toast;
}
function showLoading(target) { AppState.isLoading = true; if (window.UI) UI.showLoading(target); }
function hideLoading(target) { AppState.isLoading = false; if (window.UI) UI.hideLoading(target); }
function formatCurrency(amount) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0); }
function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function syncEstimateToContract() {
  const estimate = AppState.estimate || {};
  const project = AppState.currentProject || {};
  const contract = Object.assign({}, AppState.contract || {}, {
    projectId: project.projectId || App.nextProjectId(),
    customerName: project.customerName || '',
    projectSummary: [project.customerName, project.addressStreet, project.addressCity, project.addressState].filter(Boolean).join(' • '),
    scopeOfWork: estimate.scopeOfWork || 'Furnish and install fence materials, labor, equipment, and project supervision.',
    total: estimate.total || 0,
    locked: Boolean(AppState.contract && AppState.contract.locked)
  });
  App.setContract(contract);
}
function recalculateDerivedViews() { if (window.Tab8) Tab8.load(); if (window.Tab9) Tab9.load(); if (window.Tab15) Tab15.load(); }
function attachGlobalDelegates() {
  document.addEventListener('click', (event) => {
    if (event.target.matches('[data-draw-mode]') && window.DrawingTool) DrawingTool.setMode(event.target.dataset.drawMode);
    if (event.target.matches('#toolUndo') && window.DrawingTool) DrawingTool.undo();
    if (event.target.matches('#toolRedo') && window.DrawingTool) DrawingTool.redo();
    if (event.target.matches('#toolClear') && window.DrawingTool) DrawingTool.clear();
    if (event.target.matches('#toolSaveDrawing') && window.DrawingTool) DrawingTool.saveAsImage();
    if (event.target.matches('#downloadDrawingBtn') && window.DrawingTool) DrawingTool.saveAsImage();
    if (event.target.matches('#printEstimateBtn') && window.PrintTool) PrintTool.printEstimate(AppState.estimate || {});
    if (event.target.matches('#emailEstimateBtn') && window.ExportTool) ExportTool.emailDocument((AppState.currentProject || {}).customerEmail || '', 'Fence Depot Estimate', JSON.stringify(AppState.estimate || {}, null, 2));
    if (event.target.matches('#printContractBtn') && window.PrintTool) PrintTool.printContract(AppState.contract || {});
    if (event.target.matches('#mappingUpdateBtn') && window.Tab17) Tab17.updateFromManualCoordinates();
  });
  const colorPicker = document.getElementById('drawingColor');
  if (colorPicker) colorPicker.addEventListener('change', (event) => { if (window.DrawingTool) DrawingTool.setColor(event.target.value); });
  const lineWidth = document.getElementById('drawingLineWidth');
  if (lineWidth) lineWidth.addEventListener('input', (event) => { if (window.DrawingTool) DrawingTool.setLineWidth(event.target.value); });
}
function seedMissingCollections() {
  AppState.notes = Array.isArray(AppState.notes) ? AppState.notes : [];
  AppState.changeOrders = Array.isArray(AppState.changeOrders) ? AppState.changeOrders : [];
  AppState.crewMembers = Array.isArray(AppState.crewMembers) ? AppState.crewMembers : [];
  AppState.extraItems = Array.isArray(AppState.extraItems) ? AppState.extraItems : [];
  AppState.installationTasks = Array.isArray(AppState.installationTasks) ? AppState.installationTasks : [];
  AppState.drawings = Array.isArray(AppState.drawings) ? AppState.drawings : [];
}
function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === 's') { event.preventDefault(); App.saveAll(); showNotification('Saved project with keyboard shortcut.', 'success'); }
    if (modifier && event.key.toLowerCase() === 'p' && AppState.currentTab === 8 && window.PrintTool) { event.preventDefault(); PrintTool.printEstimate(AppState.estimate || {}); }
  });
}
function refreshNavigationLabels() { document.querySelectorAll('.tab-btn').forEach((button) => { const tab = Number(button.dataset.tab); button.setAttribute('title', App.tabNames[tab] || `Tab ${tab}`); }); }
function initializeTabModules() { [Tab1, Tab2, Tab3, Tab4, Tab5, Tab6, Tab7, Tab8, Tab9, Tab10, Tab11, Tab12, Tab13, Tab14, Tab15, Tab16, Tab17].forEach((tabObject, index) => { if (tabObject && typeof tabObject.init === 'function') { App.registerTab(index + 1, tabObject); tabObject.init(); } }); }
function initializeAppShell() {
  seedMissingCollections();
  initTabs();
  initForms();
  loadSavedProject();
  initDrawingCanvas();
  initCatalog();
  attachGlobalDelegates();
  bindKeyboardShortcuts();
  refreshNavigationLabels();
  initializeTabModules();
  if (window.Storage) Storage.autoSave(60000);
  syncEstimateToContract();
  recalculateDerivedViews();
}
document.addEventListener('DOMContentLoaded', function() {
  console.log('Fence Depot Estimator initializing...');
  initializeAppShell();
  console.log('Application ready.');
});

App[`helper_1`] = function helper_1(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_2`] = function helper_2(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_3`] = function helper_3(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_4`] = function helper_4(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_5`] = function helper_5(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_6`] = function helper_6(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_7`] = function helper_7(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_8`] = function helper_8(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_9`] = function helper_9(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_10`] = function helper_10(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_11`] = function helper_11(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_12`] = function helper_12(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_13`] = function helper_13(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_14`] = function helper_14(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_15`] = function helper_15(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_16`] = function helper_16(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_17`] = function helper_17(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_18`] = function helper_18(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_19`] = function helper_19(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_20`] = function helper_20(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_21`] = function helper_21(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_22`] = function helper_22(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_23`] = function helper_23(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_24`] = function helper_24(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_25`] = function helper_25(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_26`] = function helper_26(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_27`] = function helper_27(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_28`] = function helper_28(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_29`] = function helper_29(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_30`] = function helper_30(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_31`] = function helper_31(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_32`] = function helper_32(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_33`] = function helper_33(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_34`] = function helper_34(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_35`] = function helper_35(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_36`] = function helper_36(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_37`] = function helper_37(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_38`] = function helper_38(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_39`] = function helper_39(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_40`] = function helper_40(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_41`] = function helper_41(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_42`] = function helper_42(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_43`] = function helper_43(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_44`] = function helper_44(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_45`] = function helper_45(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_46`] = function helper_46(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_47`] = function helper_47(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_48`] = function helper_48(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_49`] = function helper_49(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_50`] = function helper_50(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_51`] = function helper_51(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_52`] = function helper_52(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_53`] = function helper_53(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_54`] = function helper_54(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_55`] = function helper_55(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_56`] = function helper_56(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_57`] = function helper_57(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_58`] = function helper_58(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_59`] = function helper_59(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_60`] = function helper_60(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_61`] = function helper_61(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_62`] = function helper_62(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_63`] = function helper_63(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_64`] = function helper_64(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_65`] = function helper_65(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_66`] = function helper_66(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_67`] = function helper_67(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_68`] = function helper_68(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_69`] = function helper_69(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_70`] = function helper_70(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_71`] = function helper_71(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_72`] = function helper_72(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_73`] = function helper_73(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_74`] = function helper_74(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_75`] = function helper_75(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_76`] = function helper_76(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_77`] = function helper_77(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_78`] = function helper_78(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_79`] = function helper_79(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_80`] = function helper_80(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_81`] = function helper_81(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_82`] = function helper_82(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_83`] = function helper_83(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_84`] = function helper_84(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_85`] = function helper_85(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_86`] = function helper_86(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_87`] = function helper_87(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_88`] = function helper_88(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_89`] = function helper_89(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_90`] = function helper_90(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_91`] = function helper_91(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_92`] = function helper_92(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_93`] = function helper_93(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_94`] = function helper_94(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_95`] = function helper_95(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_96`] = function helper_96(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_97`] = function helper_97(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_98`] = function helper_98(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_99`] = function helper_99(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_100`] = function helper_100(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_101`] = function helper_101(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_102`] = function helper_102(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_103`] = function helper_103(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_104`] = function helper_104(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_105`] = function helper_105(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_106`] = function helper_106(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_107`] = function helper_107(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_108`] = function helper_108(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_109`] = function helper_109(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_110`] = function helper_110(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_111`] = function helper_111(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_112`] = function helper_112(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_113`] = function helper_113(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_114`] = function helper_114(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_115`] = function helper_115(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_116`] = function helper_116(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_117`] = function helper_117(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_118`] = function helper_118(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_119`] = function helper_119(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_120`] = function helper_120(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_121`] = function helper_121(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_122`] = function helper_122(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_123`] = function helper_123(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_124`] = function helper_124(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_125`] = function helper_125(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_126`] = function helper_126(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_127`] = function helper_127(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_128`] = function helper_128(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_129`] = function helper_129(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_130`] = function helper_130(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_131`] = function helper_131(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_132`] = function helper_132(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_133`] = function helper_133(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_134`] = function helper_134(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_135`] = function helper_135(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_136`] = function helper_136(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_137`] = function helper_137(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_138`] = function helper_138(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_139`] = function helper_139(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_140`] = function helper_140(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_141`] = function helper_141(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_142`] = function helper_142(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_143`] = function helper_143(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_144`] = function helper_144(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_145`] = function helper_145(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_146`] = function helper_146(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_147`] = function helper_147(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_148`] = function helper_148(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_149`] = function helper_149(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_150`] = function helper_150(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_151`] = function helper_151(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_152`] = function helper_152(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_153`] = function helper_153(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_154`] = function helper_154(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_155`] = function helper_155(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_156`] = function helper_156(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_157`] = function helper_157(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_158`] = function helper_158(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_159`] = function helper_159(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`helper_160`] = function helper_160(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  if (value && typeof value === 'object') return Object.keys(value).sort().join(',');
  return value == null ? '' : String(value);
};

App[`metric_1`] = function metric_1(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_2`] = function metric_2(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_3`] = function metric_3(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_4`] = function metric_4(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_5`] = function metric_5(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_6`] = function metric_6(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_7`] = function metric_7(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_8`] = function metric_8(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_9`] = function metric_9(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_10`] = function metric_10(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_11`] = function metric_11(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_12`] = function metric_12(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_13`] = function metric_13(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_14`] = function metric_14(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_15`] = function metric_15(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_16`] = function metric_16(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_17`] = function metric_17(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_18`] = function metric_18(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_19`] = function metric_19(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_20`] = function metric_20(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_21`] = function metric_21(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_22`] = function metric_22(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_23`] = function metric_23(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_24`] = function metric_24(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_25`] = function metric_25(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_26`] = function metric_26(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_27`] = function metric_27(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_28`] = function metric_28(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_29`] = function metric_29(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_30`] = function metric_30(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_31`] = function metric_31(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_32`] = function metric_32(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_33`] = function metric_33(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_34`] = function metric_34(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_35`] = function metric_35(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_36`] = function metric_36(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_37`] = function metric_37(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_38`] = function metric_38(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_39`] = function metric_39(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_40`] = function metric_40(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_41`] = function metric_41(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_42`] = function metric_42(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_43`] = function metric_43(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_44`] = function metric_44(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_45`] = function metric_45(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_46`] = function metric_46(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_47`] = function metric_47(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_48`] = function metric_48(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_49`] = function metric_49(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_50`] = function metric_50(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_51`] = function metric_51(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_52`] = function metric_52(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_53`] = function metric_53(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_54`] = function metric_54(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_55`] = function metric_55(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_56`] = function metric_56(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_57`] = function metric_57(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_58`] = function metric_58(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_59`] = function metric_59(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_60`] = function metric_60(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_61`] = function metric_61(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_62`] = function metric_62(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_63`] = function metric_63(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_64`] = function metric_64(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_65`] = function metric_65(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_66`] = function metric_66(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_67`] = function metric_67(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_68`] = function metric_68(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_69`] = function metric_69(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_70`] = function metric_70(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_71`] = function metric_71(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_72`] = function metric_72(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_73`] = function metric_73(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_74`] = function metric_74(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_75`] = function metric_75(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_76`] = function metric_76(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_77`] = function metric_77(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_78`] = function metric_78(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_79`] = function metric_79(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_80`] = function metric_80(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_81`] = function metric_81(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_82`] = function metric_82(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_83`] = function metric_83(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_84`] = function metric_84(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_85`] = function metric_85(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_86`] = function metric_86(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_87`] = function metric_87(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_88`] = function metric_88(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_89`] = function metric_89(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_90`] = function metric_90(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_91`] = function metric_91(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_92`] = function metric_92(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_93`] = function metric_93(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_94`] = function metric_94(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_95`] = function metric_95(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_96`] = function metric_96(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_97`] = function metric_97(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_98`] = function metric_98(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_99`] = function metric_99(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_100`] = function metric_100(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_101`] = function metric_101(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_102`] = function metric_102(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_103`] = function metric_103(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_104`] = function metric_104(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_105`] = function metric_105(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_106`] = function metric_106(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_107`] = function metric_107(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_108`] = function metric_108(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_109`] = function metric_109(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_110`] = function metric_110(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_111`] = function metric_111(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_112`] = function metric_112(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_113`] = function metric_113(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_114`] = function metric_114(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_115`] = function metric_115(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_116`] = function metric_116(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_117`] = function metric_117(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_118`] = function metric_118(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_119`] = function metric_119(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};

App[`metric_120`] = function metric_120(numbers) {
  const list = Array.isArray(numbers) ? numbers.map((item) => App.safeNumber(item)) : [App.safeNumber(numbers)];
  const total = list.reduce((sum, item) => sum + item, 0);
  return { total, average: list.length ? total / list.length : 0, count: list.length };
};
