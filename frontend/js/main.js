/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Main JavaScript – Application Bootstrap & State Management
 */

'use strict';

// ============================================================
// APPLICATION STATE
// ============================================================
const AppState = {
  projectInfo:   {},
  fenceSpecs:    {},
  layout:        {},
  materials:     [],
  labor:         {},
  equipment:     [],
  estimateSummary: {},
  contract:      { locked: false, price: 0 },
  changeOrders:  [],
  invoices:      [],
  schedule:      {},
  crew:          [],
  purchaseOrders:[],
  trackingLog:   [],
  signOff:       {},
  estimateNumber: null,
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  generateEstimateNumber();
  loadFromStorage();
  initTabNavigation();
  calcLabor();
  calcEquipmentTotal();
  calcSummary();
  setStatus('Application loaded – ready');
});

function generateEstimateNumber() {
  const year = new Date().getFullYear();
  const seq  = (parseInt(localStorage.getItem('estimateSeq') || '0', 10)) + 1;
  localStorage.setItem('estimateSeq', seq);
  const num  = `FD-${year}-${String(seq).padStart(4, '0')}`;
  AppState.estimateNumber = num;
  const el = document.getElementById('estimate-number');
  if (el) el.value = num;
}

// ============================================================
// TAB NAVIGATION
// ============================================================
function initTabNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      goToTab(tabId);
    });
  });
}

function goToTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const btn   = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const panel = document.getElementById(`tab-${tabId}`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');

  // Scroll tab button into view
  if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// ============================================================
// STATUS BAR
// ============================================================
function setStatus(msg) {
  const el = document.getElementById('status-msg');
  if (el) el.textContent = msg;
}

// ============================================================
// LOCAL STORAGE PERSISTENCE
// ============================================================
function saveToStorage() {
  localStorage.setItem('fenceEstimatorState', JSON.stringify(AppState));
  showAutosave();
}

function loadFromStorage() {
  const raw = localStorage.getItem('fenceEstimatorState');
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    Object.assign(AppState, saved);
    populateFormsFromState();
  } catch (e) {
    console.error('Failed to load saved state', e);
  }
}

function showAutosave() {
  const el = document.getElementById('autosave-indicator');
  if (!el) return;
  el.textContent = '✔ Saved ' + new Date().toLocaleTimeString();
  setTimeout(() => { el.textContent = ''; }, 3000);
}

function populateFormsFromState() {
  // Project Info
  const pi = AppState.projectInfo || {};
  setValue('customer-first', pi.firstName);
  setValue('customer-last',  pi.lastName);
  setValue('customer-phone', pi.phone);
  setValue('customer-email', pi.email);
  setValue('install-address',pi.address);
  setValue('install-city',   pi.city);
  setValue('install-state',  pi.state);
  setValue('install-zip',    pi.zip);
  setValue('sales-rep',      pi.salesRep);
  setValue('project-notes',  pi.notes);
  setValue('job-type',       pi.jobType);
  if (pi.date) setValue('project-date', pi.date);

  // Fence Specs
  const fs = AppState.fenceSpecs || {};
  setValue('fence-type',    fs.fenceType);
  setValue('fence-height',  fs.height);
  setValue('fence-gauge',   fs.gauge);
  setValue('mesh-size',     fs.meshSize);
  setValue('fence-color',   fs.color);
  setValue('post-spacing',  fs.postSpacing);
  setValue('gates-count',   fs.gatesCount);
  setValue('gate-width',    fs.gateWidth);
  setValue('barbed-wire',   fs.barbedWire);
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) el.value = val;
}

// ============================================================
// FORM SAVE HANDLERS
// ============================================================
function saveProjectInfo() {
  AppState.projectInfo = {
    estimateNumber: AppState.estimateNumber,
    date:      document.getElementById('project-date')?.value,
    firstName: document.getElementById('customer-first')?.value,
    lastName:  document.getElementById('customer-last')?.value,
    phone:     document.getElementById('customer-phone')?.value,
    email:     document.getElementById('customer-email')?.value,
    address:   document.getElementById('install-address')?.value,
    city:      document.getElementById('install-city')?.value,
    state:     document.getElementById('install-state')?.value,
    zip:       document.getElementById('install-zip')?.value,
    salesRep:  document.getElementById('sales-rep')?.value,
    jobType:   document.getElementById('job-type')?.value,
    notes:     document.getElementById('project-notes')?.value,
  };
  saveToStorage();
  setStatus('Project info saved');
  goToTab('fence-specs');
}

