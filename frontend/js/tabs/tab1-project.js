/**
 * tab1-project.js – Project Information tab logic
 */
const Tab1Project = (() => {
  let state;

  function init(appState) {
    state = appState;
    setupForm();
    loadSavedData();
  }

  function setupForm() {
    const form = document.getElementById('form-project');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validation.validateProjectForm()) {
        UI.setFormMessage('project-msg', 'Please fix the errors above.', 'error');
        return;
      }
      const data = UI.getFormData('form-project');
      state.project = data;
      Storage.saveProject(data);
      updateProjectLabel(data);
      UI.setFormMessage('project-msg', '✅ Project information saved!', 'success');
      UI.showNotification('Project info saved', 'success');
    });

    const btnClear = document.getElementById('btn-clear-project');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (UI.confirm('Clear all project information?')) {
          UI.clearForm('form-project');
          Storage.saveProject({});
          UI.setText('current-project-label', 'No Project Open');
        }
      });
    }
  }

  function loadSavedData() {
    const saved = Storage.loadProject();
    if (saved && Object.keys(saved).length > 0) {
      UI.populateForm('form-project', saved);
      updateProjectLabel(saved);
    }
    const dateEl = document.getElementById('estimate-date');
    if (dateEl && !dateEl.value) dateEl.value = UI.todayISO();
  }

  function updateProjectLabel(data) {
    const name = data.customerName || 'Unnamed Project';
    const addr = data.address ? ` – ${data.address}` : '';
    UI.setText('current-project-label', name + addr);
  }

  return { init };
})();
