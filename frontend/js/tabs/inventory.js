/* ═══════════════════════════════════════════════════════════════
   inventory.js – inventory management
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'inventory') return;
  loadInventory();
});

async function loadInventory(q = '') {
  let rows;
  try {
    rows = (await App.Api.get('/inventory?search=' + encodeURIComponent(q))).items || [];
  } catch (_) {
    rows = JSON.parse(localStorage.getItem('fd_inventory') || '[]');
    if (q) rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  }
  document.getElementById('inv-body').innerHTML = rows.map(r => `
    <tr class="${r.onHand <= r.reorderPt ? 'row-warn' : ''}">
      <td>${App.escHtml(r.plu)}</td>
      <td>${App.escHtml(r.desc)}</td>
      <td>${App.escHtml(r.dept)}</td>
      <td>${App.escHtml(r.onHand)}</td>
      <td>${App.escHtml(r.reorderPt)}</td>
      <td>${App.escHtml(App.fmtCurrency(r.price))}</td>
      <td>
        <button class="btn-sm btn-secondary inv-adj-btn" data-plu="${App.escHtml(r.plu)}">Adjust</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="7">No inventory loaded</td></tr>';

  // Attach adjust handlers after render
  document.querySelectorAll('.inv-adj-btn').forEach(btn => {
    btn.addEventListener('click', () => adjInventory(btn.dataset.plu));
  });
}

document.getElementById('inv-search').addEventListener('input', e => loadInventory(e.target.value));

document.getElementById('add-inv-btn').addEventListener('click', () => {
  App.Modal.open('Add Inventory Item', `
    <div class="form-grid">
      <label>PLU <input id="ai-plu" /></label>
      <label>Description <input id="ai-desc" /></label>
      <label>Department <input id="ai-dept" /></label>
      <label>On Hand <input id="ai-onhand" type="number" value="0" /></label>
      <label>Reorder Point <input id="ai-reorder" type="number" value="5" /></label>
      <label>Unit Price <input id="ai-price" type="number" step="0.01" /></label>
    </div>`,
    `<button class="btn-primary" onclick="saveInvItem()">Save</button>`
  );
});

window.saveInvItem = async function () {
  const item = {
    plu:      document.getElementById('ai-plu').value,
    desc:     document.getElementById('ai-desc').value,
    dept:     document.getElementById('ai-dept').value,
    onHand:   parseInt(document.getElementById('ai-onhand').value),
    reorderPt:parseInt(document.getElementById('ai-reorder').value),
    price:    parseFloat(document.getElementById('ai-price').value)
  };
  try { await App.Api.post('/inventory', item); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_inventory') || '[]');
  all.push(item);
  localStorage.setItem('fd_inventory', JSON.stringify(all));
  App.Modal.close();
  App.toast('Item saved', 'success');
  loadInventory();
};

window.adjInventory = function (plu) {
  const qty = prompt(`Adjust on-hand for ${plu} (+ add, - remove):`);
  if (qty === null) return;
  const all = JSON.parse(localStorage.getItem('fd_inventory') || '[]');
  const item = all.find(r => r.plu === plu);
  if (item) {
    item.onHand = Math.max(0, item.onHand + parseInt(qty || 0));
    localStorage.setItem('fd_inventory', JSON.stringify(all));
  }
  loadInventory();
};

document.getElementById('export-inv-btn').addEventListener('click', () => {
  const rows = JSON.parse(localStorage.getItem('fd_inventory') || '[]');
  const csv  = ['PLU,Description,Dept,OnHand,ReorderPt,Price',
    ...rows.map(r => `${r.plu},"${r.desc}",${r.dept},${r.onHand},${r.reorderPt},${r.price}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'inventory.csv';
  a.click();
});
