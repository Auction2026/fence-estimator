/* ═══════════════════════════════════════════════════════════════
   contracts.js – contract generation & tracking
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'contracts') return;
  loadContracts();
});

async function loadContracts(q = '') {
  let rows;
  try {
    rows = (await App.Api.get('/contracts?search=' + encodeURIComponent(q))).contracts || [];
  } catch (_) {
    rows = JSON.parse(localStorage.getItem('fd_contracts') || '[]');
    if (q) rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  }
  document.getElementById('contracts-body').innerHTML = rows.map(r => `
    <tr>
      <td>${App.escHtml(r.contractNum || r.id)}</td>
      <td>${App.escHtml(r.customerName || '')}</td>
      <td>${App.escHtml(App.fmtDate(r.createdAt))}</td>
      <td>${App.escHtml(App.fmtCurrency(r.total))}</td>
      <td>${App.escHtml(r.status || 'draft')}</td>
      <td>
        <button class="btn-sm btn-secondary" onclick="viewContract(${Number(r.id)})">View</button>
        <button class="btn-sm btn-primary"   onclick="printContract(${Number(r.id)})">Print</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="6">No contracts</td></tr>';
}

document.getElementById('contract-search').addEventListener('input', e => loadContracts(e.target.value));

document.getElementById('new-contract-btn').addEventListener('click', () => {
  const estimates = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
  const opts = estimates.map(e => `<option value="${Number(e.id)}">${App.escHtml(e.firstName)} ${App.escHtml(e.lastName)} – ${App.escHtml(App.fmtCurrency(e.grand))}</option>`).join('');
  App.Modal.open('New Contract from Estimate', `
    <div class="form-grid">
      <label class="full">Select Estimate
        <select id="nc-estimate">${opts || '<option>No estimates saved</option>'}</select>
      </label>
      <label>Contract Date <input id="nc-date" type="date" value="${new Date().toISOString().slice(0,10)}" /></label>
      <label>Payment Terms
        <select id="nc-terms">
          <option value="50/50">50% Down / 50% Completion</option>
          <option value="net30">Net 30</option>
          <option value="paid-full">Paid in Full Up Front</option>
        </select>
      </label>
    </div>`,
    `<button class="btn-primary" onclick="generateContract()">Generate Contract</button>`
  );
});

window.generateContract = function () {
  const estId = document.getElementById('nc-estimate').value;
  const estimates = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
  const est = estimates.find(e => String(e.id) === String(estId));
  if (!est) { App.toast('Estimate not found', 'error'); return; }

  const contract = {
    id: Date.now(),
    contractNum: 'C-' + String(Date.now()).slice(-6),
    customerName: `${est.firstName} ${est.lastName}`,
    total: est.grand,
    status: 'draft',
    createdAt: new Date().toISOString(),
    estimateId: est.id,
    terms: document.getElementById('nc-terms').value
  };
  try { App.Api.post('/contracts', contract); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_contracts') || '[]');
  all.push(contract);
  localStorage.setItem('fd_contracts', JSON.stringify(all));
  App.Modal.close();
  App.toast('Contract created', 'success');
  loadContracts();
};

window.viewContract = function (id) { App.toast('View contract #' + id, 'info'); };
window.printContract = function (id) { App.toast('Print contract #' + id + ' coming soon', 'info'); };
