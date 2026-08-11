const ICON_MAP = { success: '✓', info: 'ⓘ', warning: '⚠', danger: '✕' };

function qs(selector, scope = document) {
  return scope?.querySelector?.(selector) || null;
}

function createElement(tag, className, html = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value) || 0);
}

export function formatPercent(value, digits = 1, locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(Number(value) || 0);
}

export function formatNumber(value, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(Number(value) || 0);
}

export function formatDate(value, locale = 'en-US', options = { dateStyle: 'medium' }) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale, options).format(date);
}

export function getToastContainer() {
  let container = qs('[data-toast-stack]');
  if (!container) {
    container = createElement('div', 'toast-stack');
    container.dataset.toastStack = 'true';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast({ title = 'Notice', message = '', tone = 'info', duration = 3200 } = {}) {
  const container = getToastContainer();
  const toast = createElement('div', `toast toast--${tone}`);
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast__icon">${ICON_MAP[tone] || ICON_MAP.info}</div>
    <div>
      <p class="toast__title">${title}</p>
      <p class="toast__message">${message}</p>
    </div>
    <button type="button" class="toast__close" aria-label="Dismiss notification">×</button>
  `;
  qs('.toast__close', toast)?.addEventListener('click', () => toast.remove());
  container.appendChild(toast);
  if (duration > 0) window.setTimeout(() => toast.remove(), duration);
  return toast;
}

export function ensureLoadingOverlay() {
  let overlay = qs('[data-loading-overlay]');
  if (!overlay) {
    overlay = createElement('div', 'loading-overlay');
    overlay.dataset.loadingOverlay = 'true';
    overlay.innerHTML = `<div><div class="spinner"></div><p class="text-center mt-16 text-muted">Loading…</p></div>`;
    document.body.appendChild(overlay);
  }
  return overlay;
}

export function showLoading(message = 'Loading…') {
  const overlay = ensureLoadingOverlay();
  const label = qs('p', overlay);
  if (label) label.textContent = message;
  overlay.classList.add('is-visible');
}

export function hideLoading() {
  qs('[data-loading-overlay]')?.classList.remove('is-visible');
}

export function ensureModalRoot() {
  let root = qs('[data-modal-root]');
  if (!root) {
    root = createElement('div', 'modal');
    root.dataset.modalRoot = 'true';
    document.body.appendChild(root);
  }
  return root;
}

export function openModal({ title = 'Modal', body = '', footer = '', width = '40rem' } = {}) {
  const root = ensureModalRoot();
  root.innerHTML = `
    <div class="modal__panel" style="max-width:${width}">
      <div class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button type="button" class="modal__close" data-close-modal aria-label="Close dialog">×</button>
      </div>
      <div class="modal__body">${body}</div>
      <div class="modal__footer">${footer || '<button type="button" class="btn btn--secondary" data-close-modal>Close</button>'}</div>
    </div>
  `;
  root.classList.add('is-open');
  root.addEventListener('click', (event) => {
    if (event.target === root || event.target.closest('[data-close-modal]')) closeModal();
  }, { once: true });
  return root;
}

export function closeModal() {
  const root = qs('[data-modal-root]');
  if (!root) return;
  root.classList.remove('is-open');
  root.innerHTML = '';
}

export function confirmDialog({ title = 'Confirm action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', tone = 'danger' } = {}) {
  return new Promise((resolve) => {
    const root = openModal({
      title,
      body: `<p>${message}</p>`,
      footer: `
        <button type="button" class="btn btn--secondary" data-confirm-cancel>${cancelText}</button>
        <button type="button" class="btn btn--${tone === 'danger' ? 'danger' : 'primary'}" data-confirm-accept>${confirmText}</button>
      `,
      width: '30rem',
    });
    qs('[data-confirm-cancel]', root)?.addEventListener('click', () => { closeModal(); resolve(false); });
    qs('[data-confirm-accept]', root)?.addEventListener('click', () => { closeModal(); resolve(true); });
  });
}

export function statusClass(status = '') {
  const normalized = String(status).toLowerCase();
  const map = {
    draft: 'status-pill status-pill--draft',
    pending: 'status-pill status-pill--pending',
    sent: 'status-pill status-pill--sent',
    scheduled: 'status-pill status-pill--scheduled',
    approved: 'status-pill status-pill--approved',
    won: 'status-pill status-pill--won',
    active: 'status-pill status-pill--active',
    contract: 'status-pill status-pill--approved',
    lost: 'status-pill status-pill--lost',
    inactive: 'status-pill status-pill--inactive',
    error: 'status-pill status-pill--error',
  };
  return map[normalized] || 'status-pill';
}

export function renderStatus(status, label = status) {
  return `<span class="${statusClass(status)}">${label}</span>`;
}

export function renderEmptyState({ icon = '📋', title = 'Nothing here yet', copy = 'Content will appear when records are added.', actionMarkup = '' } = {}) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">${icon}</div>
      <h3 class="empty-state__title">${title}</h3>
      <p class="empty-state__copy">${copy}</p>
      ${actionMarkup ? `<div class="mt-16">${actionMarkup}</div>` : ''}
    </div>
  `;
}

export async function copyToClipboard(text, successMessage = 'Copied to clipboard.') {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    showToast({ title: 'Copied', message: successMessage, tone: 'success' });
    return true;
  }
  const helper = createElement('textarea');
  helper.value = text;
  document.body.appendChild(helper);
  helper.select();
  document.execCommand('copy');
  helper.remove();
  showToast({ title: 'Copied', message: successMessage, tone: 'success' });
  return true;
}

export function setButtonBusy(button, busy, label = 'Working…') {
  if (!(button instanceof HTMLButtonElement)) return;
  if (busy) {
    button.dataset.originalLabel = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner spinner--inline"></span>${label}`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalLabel || button.innerHTML;
    delete button.dataset.originalLabel;
  }
}

export function flashField(field) {
  if (!(field instanceof HTMLElement)) return;
  field.classList.add('is-invalid');
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => field.classList.remove('is-invalid'), 1800);
}

export function bindAutoDismiss(root = document) {
  root.addEventListener('click', (event) => {
    const closeModalTrigger = event.target.closest('[data-close-modal]');
    if (closeModalTrigger) closeModal();
    const closeToastTrigger = event.target.closest('.toast__close');
    if (closeToastTrigger) closeToastTrigger.closest('.toast')?.remove();
  });
}

export function renderKeyValueRows(entries = []) {
  return entries.map(([label, value]) => `<div class="summary-card__row"><span class="summary-card__label">${label}</span><span class="summary-card__value">${value}</span></div>`).join('');
}

if (typeof document !== 'undefined') bindAutoDismiss(document);

if (typeof window !== 'undefined') {
  window.FenceEstimatorUI = { showToast, showLoading, hideLoading, openModal, closeModal, confirmDialog };
}
