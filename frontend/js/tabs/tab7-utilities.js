/**
 * TAB 7 - Utilities Locate
 * frontend/js/tabs/tab7-utilities.js
 */

'use strict';

var Tab7Utilities = (function () {

  var UTILITIES = [
    { id: 'electric',   label: 'Electric / Power',   icon: '⚡' },
    { id: 'gas',        label: 'Natural Gas',         icon: '🔥' },
    { id: 'water',      label: 'Water / Sewer',       icon: '💧' },
    { id: 'phone',      label: 'Telephone / Cable',   icon: '📞' },
    { id: 'fiber',      label: 'Fiber Optic',         icon: '🌐' },
    { id: 'irrigation', label: 'Irrigation System',   icon: '🌿' },
    { id: 'septic',     label: 'Septic System',       icon: '🪣' },
  ];

  var FORM_ID = 'form-utilities';

  function init() {
    renderUtilitiesChecklist();
    loadSavedData();
    bindEvents();
  }

  function renderUtilitiesChecklist() {
    var container = document.getElementById('utilities-checklist');
    if (!container) return;
    container.innerHTML = UTILITIES.map(function (u) {
      return '<div class="form-group" style="display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid var(--border)">' +
        '<input type="checkbox" class="checklist-checkbox" id="util_' + u.id + '" name="util_' + u.id + '">' +
        '<span style="font-size:20px">' + u.icon + '</span>' +
        '<label for="util_' + u.id + '" style="font-size:14px;font-weight:600;flex:1">' + u.label + '</label>' +
        '<select class="form-control" name="util_status_' + u.id + '" style="max-width:160px">' +
          '<option value="not_needed">Not Needed</option>' +
          '<option value="pending">Pending</option>' +
          '<option value="requested">Requested</option>' +
          '<option value="marked">Marked / Cleared</option>' +
        '</select>' +
        '</div>';
    }).join('');
  }

  function loadSavedData() {
    var utils = FenceApp.project.utilities || {};
    if (utils.items) {
      utils.items.forEach(function (item) {
        var cb = document.getElementById('util_' + item.id);
        if (cb) cb.checked = item.present;
        var sel = document.querySelector('[name="util_status_' + item.id + '"]');
        if (sel) sel.value = item.status || 'not_needed';
      });
    }
    UI.populateForm(FORM_ID, {
      call_811:        utils.call811       || false,
      call_date:       utils.callDate      || '',
      ticket_number:   utils.ticketNumber  || '',
      clearance_date:  utils.clearanceDate || '',
      locate_company:  utils.locateCompany || '',
      utilities_notes: utils.notes         || '',
    });
  }

  function bindEvents() {
    var btnSave = document.getElementById('btn-save-utilities');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function save() {
    var items = UTILITIES.map(function (u) {
      var cb  = document.getElementById('util_' + u.id);
      var sel = document.querySelector('[name="util_status_' + u.id + '"]');
      return {
        id:      u.id,
        label:   u.label,
        present: cb ? cb.checked : false,
        status:  sel ? sel.value : 'not_needed',
      };
    });

    var data = UI.getFormData(FORM_ID);

    FenceApp.project.utilities = {
      items:          items,
      call811:        data.call_811,
      callDate:       data.call_date,
      ticketNumber:   data.ticket_number,
      clearanceDate:  data.clearance_date,
      locateCompany:  data.locate_company,
      notes:          data.utilities_notes,
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Utilities information saved ✓', 'success');
  }

  return { init, save };

})();

window.Tab7Utilities = Tab7Utilities;