function saveFenceSpecs() {
  AppState.fenceSpecs = {
    fenceType:    document.getElementById('fence-type')?.value,
    height:       document.getElementById('fence-height')?.value,
    gauge:        document.getElementById('fence-gauge')?.value,
    meshSize:     document.getElementById('mesh-size')?.value,
    color:        document.getElementById('fence-color')?.value,
    terminalPost: document.getElementById('terminal-post')?.value,
    linePost:     document.getElementById('line-post')?.value,
    postSpacing:  document.getElementById('post-spacing')?.value,
    topRail:      document.getElementById('top-rail')?.value,
    gatesCount:   document.getElementById('gates-count')?.value,
    gateWidth:    document.getElementById('gate-width')?.value,
    barbedWire:   document.getElementById('barbed-wire')?.value,
  };
  saveToStorage();
  setStatus('Fence specs saved');
  goToTab('layout');
}

function saveLayout() {
  AppState.layout = {
    footage:        document.getElementById('total-footage')?.value,
    perimeterNotes: document.getElementById('perimeter-notes')?.value,
    terrain:        document.getElementById('terrain')?.value,
    fenceRemoval:   document.getElementById('fence-removal')?.value,
  };
  saveToStorage();
  setStatus('Layout saved');
  goToTab('materials');
}

function saveMaterials() {
  saveToStorage();
  setStatus('Materials saved');
  goToTab('labor');
}

function saveLabor() {
  AppState.labor = {
    crewSize:    document.getElementById('crew-size')?.value,
    hourlyRate:  document.getElementById('hourly-rate')?.value,
    hours:       document.getElementById('labor-hours')?.value,
    markup:      document.getElementById('labor-markup')?.value,
    notes:       document.getElementById('labor-notes')?.value,
  };
  saveToStorage();
  setStatus('Labor saved');
  goToTab('equipment');
}

function saveEquipment() {
  saveToStorage();
  setStatus('Equipment saved');
  goToTab('estimate-summary');
}

function saveSchedule() {
  AppState.schedule = {
    start:    document.getElementById('sched-start')?.value,
    end:      document.getElementById('sched-end')?.value,
    crew:     document.getElementById('sched-crew')?.value,
    priority: document.getElementById('sched-priority')?.value,
    notes:    document.getElementById('sched-notes')?.value,
  };
  saveToStorage();
  setStatus('Schedule saved');
  goToTab('crew-management');
}

// ============================================================
// FENCE TYPE OPTIONS
// ============================================================
function updateFenceOptions() {
  const type = document.getElementById('fence-type')?.value;
  const gaugeGroup = document.getElementById('fence-gauge')?.closest('.form-group');
  const meshGroup  = document.getElementById('mesh-size')?.closest('.form-group');
  if (!type) return;

  const isChainLink = type === 'chain-link';
  if (gaugeGroup) gaugeGroup.style.display = isChainLink ? 'flex' : 'none';
  if (meshGroup)  meshGroup.style.display  = isChainLink ? 'flex' : 'none';
}

// ============================================================
// LABOR CALCULATION
// ============================================================
function calcLabor() {
  const crew   = parseFloat(document.getElementById('crew-size')?.value  || 0);
  const rate   = parseFloat(document.getElementById('hourly-rate')?.value || 0);
  const hours  = parseFloat(document.getElementById('labor-hours')?.value || 0);
  const markup = parseFloat(document.getElementById('labor-markup')?.value || 0) / 100;

  const base  = crew * rate * hours;
  const total = base * (1 + markup);

  const el1 = document.getElementById('labor-total');
  const el2 = document.getElementById('labor-total-markup');
  if (el1) el1.value = '$' + base.toFixed(2);
  if (el2) el2.value = '$' + total.toFixed(2);

  AppState.labor.total       = base;
  AppState.labor.totalMarkup = total;
  calcSummary();
}

