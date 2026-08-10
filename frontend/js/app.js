/**
 * FENCE DEPOT ESTIMATOR PRO
 * app.js — Core Application Bootstrap & Shared Utilities
 *
 * Tabs:
 *   1. Dashboard      2. New Estimate   3. Projects      4. Materials
 *   5. Pricing        6. Inventory      7. Suppliers      8. Contracts
 *   9. Change Orders 10. Sign-Off      11. Notes        12. Map Tool
 *  13. Drawing Tool  14. Analytics     15. Reports      16. Crew
 *  17. Settings
 */

'use strict';

// ---------------------------------------------------------------------------
// CONSTANTS & GLOBAL STATE
// ---------------------------------------------------------------------------

const API_BASE   = localStorage.getItem('apiUrl') || 'http://localhost:3000/api';
const LS_KEY     = 'fenceEstimatorData';
const LS_USER    = 'fenceEstimatorUser';

const FENCE_PRICING = {
  'chain-link':    { material: 4.50,  labor: 3.25 },
  'wood-privacy':  { material: 8.00,  labor: 5.00 },
  'vinyl':         { material: 12.00, labor: 4.50 },
  'ornamental':    { material: 18.00, labor: 7.00 },
  'split-rail':    { material: 5.50,  labor: 3.00 },
  'farm-ranch':    { material: 3.50,  labor: 2.50 },
  'electric':      { material: 6.00,  labor: 4.00 },
  'barbed-wire':   { material: 2.50,  labor: 2.00 },
};

let state = loadState();
let currentUser = JSON.parse(localStorage.getItem(LS_USER) || 'null');
let estimateStep = 1;

// ---------------------------------------------------------------------------
// STATE PERSISTENCE
// ---------------------------------------------------------------------------

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
  } catch { return {}; }
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function getCollection(name) {
  if (!state[name]) state[name] = [];
  return state[name];
}

function saveCollection(name, data) {
  state[name] = data;
  saveState();
}

// ---------------------------------------------------------------------------
// APP OBJECT (PUBLIC API)
// ---------------------------------------------------------------------------

