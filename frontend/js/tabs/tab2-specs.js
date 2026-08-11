/**
 * tab2-specs.js – Fence Specifications tab logic
 */
const Tab2Specs = (() => {
  let state;

  function init(appState) {
    state = appState;
    setupForm();
    loadSavedData();
    setupAutoCalcPosts();
  }

  function setupForm() {
    const form = document.getElementById('form-specs');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validation.validateSpecsForm()) {
        UI.setFormMessage('specs-msg', 'Please fill required fields.', 'error');
        return;
      }
      const data = collectData();
      state.specs = data;
      Storage.saveSpecs(data);
      UI.setFormMessage('specs-msg', '✅ Fence specifications saved!', 'success');
      UI.showNotification('Specs saved – go to Estimate tab to calculate', 'success');
    });
  }

  function collectData() {
    const data = UI.getFormData('form-specs');
    // Convert checkboxes
    data.barbedWire    = document.getElementById('barbed-wire')?.checked || false;
    data.privacySlats  = document.getElementById('privacy-slats')?.checked || false;
    data.tensionWire   = document.getElementById('tension-wire')?.checked || false;
    return data;
  }

  function loadSavedData() {
    const saved = Storage.loadSpecs();
    if (saved && Object.keys(saved).length > 0) {
      UI.populateForm('form-specs', saved);
      if (saved.barbedWire)   { const el = document.getElementById('barbed-wire');    if (el) el.checked = true; }
      if (saved.privacySlats) { const el = document.getElementById('privacy-slats');  if (el) el.checked = true; }
      if (saved.tensionWire)  { const el = document.getElementById('tension-wire');   if (el) el.checked = true; }
    }
  }

  function setupAutoCalcPosts() {
    const lfEl = document.getElementById('linear-feet');
    const spacingEl = document.getElementById('post-spacing');
    const postsEl = document.getElementById('num-posts');
    if (!lfEl || !postsEl) return;
    function recalc() {
      const lf = parseFloat(lfEl.value) || 0;
      const spacing = parseFloat(spacingEl?.value || 8);
      if (lf > 0) postsEl.placeholder = `~${Math.ceil(lf / spacing) + 1} (auto)`;
    }
    lfEl.addEventListener('input', recalc);
    if (spacingEl) spacingEl.addEventListener('change', recalc);
  }

  return { init };
})();
