/**
 * tab10-extras.js – Extras / Add-ons tab
 */
const Tab10Extras = (() => {
  let state;
  let extras = [];

  function init(appState) {
    state = appState;
    extras = Storage.loadExtras();
    renderTable();
    document.getElementById('btn-add-extra')?.addEventListener('click', addRow);
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        extras.push({ desc: btn.dataset.desc, qty: 1, unit: btn.dataset.unit, unitPrice: parseFloat(btn.dataset.price) });
        Storage.saveExtras(extras);
        renderTable();
      });
    });
  }

  function addRow() {
    const desc = prompt('Description:');
    if (!desc) return;
    const qty   = parseFloat(prompt('Quantity:', '1')) || 1;
    const unit  = prompt('Unit (e.g. LF, each):', 'each') || 'each';
    const price = parseFloat(prompt('Unit Price ($):', '0')) || 0;
    extras.push({ desc, qty, unit, unitPrice: price });
    Storage.saveExtras(extras);
    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('extras-tbody');
    if (!tbody) return;
    if (extras.length === 0) { UI.setTableEmpty('extras-tbody', 'No extras added yet.', 7); updateTotal(); return; }
    tbody.innerHTML = '';
    extras.forEach((e, i) => {
      const total = (parseFloat(e.qty) * parseFloat(e.unitPrice)).toFixed(2);
      UI.appendRow('extras-tbody', [
        i+1, e.desc, e.qty, e.unit,
        Calculations.formatCurrency(e.unitPrice),
        `<strong>${Calculations.formatCurrency(total)}</strong>`,
        `<button class="btn btn-sm btn-danger" onclick="Tab10Extras.remove(${i})">🗑️</button>`
      ]);
    });
    updateTotal();
  }

  function remove(i) {
    extras.splice(i, 1);
    Storage.saveExtras(extras);
    renderTable();
  }

  function updateTotal() {
    const total = Calculations.calcExtrasTotal(extras);
    UI.setText('extras-total', Calculations.formatCurrency(total));
  }

  return { init, remove };
})();