// ============================================================
// EQUIPMENT
// ============================================================
function addEquipmentRow() {
  const tbody = document.getElementById('equipment-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="Equipment name" /></td>
    <td><input type="number" value="1" min="0" oninput="calcEquipmentRow(this)" /></td>
    <td><input type="number" value="0" min="0" oninput="calcEquipmentRow(this)" /></td>
    <td class="row-total">$0.00</td>
    <td><button type="button" onclick="removeRow(this)">✕</button></td>`;
  tbody.appendChild(tr);
  clearEmptyRow(tbody);
}

function calcEquipmentRow(input) {
  const tr   = input.closest('tr');
  const days = parseFloat(tr.querySelector('td:nth-child(2) input')?.value || 0);
  const rate = parseFloat(tr.querySelector('td:nth-child(3) input')?.value || 0);
  const total = tr.querySelector('.row-total');
  if (total) total.textContent = '$' + (days * rate).toFixed(2);
  calcEquipmentTotal();
}

function calcEquipmentTotal() {
  let total = 0;
  document.querySelectorAll('#equipment-body .row-total').forEach(el => {
    total += parseFloat(el.textContent.replace('$', '') || 0);
  });
  const el = document.getElementById('equipment-total');
  if (el) el.textContent = '$' + total.toFixed(2);
  AppState.equipment.total = total;
  calcSummary();
}

// ============================================================
// ESTIMATE SUMMARY
// ============================================================
function calcSummary() {
  const matTotal  = AppState.estimateSummary?.materialsTotal || 0;
  const labTotal  = AppState.labor?.totalMarkup || 0;
  const eqTotal   = AppState.equipment?.total   || 0;
  const taxRate   = parseFloat(document.getElementById('tax-rate')?.value || 0) / 100;
  const profitPct = parseFloat(document.getElementById('profit-margin')?.value || 0) / 100;

  const subtotal  = matTotal + labTotal + eqTotal;
  const tax       = subtotal * taxRate;
  const total     = subtotal + tax;
  const profit    = total * profitPct;

  setText('sum-materials', '$' + matTotal.toFixed(2));
  setText('sum-labor',     '$' + labTotal.toFixed(2));
  setText('sum-equipment', '$' + eqTotal.toFixed(2));
  setText('sum-subtotal',  '$' + subtotal.toFixed(2));
  setText('sum-tax',       '$' + tax.toFixed(2));
  setText('sum-total',     '$' + total.toFixed(2));
  const profEl = document.getElementById('sum-profit-amount');
  if (profEl) profEl.textContent = `Profit: $${profit.toFixed(2)}`;

  AppState.estimateSummary = { materialsTotal: matTotal, laborTotal: labTotal, equipmentTotal: eqTotal, subtotal, tax, total, profit };
}

function buildEstimate() {
  calcSummary();
  const total = AppState.estimateSummary.total || 0;
  setStatus(`Estimate built – Total: $${total.toFixed(2)}`);
  alert(`✅ Estimate Built!\n\nEstimate #: ${AppState.estimateNumber}\nCustomer: ${AppState.projectInfo.firstName || ''} ${AppState.projectInfo.lastName || ''}\nTotal: $${total.toFixed(2)}\n\nContinue to Contract to lock in the price.`);
}

function applyMarkup() {
  const markup = parseFloat(document.getElementById('material-markup')?.value || 0) / 100;
  const base   = AppState.estimateSummary?.materialsTotal || 0;
  const after  = base * (1 + markup);
  const el     = document.getElementById('material-total-after-markup');
  if (el) el.textContent = `Total after markup: $${after.toFixed(2)}`;
  AppState.estimateSummary.materialsTotal = after;
  calcSummary();
}

// ============================================================
// LAYOUT HELPERS
// ============================================================
function addLayoutSide() {
  const tbody = document.getElementById('layout-sides-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="Side" /></td>
    <td><input type="number" class="side-footage" min="0" oninput="sumSides()" /></td>
    <td><input type="text" placeholder="notes..." /></td>
    <td><button type="button" onclick="removeRow(this)">✕</button></td>`;
  tbody.appendChild(tr);
  clearEmptyRow(tbody);
}

function sumSides() {
  let total = 0;
  document.querySelectorAll('.side-footage').forEach(el => {
    total += parseFloat(el.value || 0);
  });
  const el = document.getElementById('calc-footage');
  if (el) el.value = total + ' ft';
  const manEl = document.getElementById('total-footage');
  if (manEl && !manEl.value) manEl.value = total;
}

function recalcLayout() { sumSides(); }

// ============================================================
// CHANGE ORDERS
// ============================================================
let coCounter = 0;

function addChangeOrder() {
  document.getElementById('co-modal').style.display = 'flex';
}
function closeCOModal() {
  document.getElementById('co-modal').style.display = 'none';
}
function saveChangeOrder() {
  coCounter++;
  const desc   = document.getElementById('co-description')?.value || '';
  const amount = parseFloat(document.getElementById('co-amount')?.value || 0);
  const reason = document.getElementById('co-reason')?.value || '';

  AppState.changeOrders.push({ id: coCounter, date: new Date().toLocaleDateString(), desc, amount, reason, status: 'Pending', signed: false });
  renderChangeOrders();
  updateRevisedTotal();
  closeCOModal();
  saveToStorage();
  setStatus(`Change Order #${coCounter} added`);
}

function renderChangeOrders() {
  const tbody = document.getElementById('change-orders-body');
  if (!tbody) return;
  if (!AppState.changeOrders.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No change orders yet</td></tr>';
    return;
  }
  tbody.innerHTML = AppState.changeOrders.map(co => `
    <tr>
      <td>CO-${String(co.id).padStart(3,'0')}</td>
      <td>${co.date}</td>
      <td>${co.desc}</td>
      <td>$${co.amount.toFixed(2)}</td>
      <td>${co.status}</td>
      <td>${co.signed ? '✅' : '❌'}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="approveCO(${co.id})">Approve</button>
        <button class="btn btn-sm btn-danger"  onclick="deleteCO(${co.id})">Delete</button>
      </td>
    </tr>`).join('');
}

function approveCO(id) {
  const co = AppState.changeOrders.find(c => c.id === id);
  if (co) { co.status = 'Approved'; co.signed = true; }
  renderChangeOrders();
  updateRevisedTotal();
  saveToStorage();
}
function deleteCO(id) {
  AppState.changeOrders = AppState.changeOrders.filter(c => c.id !== id);
  renderChangeOrders();
  updateRevisedTotal();
  saveToStorage();
}

function updateRevisedTotal() {
  const base      = AppState.contract.price || AppState.estimateSummary.total || 0;
  const coTotal   = AppState.changeOrders.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);
  const revised   = base + coTotal;
  setText('revised-total', '$' + revised.toFixed(2));
}

// ============================================================
// TRACKING
// ============================================================
function addTrackingNote() {
  const note = prompt('Enter progress note:');
  if (!note) return;
  AppState.trackingLog.push({ date: new Date().toLocaleDateString(), note, by: AppState.projectInfo.salesRep || 'Team' });
  renderTrackingLog();
  saveToStorage();
}

function renderTrackingLog() {
  const tbody = document.getElementById('tracking-log-body');
  if (!tbody) return;
  if (!AppState.trackingLog.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No progress notes yet</td></tr>';
    return;
  }
  tbody.innerHTML = AppState.trackingLog.map((n, i) => `
    <tr>
      <td>${n.date}</td>
      <td>${n.note}</td>
      <td>${n.by}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteNote(${i})">Delete</button></td>
    </tr>`).join('');
}

function deleteNote(idx) {
  AppState.trackingLog.splice(idx, 1);
  renderTrackingLog();
  saveToStorage();
}

// ============================================================
// PROJECT COMPLETION
// ============================================================
function completeProject() {
  AppState.signOff = {
    date:      document.getElementById('signoff-date')?.value,
    collected: document.getElementById('final-collected')?.value,
    notes:     document.getElementById('signoff-notes')?.value,
    completed: true,
  };
  setText('track-status', 'Complete ✅');
  const bar = document.getElementById('track-progress-bar');
  if (bar) bar.style.width = '100%';
  setText('track-pct', '100%');
  saveToStorage();
  setStatus('Project marked complete!');
  alert('✅ Project marked as COMPLETE!\n\nThank you for using Fence Depot Fence Estimator.');
}

// ============================================================
// UTILITIES
// ============================================================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function removeRow(btn) {
  const tr = btn.closest('tr');
  if (tr) tr.remove();
  calcEquipmentTotal();
  sumSides();
}

