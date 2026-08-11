(function () {
  const moduleName = 'Tab6';
  function init() {
    const panel = document.getElementById('tab6');
    if (!panel) return;
    panel.dataset.initialized = 'true';
  }
  function collectData() {
    const panel = document.getElementById('tab6');
    if (!panel) return {};
    const fields = panel.querySelectorAll('input, select, textarea');
    const data = {};
    fields.forEach((field, i) => {
      data[field.name || `field_${i}`] = field.value;
    });
    return data;
  }
  function validate() {
    const panel = document.getElementById('tab6');
    if (!panel) return [];
    const form = panel.querySelector('form');
    return form ? (window.Validation?.validateForm(form) || []) : [];
  }
  window[moduleName] = { title: 'Permits', init, collectData, validate };
  document.addEventListener('DOMContentLoaded', init);
})();
