/**
 * TAB 12 - Change Orders
 * frontend/js/tabs/tab12-changeorder.js
 */

'use strict';

var Tab12ChangeOrder = (function () {

  var changeOrders = [];
  var FORM_ID = 'form-change-order';

  function init() {
    loadSavedData();
    renderList();
    bindEvents();
  }

  function loadSavedData() {
    changeOrders = FenceApp.project.changeOrders
      ? JSON.parse(JSON.stringify(FenceApp.project.changeOrders))
      : [];
  }

  function renderList() {
    var container = document.getElementById('change-orders-list');
    if (!container) return;

    if (changeOrders.length === 0) {
      container.innerHTML = '<p class="text-muted text-center" style="padding:24px">No change orders yet.</p>';
      updateTotals();
      return;
    }

    container.innerHTML = changeOrders.map(function (co, i) {
      var cls = co.approved ? 'badge-success' : (co.denied ? 'badge-danger' : 'badge-warning');
      var status = co.approved ? 'Approved' : (co.denied ? 'Denied' : 'Pending');
      return '<div class="card" style="margin-bottom:12px">' +
        '<div class="card-header">' +
          '<span class="card-title">CO-' + String(i + 1).padStart(3, '0') + ' — ' + UI.escapeHtml(co.description || 'Change Order') + '</span>' +
          '<span class="badge ' + cls + '">' + status + '</span>' +
        '</div>' +
        '<div style="padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">' +
          '<div><div class="form-label">Amount</div><div class="fw-bold">' + formatCurrency(co.amount) + '</div></div>' +
          '<div><div class="form-label">Requested</div><div>' + formatDate(co.requestedAt) + '</div></div>' +
          '<div><div class="form-label">Reason</div><div>' + UI.escapeHtml(co.reason || '--') + '</div></div>' +
        '</div>' +
        '<div style="padding:0 16px 16px;display:flex;gap:8px">' +
          (!co.approved && !co.denied
            ? '<button class="btn btn-sm btn-success" onclick="Tab12ChangeOrder.approve(' + i + ')">✓ Approve</button>' +
              '<button class="btn btn-sm btn-danger" onclick="Tab12ChangeOrder.deny(' + i + ')">✗ Deny</button>'
            : '') +
          '<button class="btn btn-sm btn-outline" onclick="Tab12ChangeOrder.remove(' + i + ')">🗑 Delete</button>' +
        '</div>' +
        '</div>';
    }).join('');

    updateTotals();
  }

  function approve(index) {
    if (!changeOrders[index]) return;
    changeOrders[index].approved   = true;
    changeOrders[index].denied     = false;
    changeOrders[index].approvedAt = new Date().toISOString();
    renderList();
    UI.showToast('Change order approved', 'success');
  }

  function deny(index) {
    if (!changeOrders[index]) return;
    changeOrders[index].approved = false;
    changeOrders[index].denied   = true;
    changeOrders[index].deniedAt = new Date().toISOString();
    renderList();
    UI.showToast('Change order denied', 'warning');
  }

  function remove(index) {
    if (!window.confirm('Delete this change order?')) return;
    changeOrders.splice(index, 1);
    renderList();
  }

  function updateTotals() {
    var approved = changeOrders.filter(function (co) { return co.approved; });
    var total    = approved.reduce(function (s, co) { return s + (parseFloat(co.amount) || 0); }, 0);
    UI.setCurrency('co-approved-total', total);
    UI.setText('co-count', changeOrders.length + ' orders');
    UI.setText('co-approved-count', approved.length + ' approved');
  }

  function bindEvents() {
    var btnNew = document.getElementById('btn-new-co');
    if (btnNew) btnNew.addEventListener('click', function () { UI.openModal('modal-change-order'); });

    var btnSubmit = document.getElementById('btn-submit-co');
    if (btnSubmit) btnSubmit.addEventListener('click', submitNewCO);

    var btnSave = document.getElementById('btn-save-co');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function submitNewCO() {
    var data = UI.getFormData(FORM_ID);
    if (!data.co_description || !data.co_amount) {
      UI.showToast('Description and amount are required', 'error');
      return;
    }
    changeOrders.push({
      description: data.co_description,
      amount:      parseFloat(data.co_amount) || 0,
      reason:      data.co_reason,
      requestedAt: new Date().toISOString(),
      approved:    false,
      denied:      false,
    });
    UI.clearForm(FORM_ID);
    UI.closeModal('modal-change-order');
    renderList();
    save();
    UI.showToast('Change order added', 'success');
  }

  function save() {
    FenceApp.project.changeOrders = changeOrders;
    Storage.saveProject(FenceApp.project);
    UI.showToast('Change orders saved ✓', 'success');
  }

  return { init, save, approve, deny, remove };

})();

window.Tab12ChangeOrder = Tab12ChangeOrder;