function clearEmptyRow(tbody) {
  tbody.querySelectorAll('.empty-row').forEach(tr => tr.closest('tr')?.remove());
}

function saveAll() {
  saveToStorage();
  setStatus('All data saved');
  alert('✅ All data saved successfully!');
}

function addCrewMember() {
  const name = prompt('Crew member name:');
  if (!name) return;
  const role = prompt('Role (Installer, Foreman, Helper):') || 'Installer';
  const rate = prompt('Hourly rate ($):') || '0';
  AppState.crew.push({ name, role, rate: parseFloat(rate), phone: '', assigned: true });
  renderCrew();
  saveToStorage();
}

function renderCrew() {
  const tbody = document.getElementById('crew-body');
  if (!tbody) return;
  if (!AppState.crew.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No crew members added</td></tr>';
    return;
  }
  tbody.innerHTML = AppState.crew.map((m, i) => `
    <tr>
      <td>${m.name}</td>
      <td>${m.role}</td>
      <td>$${m.rate.toFixed(2)}/hr</td>
      <td>${m.phone || '-'}</td>
      <td>${m.assigned ? '✅' : '—'}</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeCrew(${i})">Remove</button></td>
    </tr>`).join('');
}

function removeCrew(i) {
  AppState.crew.splice(i, 1);
  renderCrew();
  saveToStorage();
}

