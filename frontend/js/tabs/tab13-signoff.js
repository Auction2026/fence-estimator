// Sign-off tab
'use strict';

const Tab13 = {
  init() { this.bindEvents(); this.load(); },
  bindEvents() { const button = document.getElementById('submitSignOffBtn'); if (button) button.addEventListener('click', () => this.save()); },
  collect() { return { completionDate: document.getElementById('completionDate') ? document.getElementById('completionDate').value : '', outstandingItems: document.getElementById('outstandingItems') ? document.getElementById('outstandingItems').value : '', customerSignature: document.getElementById('customerSignoffSignature') ? document.getElementById('customerSignoffSignature').value : '', contractorSignature: document.getElementById('contractorSignoffSignature') ? document.getElementById('contractorSignoffSignature').value : '' }; },
  load() { const data = Storage.load('signoff-data') || {}; if (document.getElementById('completionDate')) document.getElementById('completionDate').value = data.completionDate || ''; if (document.getElementById('outstandingItems')) document.getElementById('outstandingItems').value = data.outstandingItems || ''; if (document.getElementById('customerSignoffSignature')) document.getElementById('customerSignoffSignature').value = data.customerSignature || ''; if (document.getElementById('contractorSignoffSignature')) document.getElementById('contractorSignoffSignature').value = data.contractorSignature || ''; },
  save() { if (!this.validate()) return false; const data = this.collect(); AppState.signOff = data; Storage.save('signoff-data', data); const status = document.getElementById('signOffStatusDisplay'); if (status) status.textContent = 'Submitted'; showNotification('Sign-off submitted locally.', 'success'); return true; },
  validate() { const dateNode = document.getElementById('completionDate'); if (!dateNode) return true; if (!dateNode.value) return true; return Validation.validateDate(dateNode.value); }
};
window.Tab13 = Tab13;
