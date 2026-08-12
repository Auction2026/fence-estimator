/**
 * FENCE DEPOT ESTIMATOR - UI Manipulation
 * frontend/js/ui.js
 */

'use strict';

var UI = (function () {

  // ---- LOADING ----
  function showLoading(message) {
    var overlay = document.getElementById('loading-overlay');
    var msg     = document.getElementById('loading-message');
    if (overlay) overlay.classList.add('show');
    if (msg) msg.textContent = message || 'Loading...';
  }

  function hideLoading() {
    var overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  // ---- TOAST NOTIFICATIONS ----
  function showToast(message, type, duration) {
    type     = type     || 'info';
    duration = duration || 3500;

    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    var icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span>' + (icons[type] || '') + '</span><span>' + escapeHtml(message) + '</span>';

    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(function () { toast.remove(); }, 350);
    }, duration);
  }

  // ---- MODALS ----
  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // ---- ELEMENT VISIBILITY ----
  function show(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.remove('hidden');
  }

  function hide(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.add('hidden');
  }

  function toggle(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.toggle('hidden');
  }

  // ---- FORM UTILITIES ----
  function getFormData(formId) {
    var form = document.getElementById(formId);
    if (!form) return {};
    var data = {};
    var elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox') data[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
      else data[el.name] = el.value;
    });
    return data;
  }

  function populateForm(formId, data) {
    var form = document.getElementById(formId);
    if (!form || !data) return;
    Object.keys(data).forEach(function (key) {
      var el = form.querySelector('[name="' + key + '"], #' + key);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!data[key];
      else if (el.type === 'radio') {
        form.querySelectorAll('[name="' + key + '"]').forEach(function (r) {
          r.checked = (r.value === String(data[key]));
        });
      } else el.value = data[key] !== null && data[key] !== undefined ? data[key] : '';
    });
  }

  function clearForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else el.value = '';
      el.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(function (e) {
      e.textContent = '';
      e.classList.remove('show');
    });
  }

  function clearAllForms() {
    document.querySelectorAll('form').forEach(function (f) {
      clearForm(f.id);
    });
  }

  // ---- TABLE HELPERS ----
  function renderTable(tableBodyId, rows, columns) {
    var tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (!rows || rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="' + columns.length + '" class="text-center text-muted" style="padding:24px">No data</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map(function (row, idx) {
      return '<tr>' + columns.map(function (col) {
        var val = typeof col.render === 'function' ? col.render(row, idx) : (row[col.key] || '');
        return '<td>' + val + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  // ---- ELEMENT UPDATES ----
  function setText(elementId, text) {
    var el = document.getElementById(elementId);
    if (el) el.textContent = text;
  }

  function setHTML(elementId, html) {
    var el = document.getElementById(elementId);
    if (el) el.innerHTML = html;
  }

  function setCurrency(elementId, amount) {
    setText(elementId, formatCurrency(amount));
  }

  // ---- CONFIRMATION ----
  function confirm(message) {
    return window.confirm(message);
  }

  // ---- SECURITY ----
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- PROGRESS BAR ----
  function setProgress(barId, percent) {
    var bar = document.getElementById(barId);
    if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
  }

  // ---- PUBLIC ----
  return {
    showLoading, hideLoading,
    showToast,
    openModal, closeModal, closeAllModals,
    show, hide, toggle,
    getFormData, populateForm, clearForm, clearAllForms,
    renderTable,
    setText, setHTML, setCurrency,
    confirm,
    escapeHtml,
    setProgress,
  };

})();

window.UI = UI;
