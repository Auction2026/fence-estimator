// Utilities tab
'use strict';

const Tab7 = {
  init() { this.bindEvents(); this.load(); },
  bindEvents() { const checkbox = document.getElementById('locateConfirmed'); if (checkbox) checkbox.addEventListener('change', () => this.save()); },
  collect() { return { locateRequestDate: document.getElementById('locateRequestDate') ? document.getElementById('locateRequestDate').value : '', digSafeNumber: document.getElementById('digSafeNumber') ? document.getElementById('digSafeNumber').value : '', locateConfirmed: document.getElementById('locateConfirmed') ? document.getElementById('locateConfirmed').checked : false }; },
  load() { const data = Storage.load('utilities-data') || {}; if (document.getElementById('locateRequestDate')) document.getElementById('locateRequestDate').value = data.locateRequestDate || ''; if (document.getElementById('digSafeNumber')) document.getElementById('digSafeNumber').value = data.digSafeNumber || ''; if (document.getElementById('locateConfirmed')) document.getElementById('locateConfirmed').checked = Boolean(data.locateConfirmed); },
  save() { const data = this.collect(); AppState.utilities = data; Storage.save('utilities-data', data); return true; },
  validate() { return true; }
};
window.Tab7 = Tab7;
