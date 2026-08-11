import { apiClient, ApiError } from './api.js';
import { calculateEstimateBundle, buildInventorySnapshot, searchInventory, INVENTORY_DB, normalizeFenceType } from './calculations.js';
import { validateWizardStep, validateEstimateState, applyValidationToForm, sanitizeEstimateInput } from './validation.js';
import { storage, createRecentTabTracker } from './storage.js';
import { chartManager, buildAnalyticsSummary } from './charts.js';
import { showToast, showLoading, hideLoading, confirmDialog, formatCurrency, formatNumber, formatDate, renderStatus, setButtonBusy, renderEmptyState } from './ui.js';

const TAB_IDS = ['dashboard', 'new-estimate', 'projects', 'inventory', 'materials', 'suppliers', 'analytics', 'settings'];
const recentTabs = createRecentTabTracker();

function createInitialEstimateState() {
  return {
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: 'ON',
      postalCode: '',
    },
    specifications: {
      fenceType: 'chainlink',
      style: 'residential',
      color: 'black',
      height: 5,
      material: 'pressure-treated',
      postSpacing: 8,
      wastePercent: 0.05,
      stain: false,
      capBoard: false,
    },
    measurements: {
      linearFeet: 100,
      corners: 4,
      ends: 2,
      gates: [{ width: 4, count: 1, swing: 'single' }],
    },
    pricing: {
      laborRate: 58,
      overheadPercent: 0.12,
      profitPercent: 0.2,
      taxPercent: 0.13,
      discountAmount: 0,
    },
    review: {
      acceptedTerms: false,
      sendEmail: true,
      deliveryEmail: '',
    },
  };
}

export let estimateState = createInitialEstimateState();

const SAMPLE_PROJECTS = [
  { projectId: 'PRJ-24001', customerName: 'John Smith', fenceType: 'chainlink', linearFeet: 100, total: 4092.28, status: 'contract', city: 'Cornwall', createdAt: '2026-07-12T14:22:00Z' },
  { projectId: 'PRJ-24002', customerName: 'Mary Johnson', fenceType: 'vinyl', linearFeet: 150, total: 8250, status: 'pending', city: 'Ottawa', createdAt: '2026-07-21T11:08:00Z' },
  { projectId: 'PRJ-24003', customerName: 'Bob Wilson', fenceType: 'woodPrivacy', linearFeet: 200, total: 12450, status: 'active', city: 'Kingston', createdAt: '2026-07-24T09:40:00Z' },
];

const SAMPLE_SUPPLIERS = [
  { id: 'SUP-01', name: 'Master Halco', specialty: 'Chain Link & Hardware', leadTimeDays: 3, status: 'active', phone: '(555) 410-1000' },
  { id: 'SUP-02', name: 'Homeland Vinyl', specialty: 'Premium Vinyl', leadTimeDays: 7, status: 'active', phone: '(555) 410-1001' },
  { id: 'SUP-03', name: 'Cloutier Direct', specialty: 'Ornamental Steel', leadTimeDays: 10, status: 'active', phone: '(555) 410-1002' },
  { id: 'SUP-04', name: 'Ameristar', specialty: 'Commercial Gates', leadTimeDays: 9, status: 'active', phone: '(555) 410-1003' },
];

const SAMPLE_SETTINGS = {
  companyName: 'Fence Depot Estimator',
  currency: 'USD',
  locale: 'en-US',
  defaultLaborRate: 58,
  defaultTaxPercent: 0.13,
  defaultProfitPercent: 0.2,
  defaultOverheadPercent: 0.12,
  theme: 'forest',
  autoSaveDrafts: true,
};

