// Fence specifications tab
'use strict';

const Tab2 = {
  storageKey: 'fence-specs',
  init() {
    this.cache();
    this.bindEvents();
    this.load();
  },
  cache() {
    this.form = document.getElementById('fenceSpecsForm');
    this.fields = {
      fenceType: document.getElementById('fenceType'),
      fenceHeight: document.getElementById('fenceHeight'),
      fenceColor: document.getElementById('fenceColor'),
      linearFeet: document.getElementById('linearFeet'),
      numPosts: document.getElementById('numPosts'),
      numGates: document.getElementById('numGates') || document.getElementById('gateCount'),
      gateType: document.getElementById('gateType'),
      materialsGrade: document.getElementById('materialsGrade'),
      cornerPosts: document.getElementById('cornerPosts'),
      specialRequirements: document.getElementById('specSpecialRequirements')
    };
    this.saveButton = document.getElementById('specsSaveBtn');
    this.calculateButton = document.getElementById('specsCalculateBtn');
  },
  bindEvents() {
    if (!this.form) return;
    const autosave = App.debounce(() => this.save(false), 250);
    this.form.addEventListener('input', autosave);
    this.form.addEventListener('change', autosave);
    if (this.saveButton) this.saveButton.addEventListener('click', () => this.save(true));
    if (this.calculateButton) this.calculateButton.addEventListener('click', () => this.onCalculate());
    if (this.fields.linearFeet) {
      this.fields.linearFeet.addEventListener('input', () => this.updatePostCount());
    }
  },
  getValue(name) {
    const field = this.fields[name];
    return field ? field.value : '';
  },
  getNumber(name) {
    return App.safeNumber(this.getValue(name));
  },
  getData() {
    return {
      fenceType: this.getValue('fenceType') || 'Chain Link',
      height: this.getValue('fenceHeight') || '6ft',
      color: this.getValue('fenceColor'),
      linearFeet: this.getNumber('linearFeet'),
      numPosts: this.getNumber('numPosts'),
      gateCount: this.getNumber('numGates'),
      numGates: this.getNumber('numGates'),
      gateType: this.getValue('gateType') || 'Swing',
      materialsGrade: this.getValue('materialsGrade') || 'Standard',
      cornerPosts: this.getNumber('cornerPosts') || 4,
      specialRequirements: this.getValue('specialRequirements')
    };
  },
  applyData(specs) {
    if (!specs) return;
    if (this.fields.fenceType) this.fields.fenceType.value = specs.fenceType || 'Chain Link';
    if (this.fields.fenceHeight) this.fields.fenceHeight.value = specs.height || specs.fenceHeight || '6ft';
    if (this.fields.fenceColor) this.fields.fenceColor.value = specs.color || specs.fenceColor || '';
    if (this.fields.linearFeet) this.fields.linearFeet.value = specs.linearFeet || 0;
    if (this.fields.numPosts) this.fields.numPosts.value = specs.numPosts || 0;
    if (this.fields.numGates) this.fields.numGates.value = specs.numGates || specs.gateCount || 0;
    if (this.fields.gateType) this.fields.gateType.value = specs.gateType || 'Swing';
    if (this.fields.materialsGrade) this.fields.materialsGrade.value = specs.materialsGrade || 'Standard';
    if (this.fields.cornerPosts) this.fields.cornerPosts.value = specs.cornerPosts || 4;
    if (this.fields.specialRequirements) this.fields.specialRequirements.value = specs.specialRequirements || '';
  },
  load() {
    const specs = AppState.fenceSpecs || Storage.load(this.storageKey) || (AppState.estimate && AppState.estimate.specs) || {};
    AppState.fenceSpecs = Object.assign({}, AppState.fenceSpecs || {}, specs);
    this.applyData(AppState.fenceSpecs);
    this.updatePostCount(false);
    if (AppState.estimate && window.Tab8) Tab8.render(AppState.estimate);
  },
  updatePostCount(shouldSave = true) {
    const linearFeet = this.getNumber('linearFeet');
    const calculatedPosts = Math.max(2, Math.ceil(linearFeet / 8));
    if (this.fields.numPosts && (!this.fields.numPosts.value || shouldSave)) {
      this.fields.numPosts.value = calculatedPosts;
    }
    if (shouldSave) this.save(false);
  },
  getPermitCost() {
    const permit = AppState.permit || Storage.load('permit-data') || {};
    return App.safeNumber(permit.permitCost);
  },
  getExtrasTotal() {
    return (AppState.extraItems || []).reduce((sum, item) => sum + (App.safeNumber(item.quantity) * App.safeNumber(item.unitCost)), 0);
  },
  updatePreview(estimate) {
    const materialsNode = document.getElementById('materialsPreviewTotal');
    const laborNode = document.getElementById('laborPreviewTotal');
    const totalNode = document.getElementById('installedPreviewTotal');
    if (materialsNode) materialsNode.textContent = Calculator.formatCurrency((estimate.materials || {}).total || 0);
    if (laborNode) laborNode.textContent = Calculator.formatCurrency((estimate.labor || {}).total || 0);
    if (totalNode) totalNode.textContent = Calculator.formatCurrency((estimate.totals || estimate).total || 0);
  },
  async save(showToast = true) {
    if (!this.form || !this.validate()) return false;
    const data = this.getData();
    AppState.fenceSpecs = data;
    Storage.save(this.storageKey, data);
    const projectId = ((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id || (AppState.currentProject || {}).projectId || '');
    if (projectId) {
      try {
        await Api.saveFenceSpecs(projectId, data);
      } catch (_error) {
        if (showToast) UI.showNotification('Specs saved locally; API sync pending.', 'warning');
        return true;
      }
    }
    if (showToast) UI.showNotification('Fence specifications saved.', 'success');
    return true;
  },
  onCalculate() {
    if (!this.validate()) return false;
    const estimate = Calculator.generateBreakdown(Object.assign({}, this.getData(), {
      permitCost: this.getPermitCost(),
      extrasTotal: this.getExtrasTotal()
    }));
    AppState.estimate = estimate;
    Storage.saveEstimate(estimate);
    this.updatePreview(estimate);
    if (window.Tab8) Tab8.render(estimate);
    if (window.Tab9 && typeof Tab9.generateContract === 'function') Tab9.generateContract();
    UI.showNotification('Estimate preview updated.', 'success');
    return estimate;
  },
  calculate() {
    return this.onCalculate();
  },
  validate() {
    return Validation.validateForm(this.form, {
      linearFeet: { test: (value) => Validation.validateRange(value, 1, 100000), message: 'Enter linear feet greater than zero.' },
      numPosts: { test: (value) => Validation.validateRange(value, 1, 10000), message: 'Enter a valid post count.' },
      gateCount: { test: (value) => value === '' || Validation.validateRange(value, 0, 1000), message: 'Enter a valid gate count.' }
    });
  }
};

window.Tab2 = Tab2;
