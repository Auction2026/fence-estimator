/**
 * ui.js – DOM manipulation and UI helpers for Fence Estimator Pro
 */

const UI = (() => {

  // ── Notifications ──────────────────────────────────────────────
  let notifTimer = null;

  function showNotification(message, type = 'info', duration = 4000) {
    const notif = document.getElementById('global-notification');
    const msgEl = document.getElementById('notification-message');
    if (!notif || !msgEl) return;

    notif.classList.remove('hidden');
    notif.style.background = {
      success: '#27ae60', error: '#c0392b', warning: '#e67e22', info: '#1a3c6e'
    }[type] || '#1a3c6e';
    msgEl.textContent = message;

    if (notifTimer) clearTimeout(notifTimer);
    notifTimer = setTimeout(() => notif.classList.add('hidden'), duration);
  }

  function hideNotification() {
    const notif = document.getElementById('global-notification');
    if (notif) notif.classList.add('hidden');
  }

  // ── Form messages ──────────────────────────────────────────────
  function setFormMessage(elementId, message, type = 'success') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = `form-message ${type}`;
    if (message) {
      setTimeout(() => { el.textContent = ''; el.className = 'form-message'; }, 5000);
    }
  }

  // ── Loading spinner ────────────────────────────────────────────
  function showLoading(elementId, message = 'Loading...') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<div class="loading-spinner" style="text-align:center;padding:2rem;color:#6c757d;">
      <div style="font-size:2rem;animation:spin 1s linear infinite;display:inline-block;">⏳</div>
      <p>${message}</p>
    </div>`;
  }

  // ── Modal management ───────────────────────────────────────────
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // ── Confirm dialog ─────────────────────────────────────────────
  function confirm(message) {
    return window.confirm(message);
  }

  // ── Element visibility ─────────────────────────────────────────
  function show(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = '';
  }

  function hide(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'none';
  }

  function toggle(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? '' : 'none';
  }

  // ── Table helpers ──────────────────────────────────────────────
  function clearTable(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (tbody) tbody.innerHTML = '';
  }

  function setTableEmpty(tbodyId, message, colSpan = 7) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${colSpan}">${message}</td></tr>`;
  }

  function appendRow(tbodyId, cells, rowClass = '') {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const tr = document.createElement('tr');
    if (rowClass) tr.className = rowClass;
    cells.forEach(cell => {
      const td = document.createElement('td');
      if (typeof cell === 'string' || typeof cell === 'number') {
        td.innerHTML = String(cell);
      } else if (cell && typeof cell === 'object') {
        if (cell.html) td.innerHTML = cell.html;
        if (cell.text) td.textContent = cell.text;
        if (cell.class) td.className = cell.class;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
    return tr;
  }

  // ── Form helpers ───────────────────────────────────────────────
  function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    const data = {};
    const elements = form.elements;
    for (let el of elements) {
      if (!el.name) continue;
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    }
    return data;
  }

  function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form || !data) return;
    Object.entries(data).forEach(([key, value]) => {
      const el = form.querySelector(`[name="${key}"]`);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = !!value;
      } else if (el.type === 'radio') {
        const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        el.value = value || '';
      }
    });
  }

  function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
  }

  // ── Text helpers ───────────────────────────────────────────────
  function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text || '--';
  }

  function setHTML(elementId, html) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = html || '';
  }

  function getValue(elementId) {
    const el = document.getElementById(elementId);
    return el ? el.value : '';
  }

  function setValue(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.value = value || '';
  }

  // ── Tab switching ──────────────────────────────────────────────
  function activateTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const content = document.getElementById(tabId);
    if (content) content.classList.add('active');

    const btn = document.querySelector(`[data-tab="${tabId}"]`);
    if (btn) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // ── Date helpers ───────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function todayISO() {
    return new Date().toISOString().split('T')[0];
  }

  function futureDateISO(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  return {
    showNotification, hideNotification,
    setFormMessage,
    showLoading,
    showModal, hideModal,
    confirm,
    show, hide, toggle,
    clearTable, setTableEmpty, appendRow,
    getFormData, populateForm, clearForm,
    setText, setHTML, getValue, setValue,
    activateTab,
    formatDate, todayISO, futureDateISO
  };
})();

// Global alias used in HTML onclick attributes
function hideNotification() { UI.hideNotification(); }
function switchTab(tabId) { UI.activateTab(tabId); }