const app = {

  // ---- AUTH ----

  login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl  = document.getElementById('loginError');

    // Demo credentials (frontend demo mode)
    const DEMO_USERS = [
      { username: 'admin',     password: 'admin123',    role: 'admin',     company: 'Fence Depot' },
      { username: 'estimator', password: 'estimate123', role: 'estimator', company: 'Fence Depot' },
    ];

    const user = DEMO_USERS.find(u => u.username === username && u.password === password);

    if (user) {
      currentUser = { username: user.username, role: user.role, company: user.company };
      localStorage.setItem(LS_USER, JSON.stringify(currentUser));
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appShell').style.display    = 'flex';
      document.getElementById('logoutBtn').style.display   = '';
      document.getElementById('currentUserDisplay').textContent = `${user.username} (${user.role})`;
      app.switchTab('dashboard');
      app.initAllTabs();
    } else {
      errorEl.textContent     = 'Invalid username or password.';
      errorEl.style.display   = '';
    }
  },

  logout() {
    localStorage.removeItem(LS_USER);
    currentUser = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appShell').style.display    = 'none';
    document.getElementById('logoutBtn').style.display   = 'none';
  },

  checkAuth() {
    if (currentUser) {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appShell').style.display    = 'flex';
      document.getElementById('logoutBtn').style.display   = '';
      document.getElementById('currentUserDisplay').textContent = `${currentUser.username} (${currentUser.role})`;
      app.switchTab('dashboard');
      app.initAllTabs();
    }
  },

  // ---- NAVIGATION ----

  switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    const panel = document.getElementById(`tab-${tabId}`);
    const navItem = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
    if (panel)   panel.classList.add('active');
    if (navItem) navItem.classList.add('active');
    // Trigger tab-specific refresh
    if (typeof window[`${toCamelCase(tabId)}TabRefresh`] === 'function') {
      window[`${toCamelCase(tabId)}TabRefresh`]();
    }
  },

  initAllTabs() {
    ['dashboard', 'projects', 'materials', 'pricing', 'inventory',
     'suppliers', 'contracts', 'change-orders', 'sign-off', 'notes',
     'analytics', 'crew', 'settings'].forEach(t => {
      const fn = window[`${toCamelCase(t)}TabRefresh`];
      if (typeof fn === 'function') fn();
    });
  },

  // ---- ESTIMATE WIZARD ----

  estimateNextStep() {
    if (estimateStep === 1 && !validateEstimateStep1()) return;
    if (estimateStep === 2 && !validateEstimateStep2()) return;
    if (estimateStep === 3) { app.renderMaterials(); }
    if (estimateStep === 4) { app.recalcLabor(); }
    if (estimateStep === 5) { app.renderReview(); return; }

    document.getElementById(`estimate-step-${estimateStep}`).classList.remove('active');
    document.querySelectorAll('.wizard-step')[estimateStep - 1].classList.replace('active', 'complete');
    estimateStep++;
    document.getElementById(`estimate-step-${estimateStep}`).classList.add('active');
    document.querySelectorAll('.wizard-step')[estimateStep - 1].classList.add('active');

    if (estimateStep === 3) app.renderMaterials();
    if (estimateStep === 4) app.recalcLabor();
    if (estimateStep === 5) app.renderReview();
  },

  estimatePrevStep() {
    if (estimateStep <= 1) return;
    document.getElementById(`estimate-step-${estimateStep}`).classList.remove('active');
    document.querySelectorAll('.wizard-step')[estimateStep - 1].classList.remove('active');
    estimateStep--;
    document.getElementById(`estimate-step-${estimateStep}`).classList.add('active');
    document.querySelectorAll('.wizard-step')[estimateStep - 1].classList.replace('complete', 'active');
  },

  onFenceTypeChange() {
    // Optionally update height defaults per type
  },

  renderMaterials() {
    const type    = document.getElementById('fenceType').value;
    const height  = parseInt(document.getElementById('fenceHeight').value, 10);
    const footage = parseFloat(document.getElementById('fenceFootage').value) || 0;
    const gates   = parseInt(document.getElementById('numGates').value, 10) || 0;
    const price   = FENCE_PRICING[type] || { material: 5, labor: 4 };
    const container = document.getElementById('materialsBreakdown');

    if (!type || !footage) {
      container.innerHTML = '<p class="empty-state">Please complete fence specs.</p>';
      return;
    }

    const posts   = Math.ceil(footage / 10) + 1;
    const panels  = Math.ceil(footage / 8);
    const matCost = footage * price.material;
    const gateCost = gates * 120;

    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>Line Posts (${height} ft ${type})</td><td>${posts}</td><td>Each</td><td>$${price.material * 2.5}</td><td>$${(posts * price.material * 2.5).toFixed(2)}</td></tr>
          <tr><td>Fence Panels / Roll</td><td>${panels}</td><td>Panel</td><td>$${(price.material * 8).toFixed(2)}</td><td>$${(panels * price.material * 8).toFixed(2)}</td></tr>
          <tr><td>Terminal Posts</td><td>2</td><td>Each</td><td>$${(price.material * 3.5).toFixed(2)}</td><td>$${(2 * price.material * 3.5).toFixed(2)}</td></tr>
          <tr><td>Gates (${gates})</td><td>${gates}</td><td>Each</td><td>$120.00</td><td>$${gateCost.toFixed(2)}</td></tr>
          <tr><td>Hardware / Misc</td><td>1</td><td>Lot</td><td>$${(footage * 0.35).toFixed(2)}</td><td>$${(footage * 0.35).toFixed(2)}</td></tr>
        </tbody>
        <tfoot>
          <tr style="font-weight:700"><td colspan="4">Materials Subtotal</td><td>$${(matCost + gateCost + footage * 0.35).toFixed(2)}</td></tr>
        </tfoot>
      </table>`;
  },

  recalcLabor() {
    const crew   = parseInt(document.getElementById('crewSize').value, 10) || 3;
    const days   = parseFloat(document.getElementById('estimatedDays').value) || 1;
    const rate   = parseFloat(document.getElementById('laborRate').value) || 25;
    const hrs    = parseFloat(document.getElementById('hoursPerDay').value) || 8;
    const total  = crew * days * rate * hrs;
    const el     = document.getElementById('laborSummary');
    if (el) {
      el.innerHTML = `
        <div class="summary-row"><span>Crew Size</span><span>${crew} people</span></div>
        <div class="summary-row"><span>Days × Hours/Day</span><span>${days} × ${hrs} = ${days * hrs} hrs</span></div>
        <div class="summary-row"><span>Rate Per Person/Hr</span><span>$${rate}</span></div>
        <div class="summary-row"><span>Labor Total</span><span>$${total.toFixed(2)}</span></div>`;
    }
  },

  renderReview() {
    const type    = document.getElementById('fenceType').value || 'N/A';
    const height  = document.getElementById('fenceHeight').value;
    const footage = parseFloat(document.getElementById('fenceFootage').value) || 0;
    const name    = document.getElementById('custName').value;
    const addr    = document.getElementById('jobAddress').value;
    const price   = FENCE_PRICING[type] || { material: 5, labor: 4 };
    const matCost = footage * price.material;
    const labCost = (parseInt(document.getElementById('crewSize').value,10)||3) *
                    (parseFloat(document.getElementById('estimatedDays').value)||1) *
                    (parseFloat(document.getElementById('laborRate').value)||25) *
                    (parseFloat(document.getElementById('hoursPerDay').value)||8);
    const subtotal = matCost + labCost;
    const markup   = subtotal * 0.35;
    const total    = subtotal + markup;

    document.getElementById('estimateReview').innerHTML = `
      <div class="summary-box">
        <div class="summary-row"><span>Customer</span><span>${name}</span></div>
        <div class="summary-row"><span>Address</span><span>${addr}</span></div>
        <div class="summary-row"><span>Fence Type</span><span>${type} — ${height} ft</span></div>
        <div class="summary-row"><span>Linear Footage</span><span>${footage} ft</span></div>
        <div class="summary-row"><span>Materials</span><span>$${matCost.toFixed(2)}</span></div>
        <div class="summary-row"><span>Labor</span><span>$${labCost.toFixed(2)}</span></div>
        <div class="summary-row"><span>Overhead / Markup (35%)</span><span>$${markup.toFixed(2)}</span></div>
        <div class="summary-row"><span>TOTAL ESTIMATE</span><span>$${total.toFixed(2)}</span></div>
      </div>`;
  },

  saveEstimate() {
    const name  = document.getElementById('custName').value.trim();
    const type  = document.getElementById('fenceType').value;
    const footage = parseFloat(document.getElementById('fenceFootage').value) || 0;
    if (!name || !type || !footage) {
      app.toast('Please complete all required fields.', 'error'); return;
    }
    const price   = FENCE_PRICING[type] || { material: 5, labor: 4 };
    const matCost = footage * price.material;
    const labCost = (parseInt(document.getElementById('crewSize').value,10)||3) *
                    (parseFloat(document.getElementById('estimatedDays').value)||1) *
                    (parseFloat(document.getElementById('laborRate').value)||25) *
                    (parseFloat(document.getElementById('hoursPerDay').value)||8);
    const total = (matCost + labCost) * 1.35;
    const estimate = {
      id:          Date.now(),
      estimateNum: `EST-${new Date().getFullYear()}-${String(getCollection('estimates').length + 1).padStart(4,'0')}`,
      status:      'open',
      createdAt:   new Date().toISOString(),
      customer:    { name, phone: document.getElementById('custPhone').value, email: document.getElementById('custEmail').value },
      address:     { street: document.getElementById('jobAddress').value, city: document.getElementById('jobCity').value, state: document.getElementById('jobState').value },
      specs:       { type, height: document.getElementById('fenceHeight').value, footage, color: document.getElementById('fenceColor').value, gates: parseInt(document.getElementById('numGates').value,10)||0, terrain: document.getElementById('terrain').value },
      costs:       { materials: matCost, labor: labCost, total },
    };
    const estimates = getCollection('estimates');
    estimates.push(estimate);
    saveCollection('estimates', estimates);
    app.toast(`Estimate ${estimate.estimateNum} saved!`, 'success');
    app.switchTab('projects');
    app.resetEstimateWizard();
  },

  resetEstimateWizard() {
    estimateStep = 1;
    document.querySelectorAll('.wizard-panel').forEach((p,i) => {
      p.classList.toggle('active', i === 0);
    });
    document.querySelectorAll('.wizard-step').forEach((s,i) => {
      s.className = `wizard-step${i === 0 ? ' active' : ''}`;
    });
    ['custName','custPhone','custEmail','jobAddress','jobCity','jobState',
     'fenceFootage','numGates'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  },

  printEstimate() { window.print(); },

  // ---- MODAL ----

  openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modal').style.display = 'flex';
  },

  closeModal(e) {
    if (!e || e.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  },

  // ---- TOAST ----

  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  },

  // ---- SETTINGS ----

  saveCompanySettings() {
    const settings = {
      company: document.getElementById('settCompany').value,
      phone:   document.getElementById('settPhone').value,
      email:   document.getElementById('settEmail').value,
      address: document.getElementById('settAddress').value,
      license: document.getElementById('settLicense').value,
      website: document.getElementById('settWebsite').value,
    };
    state.companySettings = settings;
    saveState();
    app.toast('Company settings saved!', 'success');
  },

  testConnection() {
    const url = document.getElementById('settApiUrl').value.trim();
    const status = document.getElementById('apiStatus');
    status.textContent = 'Testing...';
    fetch(`${url}/health`, { signal: AbortSignal.timeout(5000) })
      .then(r => { status.textContent = r.ok ? '✅ Connected!' : '⚠️ Server error'; status.style.color = r.ok ? 'green' : 'orange'; })
      .catch(() => { status.textContent = '❌ Cannot connect'; status.style.color = 'red'; });
  },

  saveApiSettings() {
    const url = document.getElementById('settApiUrl').value.trim();
    localStorage.setItem('apiUrl', url);
    app.toast('API settings saved.', 'success');
  },

  savePricingSettings() {
    state.pricingSettings = {
      markup:        document.getElementById('defaultMarkup').value,
      laborOverhead: document.getElementById('laborOverhead').value,
      taxRate:       document.getElementById('taxRate').value,
      minCharge:     document.getElementById('minJobCharge').value,
    };
    saveState();
    document.getElementById('pricingSaveStatus').textContent = '✅ Saved';
    setTimeout(() => { document.getElementById('pricingSaveStatus').textContent = ''; }, 2000);
  },

  exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `fence-estimator-backup-${Date.now()}.json`;
    a.click();
  },

  importData() {
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const reader = new FileReader();
      reader.onload  = ev => {
        try {
          state = JSON.parse(ev.target.result);
          saveState();
          app.initAllTabs();
          app.toast('Data imported!', 'success');
        } catch { app.toast('Invalid JSON file.', 'error'); }
      };
      reader.readAsText(e.target.files[0]);
    };
    input.click();
  },

  clearAllData() {
    if (confirm('Clear ALL local data? This cannot be undone.')) {
      localStorage.removeItem(LS_KEY);
      state = {};
      app.initAllTabs();
      app.toast('All data cleared.', 'info');
    }
  },

  // ---- MAP TOOL STUB ----

  loadMap() {
    const addr = document.getElementById('mapAddress').value.trim();
    if (!addr) { app.toast('Enter an address first.', 'error'); return; }
    const container = document.getElementById('mapContainer');
    const encoded   = encodeURIComponent(addr);
    container.innerHTML = `<iframe
      src="https://maps.google.com/maps?q=${encoded}&t=k&z=18&ie=UTF8&iwloc=&output=embed"
      allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  },

  // ---- MISC STUBS (delegated to tab JS files) ----
  addMaterialRow() {  if (typeof materialsTabRefresh==='function') materialsTabAddRow(); },
  addInventoryItem() { if (typeof inventoryTabAddItem==='function') inventoryTabAddItem(); },
  filterInventory(q) { if (typeof inventoryTabFilter==='function') inventoryTabFilter(q); },
  filterProjects(q)  { if (typeof projectsTabFilter==='function') projectsTabFilter(q); },
  addSupplier()      { if (typeof suppliersTabAdd==='function') suppliersTabAdd(); },
  newChangeOrder()   { if (typeof changeOrdersTabNew==='function') changeOrdersTabNew(); },
  addNote()          { if (typeof notesTabAdd==='function') notesTabAdd(); },
  addCrewMember()    { if (typeof crewTabAdd==='function') crewTabAdd(); },
  printReport(type)  { if (typeof reportsTabPrint==='function') reportsTabPrint(type); },
  loadSignOffProject(id) { if (typeof signOffTabLoad==='function') signOffTabLoad(id); },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function toCamelCase(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function validateEstimateStep1() {
  const name = document.getElementById('custName').value.trim();
  const addr = document.getElementById('jobAddress').value.trim();
  if (!name || !addr) { app.toast('Customer name and address are required.', 'error'); return false; }
  return true;
}

function validateEstimateStep2() {
  const type    = document.getElementById('fenceType').value;
  const footage = parseFloat(document.getElementById('fenceFootage').value);
  if (!type)        { app.toast('Select a fence type.', 'error'); return false; }
  if (!footage || footage <= 0) { app.toast('Enter a valid linear footage.', 'error'); return false; }
  return true;
}

// ---------------------------------------------------------------------------
// BOOT
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  app.checkAuth();
});
