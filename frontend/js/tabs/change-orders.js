// TAB 9: CHANGE ORDERS
function changeOrdersTabRefresh() {
  renderChangeOrders();
}

function renderChangeOrders() {
  const list = document.getElementById('changeOrdersList');
  const orders = getCollection('changeOrders');
  if (!orders.length) { list.innerHTML = '<p class="empty-state">No change orders yet.</p>'; return; }
  list.innerHTML = orders.map(o => `
    <div class="list-item">
      <div><strong>${o.coNum}</strong> — ${o.projectName}<div style="font-size:.8rem">${o.description}</div></div>
      <div style="text-align:right"><strong>$${o.amount.toFixed(2)}</strong><br><span class="project-card-status status-${o.status}">${o.status}</span></div>
    </div>`).join('');
}

function changeOrdersTabNew() {
  const estimates = getCollection('estimates');
  app.openModal(`
    <h3>New Change Order</h3>
    <div class="form-group"><label>Project</label>
      <select id="coProject" class="form-control">
        ${estimates.map(e => `<option value="${e.estimateNum}">${e.estimateNum} — ${e.customer?.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Description</label><textarea id="coDesc" class="form-control" rows="3"></textarea></div>
    <div class="form-group"><label>Amount ($)</label><input id="coAmount" type="number" class="form-control" /></div>
    <button class="btn btn-primary" onclick="saveChangeOrder()">Save</button>`);
}

function saveChangeOrder() {
  const orders = getCollection('changeOrders');
  orders.push({
    id: Date.now(),
    coNum: `CO-${Date.now()}`,
    projectName: document.getElementById('coProject').value,
    description: document.getElementById('coDesc').value,
    amount: parseFloat(document.getElementById('coAmount').value) || 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  saveCollection('changeOrders', orders);
  app.closeModal(); renderChangeOrders(); app.toast('Change order saved!','success');
}
