// Permits tab
'use strict';

const Tab6 = {
  init() { this.form = document.getElementById('permitForm'); this.bindEvents(); this.load(); },
  bindEvents() { const saveButton = document.getElementById('savePermitBtn'); if (saveButton) saveButton.addEventListener('click', () => this.save()); },
  load() { const data = Storage.load('permit-data') || AppState.permit || {}; if (this.form) App.fillForm(this.form, data); },
  save() { if (!this.validate()) return false; const data = this.form ? App.collectFormData(this.form) : {}; AppState.permit = data; Storage.save('permit-data', data); showNotification('Permit information saved.', 'success'); return true; },
  validate() { return Validation.validateForm(this.form, { permitCost: { test: (value) => value === '' || Validation.validateNumeric(value), message: 'Permit cost must be numeric.' } }); }
};
window.Tab6 = Tab6;