export const App = {
  state: {
    activeTab: 'dashboard',
    sidebarOpen: false,
    wizardStep: 1,
    loading: false,
    projects: [],
    estimates: [],
    customers: [],
    suppliers: SAMPLE_SUPPLIERS,
    materials: INVENTORY_DB,
    inventorySnapshot: buildInventorySnapshot(),
    activity: [],
    settings: { ...SAMPLE_SETTINGS },
    preferences: { compactTables: false, showCostsWithTax: true, recentTabs: [] },
    filters: { projectsSearch: '', inventorySearch: '', inventoryCategory: '', supplierSearch: '' },
  },
  elements: {},

  init() {
    this.cacheElements();
    this.restoreState();
    this.bindEvents();
    this.bootstrapSamples();
    this.renderAll();
    this.applyTabFromHash();
    this.syncFormWithState();
  },

  cacheElements() {
    this.elements.shell = document.querySelector('[data-app-shell]');
    this.elements.tabPanels = [...document.querySelectorAll('[data-tab-panel]')];
    this.elements.navButtons = [...document.querySelectorAll('[data-tab-target]')];
    this.elements.estimateForm = document.querySelector('[data-estimate-form]');
    this.elements.dashboardKpis = document.querySelector('[data-dashboard-kpis]');
    this.elements.projectsTable = document.querySelector('[data-projects-table]');
    this.elements.inventoryTable = document.querySelector('[data-inventory-table]');
    this.elements.materialsList = document.querySelector('[data-materials-list]');
    this.elements.suppliersList = document.querySelector('[data-suppliers-list]');
    this.elements.activityList = document.querySelector('[data-activity-list]');
    this.elements.analyticsSummary = document.querySelector('[data-analytics-summary]');
    this.elements.analyticsRevenue = document.querySelector('[data-chart-revenue]');
    this.elements.analyticsJobs = document.querySelector('[data-chart-jobs]');
    this.elements.analyticsMaterials = document.querySelector('[data-chart-material-costs]');
    this.elements.analyticsCloseRate = document.querySelector('[data-chart-close-rate]');
    this.elements.analyticsSupplierSpend = document.querySelector('[data-chart-supplier-spend]');
    this.elements.analyticsMargin = document.querySelector('[data-chart-margin]');
    this.elements.wizardSteps = [...document.querySelectorAll('[data-wizard-step]')];
    this.elements.wizardSections = [...document.querySelectorAll('[data-wizard-panel]')];
    this.elements.wizardProgress = document.querySelector('[data-wizard-progress]');
    this.elements.wizardSummary = document.querySelector('[data-wizard-summary]');
    this.elements.wizardTotals = document.querySelector('[data-wizard-totals]');
    this.elements.settingsForm = document.querySelector('[data-settings-form]');
  },

  restoreState() {
    const storedDraft = storage.loadDraftEstimate();
    const storedProjects = storage.loadProjects();
    const storedSettings = storage.loadSettings(SAMPLE_SETTINGS);
    const storedPreferences = storage.loadPreferences(this.state.preferences);
    const storedActivity = storage.loadActivityFeed();
    const session = storage.loadSession({ activeTab: 'dashboard', wizardStep: 1 });

    if (storedDraft) estimateState = { ...estimateState, ...storedDraft };
    this.state.projects = storedProjects;
    this.state.settings = storedSettings;
    this.state.preferences = storedPreferences;
    this.state.activity = storedActivity;
    this.state.activeTab = TAB_IDS.includes(session.activeTab) ? session.activeTab : 'dashboard';
    this.state.wizardStep = Math.min(Math.max(Number(session.wizardStep) || 1, 1), 5);
    this.state.preferences.recentTabs = recentTabs.load();
    apiClient.setToken(session.token || null);
  },

  bootstrapSamples() {
    if (!this.state.projects.length) {
      this.state.projects = SAMPLE_PROJECTS.map((project) => ({ ...project }));
      storage.saveProjects(this.state.projects);
    }

    if (!this.state.activity.length) {
      this.state.activity = [
        { title: 'Estimate generated', detail: "John Smith • 100' chain link", timestamp: '2026-07-12T14:22:00Z', tone: 'success' },
        { title: 'Supplier price refresh', detail: 'Master Halco catalog synced', timestamp: '2026-07-22T09:00:00Z', tone: 'info' },
        { title: 'Inventory alert', detail: 'Vinyl gate kits below minimum stock', timestamp: '2026-07-25T16:35:00Z', tone: 'warning' },
      ];
    }

    if (!this.state.estimates.length) {
      this.state.estimates = this.state.projects.map((project) => ({
        estimateId: `${project.projectId}-EST`,
        customerName: project.customerName,
        fenceType: project.fenceType,
        projectId: project.projectId,
        total: project.total,
        materialsSubtotal: project.total * 0.42,
        createdAt: project.createdAt,
      }));
    }
  },

  bindEvents() {
    document.addEventListener('click', (event) => this.handleClick(event));
    document.addEventListener('input', (event) => this.handleInput(event));
    document.addEventListener('change', (event) => this.handleChange(event));
    document.addEventListener('submit', (event) => this.handleSubmit(event));
    window.addEventListener('hashchange', () => this.applyTabFromHash());
  },

  handleClick(event) {
    const tabTrigger = event.target.closest('[data-tab-target]');
    if (tabTrigger) return void this.setActiveTab(tabTrigger.dataset.tabTarget);
    const actionTrigger = event.target.closest('[data-action]');
    if (actionTrigger) return void this.dispatchAction(actionTrigger.dataset.action, actionTrigger);
    if (event.target.matches('[data-sidebar-overlay]') && this.state.sidebarOpen) this.toggleSidebar(false);
  },

  handleInput(event) {
    const field = event.target.closest('[name]');
    if (!field) return;
    this.writeFieldToState(field);
    if (field.form === this.elements.estimateForm) {
      this.scheduleDraftSave();
      this.renderWizardSidebar();
    }
  },

  handleChange(event) {
    const field = event.target.closest('[name]');
    if (!field) return;
    this.writeFieldToState(field);
    if (field.form === this.elements.settingsForm) this.persistSettingsFromForm();
  },

  handleSubmit(event) {
    if (event.target === this.elements.estimateForm) {
      event.preventDefault();
      this.submitEstimateWizard(event.submitter || event.target.querySelector('[type="submit"]'));
      return;
    }
    if (event.target === this.elements.settingsForm) {
      event.preventDefault();
      this.persistSettingsFromForm();
      showToast({ title: 'Settings saved', message: 'Default pricing and company preferences updated.', tone: 'success' });
    }
  },

  dispatchAction(action, trigger) {
    switch (action) {
      case 'toggle-sidebar': return this.toggleSidebar();
      case 'next-step': return this.advanceWizard();
      case 'prev-step': return this.retreatWizard();
      case 'save-draft': return this.saveDraft(true);
      case 'submit-estimate': return this.submitEstimateWizard(trigger);
      case 'new-estimate': return this.resetEstimateDraftAndRoute();
      case 'delete-draft': return this.confirmResetDraft();
      case 'refresh-charts': return this.renderAnalytics();
      case 'toggle-compact-tables':
        this.state.preferences.compactTables = !this.state.preferences.compactTables;
        storage.savePreferences(this.state.preferences);
        this.renderProjects();
        this.renderInventory();
        return;
      case 'copy-total':
        navigator.clipboard?.writeText(String(this.getCurrentBundle().pricing.total || '0'));
        showToast({ title: 'Copied', message: 'Estimate total copied to clipboard.', tone: 'success' });
        return;
      default:
        if (action.startsWith('edit-project:')) return this.prefillEstimateFromProject(action.split(':')[1]);
        if (action.startsWith('delete-project:')) return this.removeProject(action.split(':')[1]);
    }
  },

  setActiveTab(tabId) {
    if (!TAB_IDS.includes(tabId)) return;
    this.state.activeTab = tabId;
    recentTabs.push(tabId);
    this.state.preferences.recentTabs = recentTabs.load();
    this.elements.navButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.tabTarget === tabId));
    this.elements.tabPanels.forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== tabId; });
    storage.saveSession({ ...storage.loadSession({}), activeTab: tabId, wizardStep: this.state.wizardStep, token: apiClient.token });
    window.location.hash = tabId;
    if (tabId === 'analytics') this.renderAnalytics();
    if (tabId === 'new-estimate') this.renderWizardSidebar();
    this.toggleSidebar(false);
  },

  applyTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    const tabId = TAB_IDS.includes(hash) ? hash : this.state.activeTab;
    this.setActiveTab(tabId);
  },

  toggleSidebar(force) {
    const next = typeof force === 'boolean' ? force : !this.state.sidebarOpen;
    this.state.sidebarOpen = next;
    this.elements.shell?.classList.toggle('is-sidebar-open', next);
  },

  scheduleDraftSave() {
    clearTimeout(this._draftTimer);
    this._draftTimer = setTimeout(() => this.saveDraft(false), 350);
  },

  saveDraft(notify = false) {
    const payload = sanitizeEstimateInput(estimateState);
    storage.saveDraftEstimate(payload);
    if (notify) showToast({ title: 'Draft saved', message: 'Your estimate draft has been stored locally.', tone: 'success' });
  },

  confirmResetDraft() {
    confirmDialog({ title: 'Discard draft estimate?', message: 'This clears the current wizard state and removes the locally saved draft.', confirmText: 'Discard draft', tone: 'danger' })
      .then((confirmed) => { if (confirmed) this.resetEstimateDraftAndRoute(); });
  },

  resetEstimateDraftAndRoute() {
    this.resetEstimateDraft();
    this.setActiveTab('new-estimate');
  },

  resetEstimateDraft() {
    estimateState = createInitialEstimateState();
    storage.clearDraftEstimate();
    this.state.wizardStep = 1;
    this.syncFormWithState();
    this.renderWizardSidebar();
    this.renderWizardStep();
    showToast({ title: 'Draft cleared', message: 'A fresh estimate is ready.', tone: 'info' });
  },

  writeFieldToState(field) {
    const { name, type } = field;
    const value = type === 'checkbox' ? field.checked : field.value;
    const [section, property, index, nestedProperty] = name.split('.');
    if (!section || !(section in estimateState)) return;

    if (typeof index !== 'undefined') {
      const target = estimateState[section][property] || [];
      target[index] = { ...(target[index] || {}), [nestedProperty]: type === 'number' ? Number(value) : value };
      estimateState[section][property] = target;
      return;
    }

    if (property) estimateState[section][property] = type === 'number' ? Number(value) : value;
  },

  syncFormWithState() {
    const form = this.elements.estimateForm;
    if (!form) return;
    [...form.elements].forEach((field) => {
      if (!field.name) return;
      const [section, property, index, nestedProperty] = field.name.split('.');
      const source = estimateState[section];
      if (!source) return;
      let value = source[property];
      if (typeof index !== 'undefined') value = source[property]?.[index]?.[nestedProperty];
      if (field.type === 'checkbox') field.checked = Boolean(value);
      else if (value !== undefined && value !== null) field.value = value;
    });
    this.renderWizardStep();
  },

  advanceWizard() {
    const errors = validateWizardStep(this.state.wizardStep, estimateState);
    applyValidationToForm(this.elements.estimateForm, errors);
    if (errors.length) {
      showToast({ title: 'Step needs attention', message: errors[0].message, tone: 'warning' });
      return;
    }
    this.state.wizardStep = Math.min(this.state.wizardStep + 1, 5);
    storage.saveSession({ ...storage.loadSession({}), activeTab: this.state.activeTab, wizardStep: this.state.wizardStep, token: apiClient.token });
    this.renderWizardStep();
  },

  retreatWizard() {
    this.state.wizardStep = Math.max(this.state.wizardStep - 1, 1);
    storage.saveSession({ ...storage.loadSession({}), activeTab: this.state.activeTab, wizardStep: this.state.wizardStep, token: apiClient.token });
    this.renderWizardStep();
  },

  renderWizardStep() {
    this.elements.wizardSteps.forEach((stepElement) => {
      const step = Number(stepElement.dataset.wizardStep);
      stepElement.classList.toggle('is-active', step === this.state.wizardStep);
      stepElement.classList.toggle('is-complete', step < this.state.wizardStep);
    });
    this.elements.wizardSections.forEach((section) => { section.hidden = Number(section.dataset.wizardPanel) !== this.state.wizardStep; });
    if (this.elements.wizardProgress) this.elements.wizardProgress.textContent = `Step ${this.state.wizardStep} of 5`;
    this.renderWizardSidebar();
  },

  getCurrentBundle() {
    return calculateEstimateBundle({
      ...estimateState.specifications,
      ...estimateState.measurements,
      laborRate: estimateState.pricing.laborRate,
      fenceType: normalizeFenceType(estimateState.specifications.fenceType),
      gates: estimateState.measurements.gates,
    }, {
      laborRate: estimateState.pricing.laborRate,
      overheadPercent: estimateState.pricing.overheadPercent,
      profitPercent: estimateState.pricing.profitPercent,
      taxPercent: estimateState.pricing.taxPercent,
      discountAmount: estimateState.pricing.discountAmount,
    });
  },

  renderWizardSidebar() {
    const bundle = this.getCurrentBundle();
    if (this.elements.wizardSummary) {
      this.elements.wizardSummary.innerHTML = `
        <div class="summary-card__row"><span class="summary-card__label">Customer</span><span class="summary-card__value">${estimateState.customer.firstName || 'New'} ${estimateState.customer.lastName || 'Estimate'}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Fence Type</span><span class="summary-card__value">${estimateState.specifications.fenceType}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Linear Feet</span><span class="summary-card__value">${formatNumber(bundle.materials.metrics.linearFeet)} LF</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Posts Needed</span><span class="summary-card__value">${formatNumber(bundle.materials.metrics.posts)}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Labor Hours</span><span class="summary-card__value">${formatNumber(bundle.labor.adjustedHours)}</span></div>
      `;
    }
    if (this.elements.wizardTotals) {
      this.elements.wizardTotals.innerHTML = `
        <div class="summary-card__row"><span class="summary-card__label">Materials</span><span class="summary-card__value">${formatCurrency(bundle.pricing.materialsSubtotal, this.state.settings.currency, this.state.settings.locale)}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Labor</span><span class="summary-card__value">${formatCurrency(bundle.pricing.laborSubtotal, this.state.settings.currency, this.state.settings.locale)}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Equipment</span><span class="summary-card__value">${formatCurrency(bundle.pricing.equipmentSubtotal, this.state.settings.currency, this.state.settings.locale)}</span></div>
        <div class="summary-card__row"><span class="summary-card__label">Overhead & Profit</span><span class="summary-card__value">${formatCurrency(bundle.pricing.overhead + bundle.pricing.profit, this.state.settings.currency, this.state.settings.locale)}</span></div>
        <div class="summary-card__row summary-card__row--grand-total"><span class="summary-card__label">Total</span><span class="summary-card__value">${formatCurrency(bundle.pricing.total, this.state.settings.currency, this.state.settings.locale)}</span></div>
      `;
    }
  },

  async submitEstimateWizard(button) {
    const errors = validateEstimateState(estimateState);
    applyValidationToForm(this.elements.estimateForm, errors);
    if (errors.length) {
      showToast({ title: 'Estimate incomplete', message: errors[0].message, tone: 'warning' });
      return;
    }

    const payload = sanitizeEstimateInput(estimateState);
    const bundle = this.getCurrentBundle();
    const projectRecord = {
      projectId: `PRJ-${Date.now()}`,
      customerName: `${payload.customer.firstName} ${payload.customer.lastName}`.trim(),
      city: payload.customer.city,
      fenceType: payload.specifications.fenceType,
      linearFeet: payload.measurements.linearFeet,
      total: bundle.pricing.total,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setButtonBusy(button, true, 'Saving estimate…');
    showLoading('Saving estimate and refreshing dashboard…');

    try {
      this.state.projects.unshift(projectRecord);
      this.state.estimates.unshift({
        estimateId: `${projectRecord.projectId}-EST`,
        customerName: projectRecord.customerName,
        fenceType: projectRecord.fenceType,
        total: bundle.pricing.total,
        projectId: projectRecord.projectId,
        materialsSubtotal: bundle.pricing.materialsSubtotal,
        pricing: bundle.pricing,
        materials: bundle.materials,
        createdAt: projectRecord.createdAt,
      });
      storage.saveProjects(this.state.projects);
      storage.appendActivity({ title: 'Estimate saved', detail: `${projectRecord.customerName} • ${projectRecord.linearFeet} LF ${projectRecord.fenceType}`, timestamp: projectRecord.createdAt, tone: 'success' });
      storage.clearDraftEstimate();
      this.state.activity = storage.loadActivityFeed();
      this.renderAll();
      this.setActiveTab('projects');
      showToast({ title: 'Estimate created', message: `Proposal total ${formatCurrency(bundle.pricing.total)} is ready to review.`, tone: 'success' });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to save estimate.';
      showToast({ title: 'Save failed', message, tone: 'danger' });
    } finally {
      hideLoading();
      setButtonBusy(button, false);
    }
  },

  prefillEstimateFromProject(projectId) {
    const project = this.state.projects.find((entry) => entry.projectId === projectId);
    if (!project) return;
    estimateState.customer.firstName = project.customerName.split(' ')[0] || '';
    estimateState.customer.lastName = project.customerName.split(' ').slice(1).join(' ');
    estimateState.customer.city = project.city || '';
    estimateState.specifications.fenceType = normalizeFenceType(project.fenceType);
    estimateState.measurements.linearFeet = project.linearFeet || 100;
    this.state.wizardStep = 1;
    this.syncFormWithState();
    this.setActiveTab('new-estimate');
    showToast({ title: 'Project loaded', message: `${project.customerName} was loaded into the estimate wizard.`, tone: 'info' });
  },

  async removeProject(projectId) {
    const confirmed = await confirmDialog({ title: 'Delete project?', message: 'This removes the project from the local frontend workspace. Continue?', confirmText: 'Delete project', tone: 'danger' });
    if (!confirmed) return;
    this.state.projects = this.state.projects.filter((entry) => entry.projectId !== projectId);
    this.state.estimates = this.state.estimates.filter((entry) => entry.projectId !== projectId);
    storage.saveProjects(this.state.projects);
    this.renderDashboard();
    this.renderProjects();
    this.renderAnalytics();
    showToast({ title: 'Project removed', message: `Project ${projectId} has been removed.`, tone: 'success' });
  },

  persistSettingsFromForm() {
    const form = this.elements.settingsForm;
    if (!form) return;
    const formData = new FormData(form);
    const nextSettings = {
      ...this.state.settings,
      companyName: formData.get('companyName') || this.state.settings.companyName,
      currency: formData.get('currency') || this.state.settings.currency,
      locale: formData.get('locale') || this.state.settings.locale,
      defaultLaborRate: Number(formData.get('defaultLaborRate') || this.state.settings.defaultLaborRate),
      defaultTaxPercent: Number(formData.get('defaultTaxPercent') || this.state.settings.defaultTaxPercent),
      defaultProfitPercent: Number(formData.get('defaultProfitPercent') || this.state.settings.defaultProfitPercent),
      defaultOverheadPercent: Number(formData.get('defaultOverheadPercent') || this.state.settings.defaultOverheadPercent),
      autoSaveDrafts: formData.get('autoSaveDrafts') === 'on',
    };
    this.state.settings = nextSettings;
    storage.saveSettings(nextSettings);
    this.renderWizardSidebar();
  },

  renderAll() {
    this.renderDashboard();
    this.renderProjects();
    this.renderInventory();
    this.renderMaterials();
    this.renderSuppliers();
    this.renderAnalytics();
    this.renderWizardStep();
    this.renderSettings();
  },

  renderDashboard() {
    if (this.elements.dashboardKpis) {
      const wonProjects = this.state.projects.filter((project) => ['active', 'contract', 'approved', 'won'].includes(String(project.status).toLowerCase())).length;
      const revenue = this.state.projects.reduce((sum, project) => sum + Number(project.total || 0), 0);
      this.elements.dashboardKpis.innerHTML = `
        <div class="metric-tile"><div class="metric-tile__label">Open Estimates</div><div class="metric-tile__value">${formatNumber(this.state.projects.length)}</div><div class="metric-tile__delta">${formatNumber(this.state.projects.filter((project) => project.status === 'pending').length)} pending follow-up</div></div>
        <div class="metric-tile"><div class="metric-tile__label">Revenue Pipeline</div><div class="metric-tile__value">${formatCurrency(revenue)}</div><div class="metric-tile__delta">Across ${formatNumber(this.state.estimates.length)} active quotes</div></div>
        <div class="metric-tile"><div class="metric-tile__label">Won Projects</div><div class="metric-tile__value">${formatNumber(wonProjects)}</div><div class="metric-tile__delta">${formatNumber(wonProjects)} scheduled or active</div></div>
        <div class="metric-tile"><div class="metric-tile__label">Inventory SKUs</div><div class="metric-tile__value">${formatNumber(this.state.inventorySnapshot.totalSkus)}</div><div class="metric-tile__delta">${formatNumber(this.state.inventorySnapshot.lowStockItems)} low-stock alerts</div></div>
      `;
    }

    if (this.elements.activityList) {
      this.elements.activityList.innerHTML = this.state.activity.map((item) => `
        <div class="activity-item">
          <div class="activity-item__icon">${item.tone === 'warning' ? '⚠' : item.tone === 'info' ? 'ⓘ' : '✓'}</div>
          <div><p class="activity-item__title">${item.title}</p><p class="activity-item__meta">${item.detail}</p></div>
          <div class="activity-item__time">${formatDate(item.timestamp)}</div>
        </div>
      `).join('');
    }
  },

  renderProjects() {
    if (!this.elements.projectsTable) return;
    if (!this.state.projects.length) {
      this.elements.projectsTable.innerHTML = renderEmptyState({ icon: '📋', title: 'No projects yet', copy: 'Use the estimate wizard to create your first proposal.' });
      return;
    }
    this.elements.projectsTable.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Project</th><th>Customer</th><th>Fence</th><th>Linear Feet</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${this.state.projects.map((project) => `
            <tr>
              <td><strong>${project.projectId}</strong><div class="text-muted">${formatDate(project.createdAt)}</div></td>
              <td>${project.customerName}<div class="text-muted">${project.city || 'Unassigned city'}</div></td>
              <td>${project.fenceType}</td>
              <td>${formatNumber(project.linearFeet)}</td>
              <td class="price-cell">${formatCurrency(project.total)}</td>
              <td>${renderStatus(project.status, String(project.status).replace(/(^.|-.)/g, (match) => match.replace('-', ' ').toUpperCase()))}</td>
              <td><div class="table-actions"><button class="btn btn--secondary" data-action="edit-project:${project.projectId}">Edit</button><button class="btn btn--ghost" data-action="delete-project:${project.projectId}">Delete</button></div></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderInventory() {
    if (!this.elements.inventoryTable) return;
    const rows = searchInventory(this.state.filters.inventorySearch, { category: this.state.filters.inventoryCategory, lowStockOnly: false }).slice(0, 24);
    this.elements.inventoryTable.innerHTML = `
      <table class="data-table">
        <thead><tr><th>SKU</th><th>Item</th><th>Category</th><th>Supplier</th><th>Stock</th><th>Unit Cost</th></tr></thead>
        <tbody>
          ${rows.map((item) => {
            const stockClass = item.stock <= 50 ? 'is-low' : item.stock <= 150 ? 'is-medium' : 'is-good';
            return `<tr><td><strong>${item.sku}</strong></td><td>${item.name}</td><td>${item.category}</td><td>${item.supplier}</td><td><span class="inventory-table__stock ${stockClass}">${formatNumber(item.stock)}</span></td><td class="price-cell">${formatCurrency(item.cost)}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  renderMaterials() {
    if (!this.elements.materialsList) return;
    const bundle = this.getCurrentBundle();
    this.elements.materialsList.innerHTML = bundle.materials.lineItems.slice(0, 16).map((item) => `
      <div class="material-line-item">
        <div><div class="material-line-item__title">${item.label}</div><div class="material-line-item__meta">SKU ${item.sku || 'Custom'} • ${item.supplier || 'Mixed supplier'}</div></div>
        <div>${formatNumber(item.quantity)} ${item.unit}</div>
        <div class="price-cell">${formatCurrency(item.extendedCost)}</div>
      </div>
    `).join('');
  },

  renderSuppliers() {
    if (!this.elements.suppliersList) return;
    this.elements.suppliersList.innerHTML = this.state.suppliers.map((supplier) => `
      <article class="supplier-card">
        <div class="supplier-card__header"><div><h3 class="supplier-card__title">${supplier.name}</h3><p class="supplier-card__subtitle">${supplier.specialty}</p></div>${renderStatus(supplier.status)}</div>
        <div class="project-card__meta"><div class="meta-value"><span class="meta-value__label">Lead Time</span><span class="meta-value__content">${supplier.leadTimeDays} days</span></div><div class="meta-value"><span class="meta-value__label">Primary Contact</span><span class="meta-value__content">${supplier.phone}</span></div></div>
      </article>
    `).join('');
  },

  renderAnalytics() {
    const summary = buildAnalyticsSummary(this.state.estimates, this.state.projects);
    if (this.elements.analyticsSummary) {
      this.elements.analyticsSummary.innerHTML = `
        <div class="stat-strip__item"><div class="stat-strip__label">Revenue</div><div class="stat-strip__value">${formatCurrency(summary.totalRevenue)}</div></div>
        <div class="stat-strip__item"><div class="stat-strip__label">Material Cost</div><div class="stat-strip__value">${formatCurrency(summary.totalMaterialCost)}</div></div>
        <div class="stat-strip__item"><div class="stat-strip__label">Close Rate</div><div class="stat-strip__value">${Math.round(summary.closeRate * 100)}%</div></div>
      `;
    }
    chartManager.renderAll({ revenue: this.elements.analyticsRevenue, jobsByType: this.elements.analyticsJobs, materialCosts: this.elements.analyticsMaterials, closeRate: this.elements.analyticsCloseRate, supplierSpend: this.elements.analyticsSupplierSpend, margin: this.elements.analyticsMargin }, { projects: this.state.projects, estimates: this.state.estimates }).catch(console.error);
  },

  renderSettings() {
    const form = this.elements.settingsForm;
    if (!form) return;
    const mapping = {
      companyName: this.state.settings.companyName,
      currency: this.state.settings.currency,
      locale: this.state.settings.locale,
      defaultLaborRate: this.state.settings.defaultLaborRate,
      defaultTaxPercent: this.state.settings.defaultTaxPercent,
      defaultProfitPercent: this.state.settings.defaultProfitPercent,
      defaultOverheadPercent: this.state.settings.defaultOverheadPercent,
      autoSaveDrafts: this.state.settings.autoSaveDrafts,
    };
    Object.entries(mapping).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (!field) return;
      if (field.type === 'checkbox') field.checked = Boolean(value);
      else field.value = value;
    });
  },

  async tryHealthCheck() {
    try {
      const payload = await apiClient.health();
      return payload?.status || 'OK';
    } catch {
      return 'Offline';
    }
  },

  async hydrateRemoteData() {
    try {
      const status = await this.tryHealthCheck();
      if (status !== 'OK') return;
    } catch {
      return;
    }
  },
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => App.init());
}

if (typeof window !== 'undefined') {
  window.FenceEstimatorApp = App;
  window.estimateState = estimateState;
}
