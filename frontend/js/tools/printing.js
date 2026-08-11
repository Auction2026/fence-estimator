/**
 * printing.js – Print utilities for Fence Estimator Pro
 */
const PrintTool = (() => {
  function printEstimate() {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab8')?.classList.add('active');
    window.print();
  }

  function printContract() {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab9')?.classList.add('active');
    window.print();
  }

  function printChangeOrder() {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab12')?.classList.add('active');
    window.print();
  }

  function printSignOff() {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab13')?.classList.add('active');
    window.print();
  }

  // HTML escape helper to prevent XSS in document.write
  function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function printProjectSummary() {
    const proj = Storage.loadProject();
    const est  = Storage.loadEstimate();
    const win  = window.open('', '_blank');
    win.document.write('<html><head><title>Project Summary</title>' +
      '<style>body{font-family:sans-serif;padding:2rem;}h1{color:#1a3c6e;}table{border-collapse:collapse;width:100%;}' +
      'td,th{border:1px solid #ccc;padding:8px;}th{background:#1a3c6e;color:white;}</style></head><body>' +
      '<h1>Project Summary – ' + escHtml(proj.customerName || 'Unknown') + '</h1>' +
      '<p>Address: ' + escHtml(proj.address || '--') + ', ' + escHtml(proj.city || '') + ', ' + escHtml(proj.province || '') + '</p>' +
      '<p>Phone: ' + escHtml(proj.customerPhone || '--') + ' | Email: ' + escHtml(proj.customerEmail || '--') + '</p>' +
      '<h2>Estimate</h2>' +
      '<table><tr><th>Item</th><th>Amount</th></tr>' +
        '<tr><td>Material Cost</td><td>' + escHtml(Calculations.formatCurrency(est.materialCost)) + '</td></tr>' +
        '<tr><td>Labour Cost</td><td>' + escHtml(Calculations.formatCurrency(est.labourCost)) + '</td></tr>' +
        '<tr><td>Equipment</td><td>' + escHtml(Calculations.formatCurrency(est.equipmentCost)) + '</td></tr>' +
        '<tr><td>Subtotal</td><td>' + escHtml(Calculations.formatCurrency(est.subtotal)) + '</td></tr>' +
        '<tr><td>Tax</td><td>' + escHtml(Calculations.formatCurrency(est.tax)) + '</td></tr>' +
        '<tr><td><strong>TOTAL</strong></td><td><strong>' + escHtml(Calculations.formatCurrency(est.total)) + '</strong></td></tr>' +
      '</table>' +
      '<p style="margin-top:2rem;color:#666;font-size:12px;">Printed: ' + escHtml(new Date().toLocaleString()) + '</p>' +
      '</body></html>');
    win.document.close();
    win.print();
  }

  return { printEstimate, printContract, printChangeOrder, printSignOff, printProjectSummary };
})();
