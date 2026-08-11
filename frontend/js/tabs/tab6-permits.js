// Permits tab
'use strict';

const Tab6 = {
  storageKey: 'permit-data',
  checklist: [
    'Property survey attached',
    'HOA approval attached',
    'Site plan verified',
    'Utility locate scheduled',
    'Setbacks reviewed',
    'Wind load calculations attached',
    'Engineer stamp provided',
    'Insurance certificate submitted'
  ],
  init() {
    this.prepareFields();
    this.cache();
    this.renderChecklist();
    this.bindEvents();
    this.load();
  },
  prepareFields() {
    const permitTypeField = document.getElementById('permitType');
    if (permitTypeField && permitTypeField.tagName !== 'SELECT') {
      const select = document.createElement('select');
      select.id = 'permitType';
      select.name = 'permitType';
      select.className = permitTypeField.className;
      ['Building', 'Zoning', 'HOA', 'None Required'].forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      permitTypeField.replaceWith(select);
    }
  },
  cache() {
    this.form = document.getElementById('permitForm');
    this.fields = {
      permitNumber: document.getElementById('permitNumber'),
      permitType: document.getElementById('permitType'),
      jurisdiction: document.getElementById('jurisdiction') || document.getElementById('permitJurisdiction'),
      applicationDate: document.getElementById('applicationDate') || document.getElementById('permitApplicationDate'),
      approvalDate: document.getElementById('approvalDate') || document.getElementById('permitApprovalDate'),
      permitCost: document.getElementById('permitCost'),
      permitStatus: document.getElementById('permitStatus')
    };
    this.checklistContainer = document.querySelector('#tab-6 .col.col-6:last-child .card-body');
    this.saveButton = document.getElementById('savePermitBtn');
  },
  bindEvents() {
    if (this.form) {
      const autosave = App.debounce(() => this.save(false), 250);
      this.form.addEventListener('input', autosave);
      this.form.addEventListener('change', autosave);
    }
    if (this.checklistContainer) {
      this.checklistContainer.addEventListener('change', () => this.save(false));
    }
    if (this.saveButton) this.saveButton.addEventListener('click', () => this.save(true));
  },
  renderChecklist() {
    if (!this.checklistContainer) return;
    this.checklistContainer.innerHTML = this.checklist.map((item, index) => `
      <div class="checkbox-row">
        <input type="checkbox" id="permitRequirement${index + 1}" data-permit-check="${index}">
        <label for="permitRequirement${index + 1}">${item}</label>
      </div>`).join('') +
      '<div class="small-text mt-3">Permit costs feed the estimate automatically.</div>';
  },
  getData() {
    return {
      permitNumber: this.fields.permitNumber ? this.fields.permitNumber.value.trim() : '',
      permitType: this.fields.permitType ? this.fields.permitType.value : 'Building',
      jurisdiction: this.fields.jurisdiction ? this.fields.jurisdiction.value.trim() : '',
      applicationDate: this.fields.applicationDate ? this.fields.applicationDate.value : '',
      approvalDate: this.fields.approvalDate ? this.fields.approvalDate.value : '',
      permitCost: App.safeNumber(this.fields.permitCost && this.fields.permitCost.value),
      permitStatus: this.fields.permitStatus ? this.fields.permitStatus.value : 'Draft',
      checklist: this.checklist.map((_, index) => {
        const box = document.getElementById(`permitRequirement${index + 1}`);
        return Boolean(box && box.checked);
      })
    };
  },
  applyData(data) {
    if (!data) return;
    if (this.fields.permitNumber) this.fields.permitNumber.value = data.permitNumber || '';
    if (this.fields.permitType) this.fields.permitType.value = data.permitType || 'Building';
    if (this.fields.jurisdiction) this.fields.jurisdiction.value = data.jurisdiction || '';
    if (this.fields.applicationDate) this.fields.applicationDate.value = data.applicationDate || '';
    if (this.fields.approvalDate) this.fields.approvalDate.value = data.approvalDate || '';
    if (this.fields.permitCost) this.fields.permitCost.value = App.safeNumber(data.permitCost) || '';
    if (this.fields.permitStatus) this.fields.permitStatus.value = data.permitStatus || 'Draft';
    (data.checklist || []).forEach((checked, index) => {
      const box = document.getElementById(`permitRequirement${index + 1}`);
      if (box) box.checked = Boolean(checked);
    });
  },
  calculatePermitCost() {
    AppState.permit = Object.assign({}, AppState.permit || {}, this.getData());
    if (!AppState.estimate) return 0;
    AppState.estimate.specs = Object.assign({}, AppState.estimate.specs || {}, { permitCost: App.safeNumber(AppState.permit.permitCost) });
    AppState.estimate.totals = Calculator.calculateTotal(
      AppState.estimate.materials,
      AppState.estimate.labor,
      AppState.estimate.equipment,
      AppState.estimate.concrete,
      App.safeNumber(AppState.permit.permitCost),
      (AppState.extraItems || []).reduce((sum, item) => sum + App.safeNumber(item.quantity) * App.safeNumber(item.unitCost), 0)
    );
    AppState.estimate.total = AppState.estimate.totals.total;
    Storage.saveEstimate(AppState.estimate);
    if (window.Tab8) Tab8.render(AppState.estimate);
    return App.safeNumber(AppState.permit.permitCost);
  },
  load() {
    const permit = Storage.load(this.storageKey) || AppState.permit || {};
    AppState.permit = Object.assign({}, AppState.permit || {}, permit);
    this.applyData(AppState.permit);
    this.calculatePermitCost();
  },
  save(showToast = true) {
    AppState.permit = this.getData();
    Storage.save(this.storageKey, AppState.permit);
    this.calculatePermitCost();
    if (showToast) UI.showNotification('Permit record saved.', 'success');
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab6 = Tab6;
