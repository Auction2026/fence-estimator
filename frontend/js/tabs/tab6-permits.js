/**
 * tab6-permits.js – Permits tab
 */
const Tab6Permits = (() => {
  function init() {
    const form = document.getElementById('form-permits');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = UI.getFormData('form-permits');
        Storage.savePermits(data);
        UI.setFormMessage('permits-msg', '✅ Permit information saved!', 'success');
      });
    }
    const saved = Storage.loadPermits();
    if (saved && Object.keys(saved).length > 0) UI.populateForm('form-permits', saved);
  }
  return { init };
})();
