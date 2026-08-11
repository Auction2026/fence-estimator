/**
 * tab13-signoff.js – Project Sign-Off tab
 */
const Tab13SignOff = (() => {
  function init() {
    const form = document.getElementById('form-signoff');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = UI.getFormData('form-signoff');
        data.customerSig   = document.getElementById('signoff-customer-sig')?.value;
        data.companySig    = document.getElementById('signoff-company-sig')?.value;
        data.custSigDate   = document.getElementById('signoff-customer-date')?.textContent;
        data.compSigDate   = document.getElementById('signoff-company-date')?.textContent;
        Storage.saveSignOff(data);
        UI.setFormMessage('signoff-msg', '✅ Project sign-off saved!', 'success');
        UI.showNotification('Project sign-off complete!', 'success');
      });
    }

    document.getElementById('btn-signoff-customer')?.addEventListener('click', () => {
      const name = document.getElementById('signoff-customer-sig')?.value.trim();
      if (!name) { alert('Enter customer name'); return; }
      const dateStr = `Signed: ${new Date().toLocaleDateString()}`;
      UI.setText('signoff-customer-date', dateStr);
      UI.showNotification('Customer signature recorded', 'success');
    });

    document.getElementById('btn-signoff-company')?.addEventListener('click', () => {
      const name = document.getElementById('signoff-company-sig')?.value.trim();
      if (!name) { alert('Enter representative name'); return; }
      const dateStr = `Signed: ${new Date().toLocaleDateString()}`;
      UI.setText('signoff-company-date', dateStr);
      UI.showNotification('Company signature recorded', 'success');
    });

    document.getElementById('btn-print-signoff')?.addEventListener('click', () => window.print());

    // Set today's date
    const completionDate = document.getElementById('completion-date');
    if (completionDate && !completionDate.value) completionDate.value = UI.todayISO();

    const saved = Storage.loadSignOff();
    if (saved && Object.keys(saved).length > 0) UI.populateForm('form-signoff', saved);
  }

  return { init };
})();
