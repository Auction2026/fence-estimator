/* ═══════════════════════════════════════════════════════════════
   FENCE DEPOT ESTIMATOR PRO – js/app.js
   Core: API client, tab routing, modal, toast, settings, auth
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── CONFIG ─────────────────────────────────────────────────── */
const API_BASE = window.API_BASE || 'http://localhost:3000/api';

/* ── API CLIENT ─────────────────────────────────────────────── */
const Api = {
  _token() { return localStorage.getItem('fd_token'); },
  async _request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (this._token()) headers['Authorization'] = 'Bearer ' + this._token();
    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },
  get(path)        { return this._request('GET',    path); },
  post(path, body) { return this._request('POST',   path, body); },
  put(path, body)  { return this._request('PUT',    path, body); },
  del(path)        { return this._request('DELETE', path); }
};

/* ── SETTINGS ───────────────────────────────────────────────── */
const Settings = {
  _defaults: { markup: 20, labor: 12, currency: '$', dateFormat: 'MM/DD/YYYY', theme: 'light' },
  get(key) {
    const saved = JSON.parse(localStorage.getItem('fd_settings') || '{}');
    return saved[key] !== undefined ? saved[key] : this._defaults[key];
  },
  set(key, val) {
    const saved = JSON.parse(localStorage.getItem('fd_settings') || '{}');
    saved[key] = val;
    localStorage.setItem('fd_settings', JSON.stringify(saved));
  },
  all() {
    return { ...this._defaults, ...JSON.parse(localStorage.getItem('fd_settings') || '{}') };
  }
};

/* ── TOAST ──────────────────────────────────────────────────── */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ── MODAL ──────────────────────────────────────────────────── */
const Modal = {
  open(title, bodyHTML, footerHTML = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML   = bodyHTML;
    document.getElementById('modal-footer').innerHTML = footerHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
};
document.getElementById('modal-close').addEventListener('click', () => Modal.close());
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) Modal.close();
});

/* ── TAB ROUTER ─────────────────────────────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-tab="${name}"]`);
  if (btn) btn.classList.add('active');
  // fire tab-specific load event
  document.dispatchEvent(new CustomEvent('tabLoad', { detail: name }));
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

/* ── HTML ESCAPE ────────────────────────────────────────────── */
function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── FORMAT HELPERS ─────────────────────────────────────────── */
function fmtCurrency(n) {
  const sym = Settings.get('currency');
  return sym + Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const fmt = Settings.get('dateFormat');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  if (fmt === 'DD/MM/YYYY') return `${dd}/${mm}/${yyyy}`;
  if (fmt === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`;
  return `${mm}/${dd}/${yyyy}`;
}

/* ── SETTINGS PAGE ──────────────────────────────────────────── */
function applySettings() {
  const s = Settings.all();
  document.documentElement.setAttribute('data-theme', s.theme);
  document.getElementById('set-markup').value      = s.markup;
  document.getElementById('set-labor').value       = s.labor;
  document.getElementById('set-currency').value    = s.currency;
  document.getElementById('set-date-format').value = s.dateFormat;
  document.getElementById('set-theme').value       = s.theme;
}

document.getElementById('save-settings-btn').addEventListener('click', () => {
  Settings.set('markup',     parseFloat(document.getElementById('set-markup').value));
  Settings.set('labor',      parseFloat(document.getElementById('set-labor').value));
  Settings.set('currency',   document.getElementById('set-currency').value);
  Settings.set('dateFormat', document.getElementById('set-date-format').value);
  const theme = document.getElementById('set-theme').value;
  Settings.set('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  toast('Settings saved', 'success');
});

/* ── AUTH ───────────────────────────────────────────────────── */
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('fd_token');
  localStorage.removeItem('fd_user');
  document.getElementById('user-display').textContent = 'Guest';
  toast('Logged out', 'info');
});
function updateUserDisplay() {
  const user = JSON.parse(localStorage.getItem('fd_user') || 'null');
  if (user) document.getElementById('user-display').textContent = user.name || user.email || 'User';
}

/* ── INIT ───────────────────────────────────────────────────── */
applySettings();
updateUserDisplay();
switchTab('dashboard');

// Expose globals for tab scripts
window.App = { Api, Settings, Modal, toast, fmtCurrency, fmtDate, switchTab, escHtml };
