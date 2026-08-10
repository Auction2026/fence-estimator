/* ═══════════════════════════════════════════════════════════════
   print.js – print / PDF helper
   ═══════════════════════════════════════════════════════════════ */
'use strict';

window.App = window.App || {};

function _esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

App.printEstimate = function (id) {
  const estimates = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
  const est = estimates.find(e => String(e.id) === String(id));
  if (!est) { App.toast('Estimate not found', 'error'); return; }
  const win = window.open('', '_blank');
  const company = JSON.parse(localStorage.getItem('fd_company') || '{}');
  const rows = (est.items || []).map(i => `
    <tr>
      <td>${_esc(i.plu)}</td><td>${_esc(i.desc)}</td><td>${_esc(i.qty)}</td>
      <td>${_esc(i.unit)}</td><td>$${Number(i.price).toFixed(2)}</td>
      <td>$${Number(i.qty * i.price).toFixed(2)}</td>
    </tr>`).join('');
  win.document.write(`<!DOCTYPE html><html><head><title>Estimate</title>
    <style>
      body{font-family:Arial,sans-serif;margin:40px;color:#111}
      h1{color:#1a6b3c} table{width:100%;border-collapse:collapse;margin-top:16px}
      th{background:#e8f5ee;padding:7px} td{padding:6px;border-bottom:1px solid #ddd}
      .total{font-size:1.1rem;font-weight:bold;color:#1a6b3c}
    </style></head><body>
    <div class="print-header">
      <h1>${_esc(company.name || 'Fence Depot')}</h1>
      <p>${_esc(company.phone || '')} | License: ${_esc(company.license || '')}</p>
      <h2>ESTIMATE</h2>
    </div>
    <p><strong>Customer:</strong> ${_esc(est.firstName)} ${_esc(est.lastName)}</p>
    <p>${_esc(est.address)}, ${_esc(est.city)}, ${_esc(est.state)} ${_esc(est.zip)}</p>
    <p><strong>Fence Type:</strong> ${_esc(est.fenceType)} | Height: ${_esc(est.height)}ft | Footage: ${_esc(est.footage)}ft</p>
    <table><thead><tr><th>PLU</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit $</th><th>Total</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="total" style="text-align:right;margin-top:16px">
      Materials: $${Number(est.subtotal||0).toFixed(2)} |
      Labor: $${Number(est.labor||0).toFixed(2)} |
      Markup: $${Number(est.markup||0).toFixed(2)} |
      <strong>TOTAL: $${Number(est.grand||0).toFixed(2)}</strong>
    </p>
    <script>window.print();window.close();<\/script>
    </body></html>`);
  win.document.close();
};