function generateInvoice() {
  const invoiceNum = `INV-${AppState.estimateNumber}-${AppState.invoices.length + 1}`;
  const amount = AppState.estimateSummary.total || 0;
  AppState.invoices.push({ num: invoiceNum, date: new Date().toLocaleDateString(), amount, paid: 0, balance: amount });
  renderInvoices();
  saveToStorage();
  setStatus(`Invoice ${invoiceNum} created`);
}

function renderInvoices() {
  const tbody = document.getElementById('invoices-body');
  if (!tbody) return;
  if (!AppState.invoices.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No invoices yet</td></tr>';
    return;
  }
  tbody.innerHTML = AppState.invoices.map(inv => `
    <tr>
      <td>${inv.num}</td>
      <td>${inv.date}</td>
      <td>$${inv.amount.toFixed(2)}</td>
      <td>$${inv.paid.toFixed(2)}</td>
      <td>$${inv.balance.toFixed(2)}</td>
      <td><button class="btn btn-sm btn-outline" onclick="printInvoice('${inv.num}')">Print</button></td>
    </tr>`).join('');
}

function generatePO() {
  const poNum = `PO-${AppState.estimateNumber}-${AppState.purchaseOrders.length + 1}`;
  const supplier = prompt('Supplier name:') || 'Fence Depot Supplier';
  const amount = AppState.estimateSummary.materialsTotal || 0;
  AppState.purchaseOrders.push({ num: poNum, supplier, date: new Date().toLocaleDateString(), total: amount, status: 'Pending' });
  renderPOs();
  saveToStorage();
  setStatus(`Purchase Order ${poNum} created`);
}

function renderPOs() {
  const tbody = document.getElementById('po-body');
  if (!tbody) return;
  if (!AppState.purchaseOrders.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No purchase orders yet</td></tr>';
    return;
  }
  tbody.innerHTML = AppState.purchaseOrders.map(po => `
    <tr>
      <td>${po.num}</td>
      <td>${po.supplier}</td>
      <td>${po.date}</td>
      <td>$${po.total.toFixed(2)}</td>
      <td>${po.status}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="approvePO('${po.num}')">Approve</button>
        <button class="btn btn-sm btn-outline" onclick="printPO('${po.num}')">Print</button>
      </td>
    </tr>`).join('');
}

function approvePO(num) {
  const po = AppState.purchaseOrders.find(p => p.num === num);
  if (po) po.status = 'Approved';
  renderPOs();
  saveToStorage();
}

// ============================================================
// PRINT / REPORT STUBS
// ============================================================
function printEstimate() { window.print(); }
function printContract() { window.print(); }
function printInvoice()  { window.print(); }
function printPO()       { window.print(); }

function runReport(type) {
  const el = document.getElementById('report-output');
  if (!el) return;
  const pi = AppState.projectInfo;
  const es = AppState.estimateSummary;
  switch (type) {
    case 'cost-breakdown':
      el.textContent = `COST BREAKDOWN – ${AppState.estimateNumber}\n` +
        `Customer: ${pi.firstName || ''} ${pi.lastName || ''}\n` +
        `Materials:  $${(es.materialsTotal || 0).toFixed(2)}\n` +
        `Labor:      $${(es.laborTotal || 0).toFixed(2)}\n` +
        `Equipment:  $${(es.equipmentTotal || 0).toFixed(2)}\n` +
        `Subtotal:   $${(es.subtotal || 0).toFixed(2)}\n` +
        `Tax:        $${(es.tax || 0).toFixed(2)}\n` +
        `TOTAL:      $${(es.total || 0).toFixed(2)}\n`;
      break;
    case 'profit-loss':
      el.textContent = `PROFIT & LOSS\nTotal Revenue: $${(es.total || 0).toFixed(2)}\nEstimated Profit: $${(es.profit || 0).toFixed(2)}`;
      break;
    case 'project-history':
      el.textContent = `PROJECT HISTORY\n${AppState.trackingLog.map(n => `${n.date}: ${n.note}`).join('\n') || 'No notes recorded.'}`;
      break;
    default:
      el.textContent = `${type.toUpperCase()} report generated for ${AppState.estimateNumber}.\nPrint functionality requires PDF library integration.`;
  }
}

// ============================================================
// MAP STUB
// ============================================================
function searchMapAddress() {
  const addr = document.getElementById('map-search-input')?.value;
  if (!addr) return;
  setStatus(`Map search: ${addr} – Google Maps API key required in backend .env`);
}
