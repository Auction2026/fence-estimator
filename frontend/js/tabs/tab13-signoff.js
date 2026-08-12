/**
 * TAB 13 - Sign-Off / Completion
 * frontend/js/tabs/tab13-signoff.js
 */

'use strict';

var Tab13Signoff = (function () {

  var sigCanvas, sigCtx, signing = false;

  var CHECKLIST_ITEMS = [
    'All fence panels installed correctly',
    'All posts plumb and properly set',
    'Gates hang level and latch properly',
    'Hardware tightened and secured',
    'Concrete cured and finished',
    'Site debris removed and cleaned up',
    'Customer walk-through completed',
    'All permits closed and signed',
    'Final photos taken',
    'Customer satisfied with work',
  ];

  function init() {
    renderChecklist();
    loadSavedData();
    initSignaturePad();
    bindEvents();
  }

  function renderChecklist() {
    var container = document.getElementById('signoff-checklist');
    if (!container) return;
    container.innerHTML = '<ul class="checklist">' +
      CHECKLIST_ITEMS.map(function (item, i) {
        return '<li>' +
          '<input type="checkbox" class="checklist-checkbox" id="signoff_check_' + i + '" name="signoff_check_' + i + '">' +
          '<label class="checklist-label" for="signoff_check_' + i + '">' + UI.escapeHtml(item) + '</label>' +
          '</li>';
      }).join('') +
      '</ul>';
  }

  function loadSavedData() {
    var signoff = FenceApp.project.signoff || {};
    if (signoff.checklist) {
      signoff.checklist.forEach(function (checked, i) {
        var cb = document.getElementById('signoff_check_' + i);
        if (cb) cb.checked = checked;
      });
    }
    UI.populateForm('form-signoff', {
      completion_date: signoff.completionDate || new Date().toISOString().split('T')[0],
      foreman_name:    signoff.foremanName    || '',
      punch_list:      signoff.punchList      || '',
      warranty_months: signoff.warrantyMonths || 12,
    });
    updateProgress();
  }

  function initSignaturePad() {
    sigCanvas = document.getElementById('signoff-signature');
    if (!sigCanvas) return;
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#1B2D4D';
    sigCtx.lineWidth   = 2;
    sigCtx.lineCap     = 'round';

    sigCanvas.addEventListener('mousedown', onStart);
    sigCanvas.addEventListener('mousemove', onMove);
    sigCanvas.addEventListener('mouseup',   onEnd);
    sigCanvas.addEventListener('touchstart', function (e) { e.preventDefault(); onStart(e.touches[0]); }, { passive: false });
    sigCanvas.addEventListener('touchmove',  function (e) { e.preventDefault(); onMove(e.touches[0]); },  { passive: false });
    sigCanvas.addEventListener('touchend',   onEnd);
  }

  function getPos(e) {
    var r = sigCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onStart(e) { signing = true; var p = getPos(e); sigCtx.beginPath(); sigCtx.moveTo(p.x, p.y); }
  function onMove(e)  { if (!signing) return; var p = getPos(e); sigCtx.lineTo(p.x, p.y); sigCtx.stroke(); }
  function onEnd()    { signing = false; }

  function updateProgress() {
    var items = document.querySelectorAll('#signoff-checklist .checklist-checkbox');
    var checked = Array.from(items).filter(function (cb) { return cb.checked; }).length;
    UI.setProgress('signoff-progress', (checked / CHECKLIST_ITEMS.length) * 100);
    UI.setText('signoff-progress-text', checked + ' / ' + CHECKLIST_ITEMS.length + ' complete');
  }

  function bindEvents() {
    document.querySelectorAll('#signoff-checklist .checklist-checkbox').forEach(function (cb) {
      cb.addEventListener('change', updateProgress);
    });

    var btnClear = document.getElementById('btn-clear-signoff-sig');
    if (btnClear) btnClear.addEventListener('click', function () {
      if (sigCtx) sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    });

    var btnSave = document.getElementById('btn-save-signoff');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function save() {
    var items = Array.from(document.querySelectorAll('#signoff-checklist .checklist-checkbox')).map(function (cb) { return cb.checked; });
    var data  = UI.getFormData('form-signoff');

    FenceApp.project.signoff = {
      checklist:       items,
      completionDate:  data.completion_date,
      foremanName:     data.foreman_name,
      punchList:       data.punch_list,
      warrantyMonths:  parseInt(data.warranty_months, 10) || 12,
      signature:       sigCanvas ? sigCanvas.toDataURL() : null,
      signedAt:        new Date().toISOString(),
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Sign-off saved ✓', 'success');
  }

  return { init, save };

})();

window.Tab13Signoff = Tab13Signoff;
