/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Contract Module – Price Lock & Signature
 */
'use strict';

let sigCanvas, sigCtx, sigDrawing = false;

document.addEventListener('DOMContentLoaded', () => {
  initSignatureCanvas('signature-canvas');
  initSignatureCanvas('signoff-signature-canvas');
  document.getElementById('deposit-amount')?.addEventListener('input', updateBalance);
});

function initSignatureCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.addEventListener('mousedown',  e => startDraw(e, canvas, ctx));
  canvas.addEventListener('mousemove',  e => draw(e, canvas, ctx));
  canvas.addEventListener('mouseup',    () => stopDraw(ctx));
  canvas.addEventListener('mouseleave', () => stopDraw(ctx));
  // Touch support
  canvas.addEventListener('touchstart', e => { e.preventDefault(); startDraw(e.touches[0], canvas, ctx); });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); draw(e.touches[0], canvas, ctx); });
  canvas.addEventListener('touchend',   () => stopDraw(ctx));
}

let _drawing = false;
function startDraw(e, canvas, ctx) {
  _drawing = true;
  ctx.beginPath();
  const r = canvas.getBoundingClientRect();
  ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  ctx.strokeStyle = '#1a6b3a';
  ctx.lineWidth   = 2;
  ctx.lineCap     = 'round';
}
function draw(e, canvas, ctx) {
  if (!_drawing) return;
  const r = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
  ctx.stroke();
}
function stopDraw(ctx) { _drawing = false; }

function clearSignature() {
  const canvas = document.getElementById('signature-canvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function clearSignoffSignature() {
  const canvas = document.getElementById('signoff-signature-canvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function lockContract() {
  const canvas = document.getElementById('signature-canvas');
  const total  = AppState.estimateSummary?.total || 0;

  if (total === 0) {
    alert('⚠️ Please complete the estimate first (Tab 7) before locking the contract.');
    return;
  }
  if (!confirm(`Lock contract at $${total.toFixed(2)}?\n\nOnce locked, the price CANNOT change without a signed Change Order.`)) return;

  AppState.contract.locked    = true;
  AppState.contract.price     = total;
  AppState.contract.signedAt  = new Date().toISOString();
  AppState.contract.signature = canvas ? canvas.toDataURL() : null;

  setValue('contract-price', '$' + total.toFixed(2));
  updateBalance();
  updateContractBanner();
  saveToStorage();
  setStatus('Contract LOCKED at $' + total.toFixed(2));
  alert(`✅ Contract LOCKED!\n\nContract Price: $${total.toFixed(2)}\nDate: ${new Date().toLocaleDateString()}\n\nThe price is now locked. Any changes require a Change Order.`);
}

function updateContractBanner() {
  const el = document.getElementById('contract-lock-status');
  if (!el) return;
  if (AppState.contract.locked) {
    el.textContent = `🔒 CONTRACT LOCKED – Price: $${AppState.contract.price.toFixed(2)} (${new Date(AppState.contract.signedAt).toLocaleDateString()})`;
    el.closest('.contract-status-banner').style.background = '#d4edda';
    el.closest('.contract-status-banner').style.borderColor = '#28a745';
  }
}

function updateBalance() {
  const price   = AppState.contract.price || AppState.estimateSummary?.total || 0;
  const deposit = parseFloat(document.getElementById('deposit-amount')?.value || 0);
  const balance = price - deposit;
  setValue('balance-due', '$' + Math.max(0, balance).toFixed(2));
}
