/**
 * TAB 9 - Contract
 * frontend/js/tabs/tab9-contract.js
 */

'use strict';

var Tab9Contract = (function () {

  var sigCanvas, sigCtx, signing = false;
  var FORM_ID = 'form-contract';
  var isLocked = false;

  function init() {
    loadContractData();
    initSignaturePad();
    bindEvents();
  }

  function loadContractData() {
    var contract = FenceApp.project.contract || {};
    var customer = FenceApp.project.customer || {};
    var estimate = FenceApp.project.estimate  || {};

    UI.setText('contract-customer-name', customer.name || '--');
    UI.setText('contract-customer-addr', [customer.address, customer.city, customer.state, customer.zip].filter(Boolean).join(', ') || '--');
    UI.setText('contract-total', formatCurrency(estimate.grandTotal || 0));
    UI.setText('contract-date',  formatDate(new Date().toISOString()));

    isLocked = !!contract.locked;
    if (isLocked) lockUI();
  }

  function initSignaturePad() {
    sigCanvas = document.getElementById('signature-canvas');
    if (!sigCanvas) return;
    sigCtx    = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#1B2D4D';
    sigCtx.lineWidth   = 2;
    sigCtx.lineCap     = 'round';
    sigCtx.lineJoin    = 'round';

    sigCanvas.addEventListener('mousedown', onSigStart);
    sigCanvas.addEventListener('mousemove', onSigMove);
    sigCanvas.addEventListener('mouseup',   onSigEnd);
    sigCanvas.addEventListener('mouseleave',onSigEnd);
    sigCanvas.addEventListener('touchstart', onTouchStart, { passive: false });
    sigCanvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    sigCanvas.addEventListener('touchend',   onSigEnd);

    // Load saved signature
    var saved = FenceApp.project.contract && FenceApp.project.contract.signature;
    if (saved) {
      var img = new Image();
      img.onload = function () { sigCtx.drawImage(img, 0, 0); };
      img.src = saved;
    }
  }

  function getSigPos(e) {
    var r = sigCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onSigStart(e) { if (isLocked) return; signing = true; var p = getSigPos(e); sigCtx.beginPath(); sigCtx.moveTo(p.x, p.y); }
  function onSigMove(e)  { if (!signing) return; var p = getSigPos(e); sigCtx.lineTo(p.x, p.y); sigCtx.stroke(); }
  function onSigEnd()    { signing = false; }
  function onTouchStart(e) { e.preventDefault(); onSigStart(e.touches[0]); }
  function onTouchMove(e)  { e.preventDefault(); onSigMove(e.touches[0]); }

  function bindEvents() {
    var btnClearSig = document.getElementById('btn-clear-sig');
    if (btnClearSig) btnClearSig.addEventListener('click', clearSignature);

    var btnLock = document.getElementById('btn-lock-contract');
    if (btnLock) btnLock.addEventListener('click', lockContract);

    var btnSave = document.getElementById('btn-save-contract');
    if (btnSave) btnSave.addEventListener('click', save);

    var btnPrint = document.getElementById('btn-print-contract');
    if (btnPrint) btnPrint.addEventListener('click', function () { PrintTool.printContract(); });
  }

  function clearSignature() {
    if (isLocked) { UI.showToast('Contract is locked', 'warning'); return; }
    if (!sigCtx) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  }

  function lockContract() {
    if (!window.confirm('Lock contract? Prices will be frozen and cannot be changed.')) return;
    isLocked = true;
    FenceApp.project.contract = FenceApp.project.contract || {};
    FenceApp.project.contract.locked   = true;
    FenceApp.project.contract.lockedAt = new Date().toISOString();
    FenceApp.project.contract.lockedTotal = (FenceApp.project.estimate || {}).grandTotal || 0;
    lockUI();
    save();
    UI.showToast('Contract locked ✓', 'success');
  }

  function lockUI() {
    var lockBtn = document.getElementById('btn-lock-contract');
    if (lockBtn) { lockBtn.disabled = true; lockBtn.textContent = '🔒 Contract Locked'; }

    var badge = document.getElementById('contract-lock-badge');
    if (badge) { badge.textContent = '🔒 LOCKED'; badge.className = 'badge badge-success'; }

    if (sigCanvas) sigCanvas.style.cursor = 'not-allowed';
  }

  function save() {
    var sigData = sigCanvas ? sigCanvas.toDataURL() : null;
    FenceApp.project.contract = Object.assign(FenceApp.project.contract || {}, {
      signature:   sigData,
      savedAt:     new Date().toISOString(),
      customerName: (FenceApp.project.customer || {}).name,
      total:        (FenceApp.project.estimate || {}).grandTotal || 0,
    });
    Storage.saveProject(FenceApp.project);
    UI.showToast('Contract saved ✓', 'success');
  }

  return { init, save, lockContract };

})();

window.Tab9Contract = Tab9Contract;
