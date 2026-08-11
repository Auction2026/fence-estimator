/**
 * tab7-utilities.js – Utilities Locate tab
 */
const Tab7Utilities = (() => {
  function init() {
    const form = document.getElementById('form-utilities');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = UI.getFormData('form-utilities');
        Storage.saveUtilities(data);
        UI.setFormMessage('utilities-msg', '✅ Utility information saved!', 'success');
      });
    }
    const saved = Storage.loadUtilities();
    if (saved && Object.keys(saved).length > 0) UI.populateForm('form-utilities', saved);
  }
  return { init };
})();
