// Change orders tab
'use strict';

const Tab12 = {
  init() { this.body = document.getElementById('changeOrdersTableBody'); this.bindEvents(); this.load(); },
  bindEvents() { const createButton = document.getElementById('createChangeOrderBtn'); if (createButton) createButton.addEventListener('click', () => this.create()); if (this.body) this.body.addEventListener('click', (event) => { const row = event.target.closest('tr'); if (!row) return; if (event.target.matches('.approve-co-btn')) this.setStatus(row, 'Approved'); if (event.target.matches('.reject-co-btn')) this.setStatus(row, 'Rejected'); }); },
  create() { const description = document.getElementById('changeOrderDescription').value; const reason = document.getElementById('changeOrderReason').value; const costImpact = App.safeNumber(document.getElementById('changeOrderCostImpact').value); const timelineImpact = document.getElementById('changeOrderTimelineImpact').value; const entry = { id: `CO-${String((AppState.changeOrders || []).length + 1).padStart(3, '0')}`, description, reason, costImpact, timelineImpact, status: 'Pending' }; AppState.changeOrders = (AppState.changeOrders || []).concat(entry); this.render(); this.save(); },
  setStatus(row, status) { const id = row.firstElementChild.textContent; AppState.changeOrders = (AppState.changeOrders || []).map((item) => item.id === id ? Object.assign({}, item, { status }) : item); this.render(); this.save(); },
  render() { if (!this.body) return; this.body.innerHTML = ''; (AppState.changeOrders || []).forEach((item) => { this.body.insertAdjacentHTML('beforeend', `<tr><td>${item.id}</td><td>${item.description}</td><td>${item.reason}</td><td>${formatCurrency(item.costImpact)}</td><td>${item.timelineImpact}</td><td><span class="badge badge-primary">${item.status}</span></td><td><button type="button" class="btn btn-success btn-sm approve-co-btn">Approve</button> <button type="button" class="btn btn-danger btn-sm reject-co-btn">Reject</button></td></tr>`); }); },
  load() { AppState.changeOrders = Storage.load('change-orders') || AppState.changeOrders || []; this.render(); },
  save() { Storage.save('change-orders', AppState.changeOrders || []); showNotification('Change orders updated.', 'success'); return true; },
  validate() { return true; }
};
window.Tab12 = Tab12;
