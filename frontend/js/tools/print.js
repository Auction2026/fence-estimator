/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Print Helper
 */
'use strict';

function printCurrentTab() {
  const activePanel = document.querySelector('.tab-panel.active');
  if (!activePanel) { window.print(); return; }

  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <html><head><title>Fence Depot – Print</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12pt; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #999; padding: 4px 8px; }
      th { background: #1a6b3a; color: #fff; }
      @media print { body { margin: 0; } }
    </style></head><body>
    <h2>Fence Depot Fence Estimator</h2>
    <p>Estimate #: ${AppState.estimateNumber} | Date: ${new Date().toLocaleDateString()}</p>
    <p>Customer: ${AppState.projectInfo?.firstName || ''} ${AppState.projectInfo?.lastName || ''}</p>
    <hr>
    ${activePanel.innerHTML}
    </body></html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => { printWin.print(); printWin.close(); }, 500);
}
