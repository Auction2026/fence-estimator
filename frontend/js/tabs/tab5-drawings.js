(function () {
  const moduleName = 'Tab5';
  function init() {
    const panel = document.getElementById('tab5');
    if (!panel) return;
    panel.dataset.initialized = 'true';
  }
  function collectData() {
    const panel = document.getElementById('tab5');
    if (!panel) return {};
    const fields = panel.querySelectorAll('input, select, textarea');
    const data = {};
    fields.forEach((field, i) => {
      data[field.name || `field_${i}`] = field.value;
    });
    return data;
  }
  function validate() {
    const panel = document.getElementById('tab5');
    if (!panel) return [];
    const form = panel.querySelector('form');
    return form ? (window.Validation?.validateForm(form) || []) : [];
  }
  window[moduleName] = { title: 'Shop Drawings', init, collectData, validate };
  document.addEventListener('DOMContentLoaded', init);
})();
