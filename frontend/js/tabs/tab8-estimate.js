/**
 * tab8-estimate.js – Estimate tab with auto-calculation
 */
const Tab8Estimate = (() => {
  let state;
  let result = null;

  function init(appState) {
    state = appState;
    document.getElementById('btn-calculate')?.addEventListener('click', calculate);
    document.getElementById('btn-print-estimate')?.addEventListener('click', () => window.print());
    document.getElementById('btn-export-estimate-pdf')?.addEventListener('click', () => {
      if (window.ExportTool) ExportTool.exportPDF('estimate-table', 'estimate');
      else UI.showNotification('PDF export: install jsPDF library', 'info');
    });
    document.getElementById('btn-create-contract')?.addEventListener('click', createContract);

    document.addEventListener('tabActivated', (e) => {
      if (e.detail.tabId === 'tab8') loadHeader();
    });

    loadHeader();
    const saved = Storage.loadEstimate();
    if (saved && saved.lineItems) renderEstimate(saved);
  }

  function loadHeader() {
    const proj = Storage.loadProject();
    UI.setText('est-customer-name', proj.customerName || '--');
    UI.setText('est-address', [proj.address, proj.city, proj.province].filter(Boolean).join(', ') || '--');
    UI.setText('est-date', proj.estimateDate || UI.todayISO());
    UI.setText('est-valid', UI.futureDateISO(30));
    const num = Storage.loadEstimate()?.estimateNumber || '--';
    UI.setText('est-number', num);
  }

  function calculate() {
    const specs = Storage.loadSpecs();
    if (!specs || !specs.linearFeet) {
      UI.showNotification('Please fill in Fence Specifications (Tab 2) first', 'error');
      return;
    }
    const adjustments = {
      permitCost: parseFloat(UI.getValue('adj-permit')) || 0,
      contingencyPct: parseFloat(UI.getValue('adj-contingency')) || 5,
      discount: parseFloat(UI.getValue('adj-discount')) || 0
    };
    result = Calculations.calculate(specs, adjustments);
    if (!result) { UI.showNotification('Calculation failed – check specs', 'error'); return; }

    const estimateNumber = Storage.nextEstimateNumber();
    const proj = Storage.loadProject();
    const fullResult = { ...result, estimateNumber, customerName: proj.customerName, notes: UI.getValue('estimate-notes') };
    Storage.saveEstimate(fullResult);
    state.estimate = fullResult;
    UI.setText('est-number', estimateNumber);
    renderEstimate(fullResult);
    UI.showNotification('Estimate calculated!', 'success');
  }

  function renderEstimate(data) {
    if (!data || !data.lineItems) return;
    const tbody = document.getElementById('estimate-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.lineItems.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${item.desc}</td><td>${item.qty}</td><td>${item.unit}</td>
        <td>${Calculations.formatCurrency(item.unitCost)}</td>
        <td><strong>${Calculations.formatCurrency(item.total)}</strong></td>`;
      tbody.appendChild(tr);
    });
    UI.setText('est-subtotal', Calculations.formatCurrency(data.subtotal));
    UI.setText('est-tax', Calculations.formatCurrency(data.tax));
    UI.setText('est-total', Calculations.formatCurrency(data.total));
  }

  function createContract() {
    if (!state.estimate || !state.estimate.total) {
      UI.showNotification('Calculate estimate first', 'error'); return;
    }
    const proj = Storage.loadProject();
    const specs = Storage.loadSpecs();
    const contractNum = Storage.nextContractNumber();
    const deposit = state.estimate.total * 0.30;
    const balance = state.estimate.total - deposit;
    const contract = {
      contractNumber: contractNum,
      customerName: proj.customerName,
      address: [proj.address, proj.city, proj.province].filter(Boolean).join(', '),
      scopeOfWork: `Supply and install ${specs.linearFeet} linear feet of ${(specs.fenceType||'').replace(/-/g,' ')} fence, ${specs.height}ft height.`,
      materials: `${specs.fenceType} fence material, posts, concrete, hardware`,
      timeline: `Estimated ${state.estimate.projectDays || 3}-${(state.estimate.projectDays || 3)+2} working days`,
      totalPrice: state.estimate.total,
      depositAmount: deposit,
      finalBalance: balance,
      priceLocked: true,
      createdAt: new Date().toISOString()
    };
    Storage.saveContract(contract);
    state.contract = contract;
    UI.showNotification('Contract created! Go to Tab 9 to review.', 'success');
    App.switchToTab('tab9');
  }

  return { init };
})();
