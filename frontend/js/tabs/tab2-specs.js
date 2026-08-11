// Fence specs tab
'use strict';

const Tab2 = {
  init() { this.cache(); this.bindEvents(); this.load(); },
  cache() { this.form = document.getElementById('fenceSpecsForm'); },
  bindEvents() { if (!this.form) return; this.form.addEventListener('change', () => this.save(false)); const saveButton = document.getElementById('specsSaveBtn'); if (saveButton) saveButton.addEventListener('click', () => this.save(true)); },
  getData() {
    if (!this.form) return {};
    return { fenceType: this.form.fenceType.value, height: this.form.fenceHeight.value, color: this.form.fenceColor.value, linearFeet: App.safeNumber(this.form.linearFeet.value), numPosts: App.safeNumber(this.form.numPosts.value), gateCount: App.safeNumber(this.form.gateCount.value), gateType: this.form.gateType.value, materialsGrade: this.form.materialsGrade.value, cornerPosts: App.safeNumber(this.form.cornerPosts.value), specialSlope: App.safeNumber(this.form.specialSlope.value), specialRequirements: this.form.specSpecialRequirements.value };
  },
  calculate() {
    const data = this.getData();
    const permitCost = App.safeNumber(document.getElementById('permitCost') ? document.getElementById('permitCost').value : 0);
    const extrasTotal = App.safeNumber(document.getElementById('extrasGrandTotal') ? document.getElementById('extrasGrandTotal').textContent.replace(/[^\d.-]/g, '') : 0);
    const estimate = Calculator.generateBreakdown(Object.assign({}, data, { permitCost, extrasTotal }));
    App.setEstimate(estimate); const materialsPreview = document.getElementById('materialsPreviewTotal'); const laborPreview = document.getElementById('laborPreviewTotal'); const installedPreview = document.getElementById('installedPreviewTotal');
    if (materialsPreview) materialsPreview.textContent = formatCurrency(estimate.materials.total); if (laborPreview) laborPreview.textContent = formatCurrency(estimate.labor.total); if (installedPreview) installedPreview.textContent = formatCurrency(estimate.total);
    syncEstimateToContract(); showNotification('Estimate recalculated successfully.', 'success'); return estimate;
  },
  load() {
    if (!this.form) return;
    const specs = Storage.load('fence-specs') || (AppState.estimate && AppState.estimate.specs) || {};
    const mapping = { fenceType: 'fenceType', fenceHeight: 'height', fenceColor: 'color', linearFeet: 'linearFeet', numPosts: 'numPosts', gateCount: 'gateCount', gateType: 'gateType', materialsGrade: 'materialsGrade', cornerPosts: 'cornerPosts', specialSlope: 'specialSlope', specSpecialRequirements: 'specialRequirements' };
    Object.keys(mapping).forEach((fieldId) => { const field = document.getElementById(fieldId); const key = mapping[fieldId]; if (field && specs[key] != null) field.value = specs[key]; });
    if (AppState.estimate) UI.renderEstimate(AppState.estimate);
  },
  save(showToast = true) { if (!this.validate()) return false; const data = this.getData(); Storage.save('fence-specs', data); AppState.fenceSpecs = data; if (showToast) showNotification('Fence specifications saved.', 'success'); return true; },
  validate() { return Validation.validateForm(this.form, { linearFeet: { test: (value) => Validation.validateRange(value, 1, 100000), message: 'Enter linear feet greater than zero.' }, numPosts: { test: (value) => Validation.validateRange(value, 1, 10000), message: 'Enter a valid number of posts.' }, gateCount: { test: (value) => Validation.validateRange(value, 0, 1000), message: 'Enter a valid gate count.' } }); }
};
window.Tab2 = Tab2;
