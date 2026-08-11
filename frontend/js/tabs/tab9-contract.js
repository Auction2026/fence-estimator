/**
 * tab9-contract.js – Contract tab with price lock and signatures
 */
const Tab9Contract = (() => {
  let state;

  function init(appState) {
    state = appState;
    document.addEventListener('tabActivated', (e) => {
      if (e.detail.tabId === 'tab9') loadContract();
    });
    document.getElementById('btn-customer-sign')?.addEventListener('click', customerSign);
    document.getElementById('btn-company-sign')?.addEventListener('click', companySign);
    document.getElementById('btn-print-contract')?.addEventListener('click', () => window.print());
    document.getElementById('btn-export-contract')?.addEventListener('click', () => {
      if (window.ExportTool) ExportTool.exportPDF('contract-document', 'contract');
      else UI.showNotification('PDF export: install jsPDF library', 'info');
    });
    loadContract();
  }

  function loadContract() {
    const c = Storage.loadContract();
    if (!c || !c.contractNumber) { UI.setText('contract-number', 'Generate from Estimate tab first'); return; }
    UI.setText('contract-number', c.contractNumber);
    UI.setText('contract-date', UI.formatDate(c.createdAt));
    UI.setText('contract-customer', c.customerName || '--');
    UI.setText('contract-address', c.address || '--');
    UI.setHTML('contract-scope', c.scopeOfWork || '--');
    UI.setHTML('contract-materials', c.materials || '--');
    UI.setText('contract-timeline', c.timeline || '--');
    UI.setText('contract-total', Calculations.formatCurrency(c.totalPrice));
    UI.setText('contract-deposit', Calculations.formatCurrency(c.depositAmount));
    UI.setText('contract-balance', Calculations.formatCurrency(c.finalBalance));
    if (c.customerSignature) {
      UI.setHTML('customer-sig-display', `<em>${c.customerSignature}</em>`);
      UI.setText('customer-sign-date', `Signed: ${UI.formatDate(c.customerSignDate)}`);
    }
    if (c.companySignature) {
      UI.setHTML('company-sig-display', `<em>${c.companySignature}</em>`);
      UI.setText('company-sign-date', `Signed: ${UI.formatDate(c.companySignDate)}`);
    }
  }

  function customerSign() {
    const name = UI.getValue('customer-signature').trim();
    if (!name) { alert('Please type customer full name to sign'); return; }
    const c = Storage.loadContract();
    c.customerSignature = name;
    c.customerSignDate = new Date().toISOString();
    Storage.saveContract(c);
    UI.setHTML('customer-sig-display', `<em>${name}</em>`);
    UI.setText('customer-sign-date', `Signed: ${new Date().toLocaleDateString()}`);
    UI.showNotification('Customer signature recorded', 'success');
  }

  function companySign() {
    const name = UI.getValue('company-signature').trim();
    if (!name) { alert('Please type representative name to sign'); return; }
    const c = Storage.loadContract();
    c.companySignature = name;
    c.companySignDate = new Date().toISOString();
    Storage.saveContract(c);
    UI.setHTML('company-sig-display', `<em>${name}</em>`);
    UI.setText('company-sign-date', `Signed: ${new Date().toLocaleDateString()}`);
    UI.showNotification('Company signature recorded', 'success');
  }

  return { init };
})();
