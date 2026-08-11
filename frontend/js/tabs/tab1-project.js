// Project information tab
'use strict';

const Tab1 = {
  storageKey: 'project-info-draft',
  init() {
    this.cache();
    this.bindEvents();
    this.load();
  },
  cache() {
    this.form = document.getElementById('projectInfoForm');
    this.fields = {
      customerName: document.getElementById('customerName'),
      customerEmail: document.getElementById('customerEmail'),
      customerPhone: document.getElementById('customerPhone'),
      customerCompany: document.getElementById('customerCompany') || document.getElementById('companyName'),
      addressStreet: document.getElementById('addressStreet'),
      addressCity: document.getElementById('addressCity'),
      addressState: document.getElementById('addressState'),
      addressZip: document.getElementById('addressZip'),
      propertyType: document.getElementById('propertyType'),
      projectType: document.getElementById('projectType'),
      startDate: document.getElementById('startDate') || document.getElementById('projectStartDate'),
      projectNotes: document.getElementById('projectNotes')
    };
  },
  bindEvents() {
    if (!this.form) return;
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.save();
    });
    const autosave = App.debounce(() => this.persistDraft(), 250);
    Object.values(this.fields).forEach((field) => {
      if (!field) return;
      field.addEventListener('input', autosave);
      field.addEventListener('change', autosave);
    });
  },
  getValue(name) {
    const field = this.fields[name];
    return field ? String(field.value || '').trim() : '';
  },
  setValue(name, value) {
    const field = this.fields[name];
    if (field) field.value = value == null ? '' : value;
  },
  getData() {
    const current = AppState.currentProject || {};
    const company = this.getValue('customerCompany');
    const startDate = this.getValue('startDate');
    return {
      projectId: current.projectId || App.nextProjectId(),
      customerName: this.getValue('customerName'),
      customerEmail: this.getValue('customerEmail'),
      customerPhone: this.getValue('customerPhone'),
      customerCompany: company,
      companyName: company,
      addressStreet: this.getValue('addressStreet'),
      addressCity: this.getValue('addressCity'),
      addressState: this.getValue('addressState'),
      addressZip: this.getValue('addressZip'),
      propertyType: this.getValue('propertyType') || 'Residential',
      projectType: this.getValue('projectType') || 'New Installation',
      startDate,
      projectStartDate: startDate,
      projectNotes: this.getValue('projectNotes'),
      createdAt: current.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  applyData(project) {
    if (!project) return;
    this.setValue('customerName', project.customerName);
    this.setValue('customerEmail', project.customerEmail);
    this.setValue('customerPhone', project.customerPhone);
    this.setValue('customerCompany', project.customerCompany || project.companyName);
    this.setValue('addressStreet', project.addressStreet);
    this.setValue('addressCity', project.addressCity);
    this.setValue('addressState', project.addressState);
    this.setValue('addressZip', project.addressZip);
    this.setValue('propertyType', project.propertyType);
    this.setValue('projectType', project.projectType);
    this.setValue('startDate', project.startDate || project.projectStartDate);
    this.setValue('projectNotes', project.projectNotes);
  },
  load() {
    const project = AppState.currentProject || Storage.loadProject() || Storage.load(this.storageKey) || {};
    if (!project.projectId) project.projectId = App.nextProjectId();
    AppState.currentProject = Object.assign({ createdAt: new Date().toISOString() }, AppState.currentProject || {}, project);
    this.applyData(AppState.currentProject);
  },
  persistDraft() {
    if (!this.form) return false;
    const draft = Object.assign({}, AppState.currentProject || {}, this.getData());
    AppState.currentProject = draft;
    Storage.saveProject(draft);
    Storage.save(this.storageKey, draft);
    App.updateLastSaved();
    return true;
  },
  async save() {
    if (!this.form || !this.validate()) return false;
    const data = this.getData();
    const hasExistingProject = Boolean((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id);
    UI.showLoading(this.form);
    try {
      let response = data;
      if (hasExistingProject) {
        const projectId = (AppState.currentProject.serverId || AppState.currentProject.id || data.projectId);
        response = await Api.updateProject(projectId, data);
      } else {
        response = await Api.createProject(data);
      }
      AppState.currentProject = Object.assign({}, AppState.currentProject || {}, data, response, {
        serverId: response.id || response.projectId || (AppState.currentProject || {}).serverId || data.projectId
      });
      Storage.saveProject(AppState.currentProject);
      Storage.save(this.storageKey, AppState.currentProject);
      App.updateLastSaved();
      UI.showNotification('Project information saved.', 'success');
      return true;
    } catch (error) {
      AppState.currentProject = Object.assign({}, AppState.currentProject || {}, data);
      Storage.saveProject(AppState.currentProject);
      Storage.save(this.storageKey, AppState.currentProject);
      UI.showNotification('Project saved locally; server sync pending.', 'warning');
      return true;
    } finally {
      UI.hideLoading(this.form);
    }
  },
  validate() {
    return Validation.validateForm(this.form, {
      customerName: { test: (value) => Validation.validateRequired(value), message: 'Customer name is required.' },
      customerEmail: { test: (value) => Validation.validateEmail(value), message: 'Enter a valid email address.' },
      customerPhone: { test: (value) => Validation.validatePhone(value), message: 'Enter a valid phone number.' },
      addressStreet: { test: (value) => Validation.validateRequired(value), message: 'Street address is required.' },
      addressCity: { test: (value) => Validation.validateRequired(value), message: 'City is required.' },
      addressState: { test: (value) => Validation.validateRequired(value), message: 'State is required.' },
      addressZip: { test: (value) => Validation.validateRequired(value), message: 'ZIP code is required.' }
    });
  }
};

window.Tab1 = Tab1;
