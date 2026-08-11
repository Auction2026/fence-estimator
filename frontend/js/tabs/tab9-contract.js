// Contract tab
'use strict';

const Tab9 = {
  init() { this.bindEvents(); this.load(); },
  bindEvents() { const signButton = document.getElementById('signContractBtn'); const lockButton = document.getElementById('lockPriceBtn'); if (signButton) signButton.addEventListener('click', () => this.sign()); if (lockButton) lockButton.addEventListener('click', () => this.lockPrice()); },
  load() { const saved = Storage.load('contract'); if (saved) AppState.contract = saved; UI.renderContract(AppState.contract || {}); },
  sign() { const contract = Object.assign({}, AppState.contract || {}, { status: 'Signed', customerSignature: document.getElementById('contractCustomerSignature') ? document.getElementById('contractCustomerSignature').value : '', representativeSignature: document.getElementById('contractRepSignature') ? document.getElementById('contractRepSignature').value : '' }); App.setContract(contract); Storage.save('contract', contract); showNotification('Contract signed locally.', 'success'); },
  lockPrice() { const contract = Object.assign({}, AppState.contract || {}, { locked: true, status: (AppState.contract && AppState.contract.status) || 'Draft' }); App.setContract(contract); Storage.save('contract', contract); showNotification('Contract price locked.', 'warning'); },
  save() { Storage.save('contract', AppState.contract || {}); return true; },
  validate() { return true; }
};
window.Tab9 = Tab9;
