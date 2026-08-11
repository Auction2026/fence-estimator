/**
 * tab12-changeorder.js – Change Orders tab
 */
const Tab12ChangeOrder = (() => {
  let cos = [];

  function init() {
    cos = Storage.loadChangeOrders();
    renderTable();
    document.getElementById('btn-add-change-order')?.addEventListener('click', () => UI.showModal('co-modal'));
    document.getElementById('btn-save-co')?.addEventListener('click', saveCO);
    document.getElementById('btn-cancel-co')?.addEventListener('click', () => UI.hideModal('co-modal'));
    // Update new total on change
    ['co-material-change','co-labour-change'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', updateCOTotal);
    });
  }

  function updateCOTotal() {
    const contract = Storage.loadContract();
    const base = contract?.totalPrice || 0;
    const mDelta = parseFloat(UI.getValue('co-material-change')) || 0;
    const lDelta = parseFloat(UI.getValue('co-labour-change')) || 0;
    const newTotal = Calculations.applyChangeOrder(base, mDelta, lDelta);
    UI.setText('co-new-total', Calculations.formatCurrency(newTotal));
  }

  function saveCO() {
    const desc = UI.getValue('co-description');
    if (!desc) { alert('Description required'); return; }
    const contract = Storage.loadContract();
    const mDelta = parseFloat(UI.getValue('co-material-change')) || 0;
    const lDelta = parseFloat(UI.getValue('co-labour-change')) || 0;
    const newTotal = Calculations.applyChangeOrder(contract?.totalPrice || 0, mDelta, lDelta);
    const co = {
      number: Storage.nextChangeOrderNumber(),
      date: UI.getValue('co-date') || UI.todayISO(),
      description: desc,
      reason: UI.getValue('co-reason'),
      materialDelta: mDelta,
      labourDelta: lDelta,
      timeline: UI.getValue('co-timeline'),
      newTotal,
      customerSig: UI.getValue('co-customer-sig'),
      status: UI.getValue('co-customer-sig') ? 'approved' : 'pending'
    };
    cos.push(co);
    Storage.saveChangeOrders(cos);
    renderTable();
    UI.hideModal('co-modal');
    UI.showNotification(`Change Order ${co.number} created`, 'success');
  }

  function renderTable() {
    if (cos.length === 0) { UI.setTableEmpty('change-orders-tbody', 'No change orders created.', 8); return; }
    const tbody = document.getElementById('change-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    cos.forEach((co, i) => {
      UI.appendRow('change-orders-tbody', [
        co.number, co.date, co.description,
        Calculations.formatCurrency(co.materialDelta),
        Calculations.formatCurrency(co.labourDelta),
        `<strong>${Calculations.formatCurrency(co.newTotal)}</strong>`,
        `<span class="badge">${co.status}</span>`,
        `<button class="btn btn-sm btn-danger" onclick="Tab12ChangeOrder.remove(${i})">🗑️</button>`
      ]);
    });
  }

  function remove(i) {
    if (!UI.confirm('Remove change order?')) return;
    cos.splice(i, 1);
    Storage.saveChangeOrders(cos);
    renderTable();
  }

  return { init, remove };
})();
