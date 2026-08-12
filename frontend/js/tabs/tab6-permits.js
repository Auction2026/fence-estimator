/**
 * TAB 6 - Permits & Inspections
 * frontend/js/tabs/tab6-permits.js
 */

'use strict';

var Tab6Permits = (function () {

  var FORM_ID = 'form-permits';

  var PERMIT_TYPES = [
    'Building Permit', 'Zoning Permit', 'HOA Approval',
    'Right-of-Way Permit', 'Utility Clearance', 'Environmental Permit',
  ];

  var STATUSES = ['Not Required', 'Pending Application', 'Applied', 'Approved', 'Denied', 'Expired'];

  function init() {
    populateSelects();
    loadSavedData();
    bindEvents();
  }

  function populateSelects() {
    var typeEl = document.getElementById('permit_type');
    if (typeEl) {
      typeEl.innerHTML = PERMIT_TYPES.map(function (t) {
        return '<option value="' + t + '">' + t + '</option>';
      }).join('');
    }

    var statusEl = document.getElementById('permit_status');
    if (statusEl) {
      statusEl.innerHTML = STATUSES.map(function (s) {
        return '<option value="' + s + '">' + s + '</option>';
      }).join('');
    }
  }

  function loadSavedData() {
    var permits = FenceApp.project.permits || {};
    UI.populateForm(FORM_ID, {
      permit_type:        permits.type        || '',
      permit_status:      permits.status      || 'Not Required',
      permit_number:      permits.number      || '',
      permit_applied:     permits.appliedDate || '',
      permit_approved:    permits.approvedDate|| '',
      permit_expires:     permits.expiresDate || '',
      permit_fee:         permits.fee         || '',
      inspection_date1:   permits.inspection1 || '',
      inspection_date2:   permits.inspection2 || '',
      inspection_final:   permits.inspFinal   || '',
      permit_notes:       permits.notes       || '',
      hoa_required:       permits.hoaRequired || false,
      hoa_status:         permits.hoaStatus   || 'Not Required',
    });
    updateStatusBadge(permits.status);
  }

  function bindEvents() {
    var statusEl = document.getElementById('permit_status');
    if (statusEl) statusEl.addEventListener('change', function () { updateStatusBadge(statusEl.value); });

    var btnSave = document.getElementById('btn-save-permits');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function updateStatusBadge(status) {
    var badge = document.getElementById('permit-status-badge');
    if (!badge) return;
    var classMap = {
      'Not Required': 'badge-gray',
      'Pending Application': 'badge-warning',
      'Applied': 'badge-info',
      'Approved': 'badge-success',
      'Denied': 'badge-danger',
      'Expired': 'badge-danger',
    };
    badge.className = 'badge ' + (classMap[status] || 'badge-gray');
    badge.textContent = status || 'Unknown';
  }

  function save() {
    var data = UI.getFormData(FORM_ID);
    FenceApp.project.permits = {
      type:         data.permit_type,
      status:       data.permit_status,
      number:       data.permit_number,
      appliedDate:  data.permit_applied,
      approvedDate: data.permit_approved,
      expiresDate:  data.permit_expires,
      fee:          parseFloat(data.permit_fee) || 0,
      inspection1:  data.inspection_date1,
      inspection2:  data.inspection_date2,
      inspFinal:    data.inspection_final,
      notes:        data.permit_notes,
      hoaRequired:  data.hoa_required,
      hoaStatus:    data.hoa_status,
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Permit information saved ✓', 'success');
  }

  return { init, save };

})();

window.Tab6Permits = Tab6Permits;
