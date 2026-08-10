// TAB 6: INVENTORY
function inventoryTabRefresh() {
  if (!state.inventory) state.inventory = [];
  renderInventoryTable(state.inventory);
}

function inventoryTabFilter(q) {
  const filtered = (state.inventory || []).filter(i =>
    i.desc.toLowerCase().includes(q.toLowerCase()) || i.plu.toLowerCase().includes(q.toLowerCase())
  );
  renderInventoryTable(filtered);
}

function renderInventoryTable(items) {
  const tbody = document.getElementById('inventoryTableBody');
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No inventory items.</td></tr>'; return;
  }
  tbody.innerHTML = items.map((item,i) => `
    <tr>
      <td>${item.plu}</td><td>${item.desc}</td><td>${item.dept||''}</td>
      <td>${item.uom||'EA'}</td><td>$${(item.cost||0).toFixed(2)}</td>
      <td>$${(item.price||0).toFixed(2)}</td><td>${item.qoh||0}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteInventoryItem(${i})">Del</button></td>
    </tr>`).join('');
}

function inventoryTabAddItem() {
  if (!state.inventory) state.inventory = [];
  state.inventory.push({ plu:'PLU-'+Date.now(), desc:'New Item', dept:'Misc', uom:'EA', cost:0, price:0, qoh:0 });
  saveState();
  inventoryTabRefresh();
}

function deleteInventoryItem(i) {
  state.inventory.splice(i, 1);
  saveState();
  inventoryTabRefresh();
}
