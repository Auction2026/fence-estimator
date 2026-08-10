/* ═══════════════════════════════════════════════════════════════
   change-orders.js – change order management
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'change-orders') return;
  loadChangeOrders();
});

async function loadChangeOrders() {
  let rows;
  try {
    rows = (await App.Api.get('/change-orders')).changeOrders || [];
  } catch (_) {
    rows = JSON.parse(localStorage.getItem('fd_changeorders') || '[]');
  }
  document.getElementById('co-body').innerHTML = rows.map(r => `
    <tr>
      <td>${App.escHtml(r.coNum || r.id)}</td>
      <td>${App.escHtml(r.projectId || '')}</td>
      <td>${App.escHtml(App.fmtDate(r.createdAt))}</td>
      <td>${App.escHtml(r.description || '')}</td>
      <td>${App.escHtml(App.fmtCurrency(r.amount))}</td>
      <td>${App.escHtml(r.status || 'pending')}</td>
      <td>
        <button class="btn-sm btn-secondary" onclick="approveChangeOrder(${Number(r.id)})">Approve</button>
        <button class="btn-sm btn-danger"    onclick="deleteChangeOrder(${Number(r.id)})">Del</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="7">No change orders</td></tr>';
}

document.getElementById('new-co-btn').addEventListener('click', () => {
  const projects = JSON.parse(localStorage.getItem('fd_projects') || '[]');
  const opts = projects.map(p => `<option value="${Number(p.id)}">${App.escHtml(p.customerName)} – ${Number(p.id)}</option>`).join('');
  App.Modal.open('New Change Order', `
    <div class="form-grid">
      <label class="full">Project <select id="co-project">${opts || '<option>No projects</option>'}</select></label>
      <label class="full">Description <textarea id="co-desc" rows="3"></textarea></label>
      <label>Amount <input id="co-amount" type="number" step="0.01" /></label>
    </div>`,
    `<button class="btn-primary" onclick="saveChangeOrder()">Save</button>`
  );
});

window.saveChangeOrder = async function () {
  const co = {
    id: Date.now(),
    coNum: 'CO-' + String(Date.now()).slice(-5),
    projectId: document.getElementById('co-project').value,
    description: document.getElementById('co-desc').value,
    amount: parseFloat(document.getElementById('co-amount').value),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  try { await App.Api.post('/change-orders', co); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_changeorders') || '[]');
  all.push(co);
  localStorage.setItem('fd_changeorders', JSON.stringify(all));
  App.Modal.close();
  App.toast('Change order saved', 'success');
  loadChangeOrders();
};

window.approveChangeOrder = async function (id) {
  try { await App.Api.put('/change-orders/' + id, { status: 'approved' }); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_changeorders') || '[]');
  const item = all.find(r => r.id == id);
  if (item) item.status = 'approved';
  localStorage.setItem('fd_changeorders', JSON.stringify(all));
  App.toast('Change order approved', 'success');
  loadChangeOrders();
};

window.deleteChangeOrder = async function (id) {
  if (!confirm('Delete change order?')) return;
  try { await App.Api.del('/change-orders/' + id); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_changeorders') || '[]').filter(r => r.id != id);
  localStorage.setItem('fd_changeorders', JSON.stringify(all));
  loadChangeOrders();
};
