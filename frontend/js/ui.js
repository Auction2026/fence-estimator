/**
 * FENCE DEPOT ESTIMATOR - UI Utilities
 * ui.js — toast notifications, modals, loaders, DOM helpers
 */

'use strict';

const UI = (() => {

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  let _toastContainer = null;

  function _getToastContainer() {
    if (!_toastContainer) {
      _toastContainer = document.getElementById('toastContainer');
      if (!_toastContainer) {
        _toastContainer = document.createElement('div');
        _toastContainer.id = 'toastContainer';
        _toastContainer.className = 'toast-container';
        document.body.appendChild(_toastContainer);
      }
    }
    return _toastContainer;
  }

  const TOAST_ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  /**
   * showToast(message, type, duration)
   * type: 'success' | 'error' | 'warning' | 'info'
   * duration: ms (default 4000)
   */
  function showToast(message, type = 'info', duration = 4000) {
    const container = _getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${TOAST_ICONS[type] || 'ℹ️'}</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close">×</button>
    `;
    container.appendChild(toast);

    const close = () => {
      toast.classList.add('hiding');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
  }

  // ============================================================
  // MODALS
  // ============================================================
  function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
  }

  // ============================================================
  // LOADING OVERLAY
  // ============================================================
  let _loaderEl = null;

  function showLoader(message = 'Loading…') {
    if (!_loaderEl) {
      _loaderEl = document.createElement('div');
      _loaderEl.className = 'loading-overlay';
      _loaderEl.innerHTML = `
        <div style="text-align:center">
          <div class="spinner"></div>
          <p id="loaderMsg" style="margin-top:12px;font-weight:600;color:#1B2D4D">${escapeHtml(message)}</p>
        </div>`;
      document.body.appendChild(_loaderEl);
    } else {
      document.getElementById('loaderMsg').textContent = message;
    }
    _loaderEl.style.display = 'flex';
  }

  function hideLoader() {
    if (_loaderEl) _loaderEl.style.display = 'none';
  }

  // ============================================================
  // CONFIRM DIALOG
  // ============================================================
  function confirm(message, title = 'Are you sure?') {
    return new Promise(resolve => {
      const id = '__confirmModal__';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.className = 'modal-overlay';
        el.innerHTML = `
          <div class="modal" style="max-width:420px">
            <div class="modal-header">
              <h2 id="${id}_title"></h2>
            </div>
            <div class="modal-body">
              <p id="${id}_msg" style="font-size:15px;color:#555"></p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" id="${id}_cancel">Cancel</button>
              <button class="btn btn-danger" id="${id}_ok">Confirm</button>
            </div>
          </div>`;
        document.body.appendChild(el);
      }
      document.getElementById(`${id}_title`).textContent = title;
      document.getElementById(`${id}_msg`).textContent   = message;
      openModal(id);
      const cleanup = (result) => { closeModal(id); resolve(result); };
      document.getElementById(`${id}_ok`).onclick     = () => cleanup(true);
      document.getElementById(`${id}_cancel`).onclick = () => cleanup(false);
    });
  }

  // ============================================================
  // DOM HELPERS
  // ============================================================
  function escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  function el(id) { return document.getElementById(id); }

  function setText(id, text) {
    const e = el(id);
    if (e) e.textContent = text;
  }

  function setHtml(id, html) {
    const e = el(id);
    if (e) e.innerHTML = html;
  }

  function show(id) {
    const e = el(id);
    if (e) e.style.display = '';
  }

  function hide(id) {
    const e = el(id);
    if (e) e.style.display = 'none';
  }

  function toggle(id, condition) {
    condition ? show(id) : hide(id);
  }

  function addClass(id, cls) {
    const e = el(id);
    if (e) e.classList.add(cls);
  }

  function removeClass(id, cls) {
    const e = el(id);
    if (e) e.classList.remove(cls);
  }

  /**
   * Populate a <select> element with options.
   * options: [{ value, label }] or ['value1', 'value2']
   */
  function populateSelect(selectEl, options, placeholder = '-- Select --') {
    if (typeof selectEl === 'string') selectEl = el(selectEl);
    if (!selectEl) return;
    selectEl.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>`;
    options.forEach(opt => {
      const option = document.createElement('option');
      if (typeof opt === 'object') {
        option.value = opt.value;
        option.textContent = opt.label;
      } else {
        option.value = opt;
        option.textContent = opt;
      }
      selectEl.appendChild(option);
    });
  }

  /**
   * Build a simple HTML table from an array of objects.
   * columns: [{ key, label, align }]
   */
  function buildTable(rows, columns, emptyMessage = 'No data found.') {
    if (!rows || rows.length === 0) {
      return `<p class="text-muted text-center" style="padding:30px">${escapeHtml(emptyMessage)}</p>`;
    }
    const thead = `<thead><tr>${columns.map(c => `<th>${escapeHtml(c.label)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(row =>
      `<tr>${columns.map(c => {
        const val = c.render ? c.render(row[c.key], row) : escapeHtml(String(row[c.key] ?? ''));
        const align = c.align ? ` class="td-${c.align}"` : '';
        return `<td${align}>${val}</td>`;
      }).join('')}</tr>`
    ).join('')}</tbody>`;
    return `<table class="data-table"><thead>${thead}</thead>${tbody}</table>`;
  }

  // ============================================================
  // OPTION BUTTON SELECTION
  // ============================================================
  function selectOption(clickedEl, group, callback) {
    if (typeof clickedEl === 'string') clickedEl = el(clickedEl);
    const siblings = clickedEl.closest('.option-grid')?.querySelectorAll('.option-btn')
                  || clickedEl.parentElement.querySelectorAll('.option-btn');
    siblings.forEach(b => b.classList.remove('selected'));
    clickedEl.classList.add('selected');
    if (callback) callback(clickedEl.dataset.value || clickedEl.textContent.trim());
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    // Wire close buttons on all modals
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = btn.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id);
      });
    });
  }

  return {
    init,
    showToast, openModal, closeModal, closeAllModals,
    showLoader, hideLoader, confirm,
    escapeHtml, el, setText, setHtml, show, hide, toggle,
    addClass, removeClass, populateSelect, buildTable, selectOption,
  };
})();

window.UI = UI;
