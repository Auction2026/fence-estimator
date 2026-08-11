// Utilities tab
'use strict';

const Tab7 = {
  storageKey: 'utilities-data',
  safetyChecklist: [
    'Call 811 before digging',
    'Mark locate flags and paint',
    'Review irrigation lines',
    'Confirm gas routing',
    'Verify overhead clearances',
    'Identify tree root zones',
    'Plan spoil pile storage',
    'Review traffic control needs',
    'Stage emergency contacts',
    'Hold pre-dig safety meeting'
  ],
  init() {
    this.leftBody = document.querySelector('#tab-7 .col.col-5 .card-body');
    this.rightBody = document.querySelector('#tab-7 .col.col-7 .card-body');
    this.renderChecklist();
    this.renderContactsTable();
    this.bindEvents();
    this.load();
  },
  defaultContacts() {
    return [
      { utilityType: '811', companyName: 'State Locate Center', phone: '800-555-0811', locateNumber: '' },
      { utilityType: 'Electric', companyName: 'Regional Electric', phone: '800-555-1101', locateNumber: '' }
    ];
  },
  bindEvents() {
    if (this.leftBody) {
      this.leftBody.addEventListener('input', App.debounce(() => this.save(false), 250));
      this.leftBody.addEventListener('change', () => this.save(false));
    }
    if (!this.rightBody) return;
    this.rightBody.addEventListener('click', (event) => {
      const addButton = event.target.closest('#addUtilityContactBtn');
      const deleteButton = event.target.closest('[data-delete-utility]');
      if (addButton) this.addUtilityContact();
      if (deleteButton) this.deleteUtilityContact(Number(deleteButton.dataset.deleteUtility));
    });
    this.rightBody.addEventListener('input', App.debounce(() => {
      this.syncContactsFromDom();
      this.save(false);
    }, 250));
  },
  renderChecklist() {
    if (!this.leftBody) return;
    this.leftBody.innerHTML = this.safetyChecklist.map((item, index) => `
      <div class="checkbox-row">
        <input type="checkbox" id="utilityChecklist${index + 1}" data-utility-check="${index}">
        <label for="utilityChecklist${index + 1}">${item}</label>
      </div>`).join('') + `
      <div class="form-group"><label class="form-label" for="locateRequestDate">Locate Request Date</label><input class="form-control" id="locateRequestDate" type="date"></div>
      <div class="form-group"><label class="form-label" for="digSafeNumber">Dig Safe Number</label><input class="form-control" id="digSafeNumber" type="text"></div>
      <div class="checkbox-row"><input type="checkbox" id="confirmationCheckbox"><label for="confirmationCheckbox">I confirm utilities are marked and safe to excavate.</label></div>`;
  },
  renderContactsTable() {
    if (!this.rightBody) return;
    this.rightBody.innerHTML = `
      <table class="table table-striped table-hover" id="utilityContactsTable">
        <thead><tr><th>Utility Type</th><th>Company</th><th>Phone</th><th>Locate #</th><th>Actions</th></tr></thead>
        <tbody id="utilityContactsBody"></tbody>
      </table>
      <button type="button" id="addUtilityContactBtn" class="btn btn-primary">Add Utility Contact</button>`;
  },
  getChecklistState() {
    return this.safetyChecklist.map((_, index) => {
      const box = document.getElementById(`utilityChecklist${index + 1}`);
      return Boolean(box && box.checked);
    });
  },
  applyChecklistState(data) {
    (data.safetyChecklist || []).forEach((checked, index) => {
      const box = document.getElementById(`utilityChecklist${index + 1}`);
      if (box) box.checked = Boolean(checked);
    });
    const dateField = document.getElementById('locateRequestDate');
    const digSafeField = document.getElementById('digSafeNumber');
    const confirmation = document.getElementById('confirmationCheckbox');
    if (dateField) dateField.value = data.locateRequestDate || '';
    if (digSafeField) digSafeField.value = data.digSafeNumber || '';
    if (confirmation) confirmation.checked = Boolean(data.confirmationCheckbox || data.locateConfirmed);
  },
  addUtilityContact(contact = {}) {
    AppState.utilities = AppState.utilities || {};
    const contacts = Array.isArray(AppState.utilities.utilityContacts) ? AppState.utilities.utilityContacts : [];
    contacts.push(Object.assign({ utilityType: '', companyName: '', phone: '', locateNumber: '' }, contact));
    AppState.utilities.utilityContacts = contacts;
    this.renderContactRows();
    this.save(false);
  },
  deleteUtilityContact(index) {
    AppState.utilities.utilityContacts.splice(index, 1);
    this.renderContactRows();
    this.save(false);
  },
  syncContactsFromDom() {
    const body = document.getElementById('utilityContactsBody');
    if (!body) return;
    AppState.utilities.utilityContacts = Array.from(body.querySelectorAll('tr')).map((row) => ({
      utilityType: row.querySelector('[data-field="utilityType"]').value,
      companyName: row.querySelector('[data-field="companyName"]').value,
      phone: row.querySelector('[data-field="phone"]').value,
      locateNumber: row.querySelector('[data-field="locateNumber"]').value
    }));
  },
  renderContactRows() {
    const body = document.getElementById('utilityContactsBody');
    if (!body) return;
    const contacts = (AppState.utilities && AppState.utilities.utilityContacts) || [];
    body.innerHTML = contacts.map((contact, index) => `
      <tr>
        <td><input class="form-control" data-field="utilityType" value="${contact.utilityType || ''}"></td>
        <td><input class="form-control" data-field="companyName" value="${contact.companyName || ''}"></td>
        <td><input class="form-control" data-field="phone" value="${contact.phone || ''}"></td>
        <td><input class="form-control" data-field="locateNumber" value="${contact.locateNumber || ''}"></td>
        <td><button type="button" class="btn btn-danger btn-sm" data-delete-utility="${index}">Delete</button></td>
      </tr>`).join('');
    if (!contacts.length) body.innerHTML = '<tr><td colspan="5">No utility contacts added.</td></tr>';
  },
  getData() {
    this.syncContactsFromDom();
    return {
      utilityContacts: (AppState.utilities && AppState.utilities.utilityContacts) || [],
      safetyChecklist: this.getChecklistState(),
      digSafeNumber: document.getElementById('digSafeNumber') ? document.getElementById('digSafeNumber').value.trim() : '',
      locateRequestDate: document.getElementById('locateRequestDate') ? document.getElementById('locateRequestDate').value : '',
      confirmationCheckbox: Boolean(document.getElementById('confirmationCheckbox') && document.getElementById('confirmationCheckbox').checked)
    };
  },
  load() {
    const stored = Storage.load(this.storageKey) || AppState.utilities || {};
    AppState.utilities = Object.assign({ utilityContacts: this.defaultContacts() }, stored);
    if (!Array.isArray(AppState.utilities.utilityContacts) || !AppState.utilities.utilityContacts.length) {
      AppState.utilities.utilityContacts = this.defaultContacts();
    }
    this.applyChecklistState(AppState.utilities);
    this.renderContactRows();
  },
  save(showToast = true) {
    AppState.utilities = this.getData();
    Storage.save(this.storageKey, AppState.utilities);
    if (showToast) UI.showNotification('Utility plan saved.', 'success');
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab7 = Tab7;
