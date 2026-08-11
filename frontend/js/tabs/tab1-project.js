// Project tab
'use strict';

const Tab1 = {
  init() { this.cache(); this.bindEvents(); this.load(); },
  cache() { this.root = document.getElementById('tab-1'); this.form = document.getElementById('projectInfoForm'); },
  bindEvents() { if (this.form) this.form.addEventListener('change', () => this.save()); },
  load() { if (this.form && AppState.currentProject) App.fillForm(this.form, AppState.currentProject); },
  save() {
    if (!this.form || !this.validate()) return false;
    const data = App.collectFormData(this.form);
    data.projectId = (AppState.currentProject && AppState.currentProject.projectId) || App.nextProjectId();
    data.updatedAt = new Date().toISOString();
    App.setCurrentProject(data); Storage.saveProject(AppState.currentProject); App.updateLastSaved(); showNotification('Project information saved.', 'success'); return true;
  },
  validate() { return Validation.validateForm(this.form, { customerName: { test: Validation.validateRequired.bind(Validation), message: 'Customer name is required.' }, customerEmail: { test: Validation.validateEmail.bind(Validation), message: 'Enter a valid email.' }, customerPhone: { test: Validation.validatePhone.bind(Validation), message: 'Enter a valid phone number.' }, addressStreet: { test: Validation.validateRequired.bind(Validation), message: 'Street address is required.' }, addressCity: { test: Validation.validateRequired.bind(Validation), message: 'City is required.' }, addressState: { test: Validation.validateRequired.bind(Validation), message: 'State is required.' }, addressZip: { test: Validation.validateRequired.bind(Validation), message: 'ZIP code is required.' } }); }
};
window.Tab1 = Tab1;
