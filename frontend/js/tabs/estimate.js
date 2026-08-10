/* ═══════════════════════════════════════════════════════════════
   estimate.js – 5-step estimate wizard + material calculation
   ═══════════════════════════════════════════════════════════════ */
'use strict';

let currentStep = 1;
const TOTAL_STEPS = 5;

/* ── step navigation ────────────────────────────────────────── */
function goToStep(n) {
  document.querySelectorAll('.wizard-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.wstep').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === n) el.classList.add('active');
    if (i + 1 < n)  el.classList.add('done');
  });
  document.getElementById('wiz-back-btn').style.display = n > 1 ? '' : 'none';
  document.getElementById('wiz-next-btn').textContent   = n < TOTAL_STEPS ? 'Next →' : 'Save Estimate';
  currentStep = n;
  if (n === 5) buildReview();
}

document.getElementById('wiz-next-btn').addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  else saveEstimate();
});
document.getElementById('wiz-back-btn').addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

function validateStep(n) {
  if (n === 1) {
    const fname = document.getElementById('est-fname').value.trim();
    const lname = document.getElementById('est-lname').value.trim();
    if (!fname || !lname) { App.toast('Please enter customer name', 'error'); return false; }
  }
  if (n === 2) {
    const type = document.getElementById('est-fence-type').value;
    const ft   = document.getElementById('est-footage').value;
    if (!type) { App.toast('Please select a fence type', 'error'); return false; }
    if (!ft || ft <= 0) { App.toast('Please enter linear footage', 'error'); return false; }
  }
  return true;
}

/* ── material calculation ───────────────────────────────────── */
document.getElementById('calc-materials-btn').addEventListener('click', () => {
  const ft       = parseFloat(document.getElementById('est-footage').value) || 0;
  const ftype    = document.getElementById('est-fence-type').value;
  const height   = parseInt(document.getElementById('est-height').value) || 6;
  const walkGates  = parseInt(document.getElementById('est-walk-gates').value)  || 0;
  const driveGates = parseInt(document.getElementById('est-drive-gates').value) || 0;

  if (!ft || !ftype) { App.toast('Complete fence specs first', 'error'); return; }

  const items = calcMaterials(ftype, height, ft, walkGates, driveGates);
  renderMaterialsTable(items);
  calcCosts(items, ft);
});

function calcMaterials(ftype, height, ft, walkGates, driveGates) {
  const items = [];
  const posts = Math.ceil(ft / 10) + 1;

  if (ftype === 'chain-link') {
    const meshRolls = Math.ceil(ft / 50);
    items.push({ plu: 'CL-MESH', desc: `Chain Link Mesh ${height}ft`, qty: meshRolls, unit: 'Roll', price: 89.99 });
    items.push({ plu: 'CL-POST', desc: `Line Post ${height+1}ft`,       qty: posts,      unit: 'Each', price: 14.99 });
    items.push({ plu: 'CL-TOPRL',desc: 'Top Rail 21ft',                  qty: Math.ceil(ft/21), unit: 'Each', price: 18.49 });
    items.push({ plu: 'CL-TENWIRE',desc: 'Tension Wire',                 qty: Math.ceil(ft/200), unit: 'Roll', price: 24.99 });
    items.push({ plu: 'CL-BRBND', desc: 'Brace Band',                   qty: posts * 2,  unit: 'Each', price: 0.89 });
    items.push({ plu: 'CL-CONCRETE', desc: 'Concrete (80lb bag)',        qty: posts * 2,  unit: 'Bag',  price: 6.49 });
    if (walkGates  > 0) items.push({ plu: 'CL-WGATE', desc: `Walk Gate ${height}ft`, qty: walkGates,  unit: 'Each', price: 139 });
    if (driveGates > 0) items.push({ plu: 'CL-DGATE', desc: `Drive Gate ${height}ft Dbl`, qty: driveGates, unit: 'Set', price: 349 });
  } else if (ftype === 'wood') {
    const pickets = Math.ceil(ft * (height === 8 ? 2.5 : 2));
    items.push({ plu: 'WD-PICKET', desc: `Cedar Picket ${height}ft`,     qty: pickets,    unit: 'Each', price: 2.89 });
    items.push({ plu: 'WD-POST',   desc: '4x4x10 Cedar Post',            qty: posts,      unit: 'Each', price: 18.99 });
    items.push({ plu: 'WD-RAIL',   desc: '2x4x8 Rail',                   qty: Math.ceil(ft / 8) * 2, unit: 'Each', price: 5.29 });
    items.push({ plu: 'WD-SCREWS', desc: 'Decking Screws (1lb box)',      qty: Math.ceil(pickets / 50), unit: 'Box', price: 7.99 });
    items.push({ plu: 'WD-CONCRETE','desc': 'Concrete (80lb bag)',        qty: posts * 2,  unit: 'Bag',  price: 6.49 });
    if (walkGates  > 0) items.push({ plu: 'WD-WGATE', desc: `Wood Walk Gate ${height}ft`, qty: walkGates, unit: 'Each', price: 189 });
    if (driveGates > 0) items.push({ plu: 'WD-DGATE', desc: `Wood Drive Gate ${height}ft`, qty: driveGates, unit: 'Set', price: 429 });
  } else if (ftype === 'vinyl') {
    const panels = Math.ceil(ft / 8);
    items.push({ plu: 'VY-PANEL', desc: `Vinyl Privacy Panel ${height}ft`, qty: panels,  unit: 'Each', price: 59.99 });
    items.push({ plu: 'VY-POST',  desc: `Vinyl Post ${height+2}ft`,         qty: posts,   unit: 'Each', price: 34.99 });
    items.push({ plu: 'VY-CONCRETE','desc':'Concrete (80lb bag)',            qty: posts*2, unit: 'Bag',  price: 6.49 });
    if (walkGates  > 0) items.push({ plu: 'VY-WGATE', desc: `Vinyl Walk Gate`, qty: walkGates, unit: 'Each', price: 199 });
    if (driveGates > 0) items.push({ plu: 'VY-DGATE', desc: `Vinyl Drive Gate Dbl`, qty: driveGates, unit: 'Set', price: 499 });
  } else if (ftype === 'ornamental') {
    const panels = Math.ceil(ft / 8);
    items.push({ plu: 'OM-PANEL', desc: `Ornamental Panel ${height}ft`,  qty: panels,  unit: 'Each', price: 89.99 });
    items.push({ plu: 'OM-POST',  desc: `Ornamental Post ${height+2}ft`, qty: posts,   unit: 'Each', price: 44.99 });
    items.push({ plu: 'OM-CONCRETE','desc':'Concrete (80lb bag)',          qty: posts*2, unit: 'Bag',  price: 6.49 });
    if (walkGates  > 0) items.push({ plu: 'OM-WGATE', desc: `Ornamental Walk Gate`, qty: walkGates,  unit: 'Each', price: 289 });
    if (driveGates > 0) items.push({ plu: 'OM-DGATE', desc: `Ornamental Drive Gate Dbl`, qty: driveGates, unit: 'Set', price: 689 });
  } else if (ftype === 'aluminum') {
    const panels = Math.ceil(ft / 6);
    items.push({ plu: 'AL-PANEL', desc: `Aluminum Panel ${height}ft`,  qty: panels,  unit: 'Each', price: 69.99 });
    items.push({ plu: 'AL-POST',  desc: `Aluminum Post`,               qty: posts,   unit: 'Each', price: 29.99 });
    items.push({ plu: 'AL-CONCRETE','desc':'Concrete (80lb bag)',        qty: posts*2, unit: 'Bag',  price: 6.49 });
    if (walkGates  > 0) items.push({ plu: 'AL-WGATE', desc: `Aluminum Walk Gate`, qty: walkGates,  unit: 'Each', price: 219 });
    if (driveGates > 0) items.push({ plu: 'AL-DGATE', desc: `Aluminum Drive Gate Dbl`, qty: driveGates, unit: 'Set', price: 549 });
  }
  return items;
}

function renderMaterialsTable(items) {
  const tbl = document.getElementById('materials-table');
  const body = document.getElementById('materials-body');
  body.innerHTML = items.map(it => {
    const total = it.qty * it.price;
    return `<tr>
      <td>${App.escHtml(it.plu)}</td>
      <td>${App.escHtml(it.desc)}</td>
      <td>${App.escHtml(it.qty)}</td>
      <td>${App.escHtml(it.unit)}</td>
      <td>${App.escHtml(App.fmtCurrency(it.price))}</td>
      <td>${App.escHtml(App.fmtCurrency(total))}</td>
    </tr>`;
  }).join('');
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  document.getElementById('materials-subtotal').textContent = App.fmtCurrency(subtotal);
  tbl.style.display = '';
  document.getElementById('labor-section').style.display = '';
  document.getElementById('materials-output').querySelector('p').style.display = 'none';

  // store for later
  window._estimateItems = items;
  calcCosts(items, parseFloat(document.getElementById('est-footage').value) || 0);
}

function calcCosts(items, ft) {
  const subtotal  = items.reduce((s, i) => s + i.qty * i.price, 0);
  const laborRate = parseFloat(document.getElementById('labor-rate').value) || 12;
  const markupPct = parseFloat(document.getElementById('markup-pct').value) || 20;
  const labor     = ft * laborRate;
  const markup    = (subtotal + labor) * (markupPct / 100);
  const grand     = subtotal + labor + markup;

  document.getElementById('cost-summary').innerHTML = `
    <div class="cost-row"><span>Materials Subtotal:</span><span>${App.fmtCurrency(subtotal)}</span></div>
    <div class="cost-row"><span>Labor (${ft} ft × ${App.fmtCurrency(laborRate)}/ft):</span><span>${App.fmtCurrency(labor)}</span></div>
    <div class="cost-row"><span>Markup (${markupPct}%):</span><span>${App.fmtCurrency(markup)}</span></div>
    <div class="cost-row cost-total"><span>Grand Total:</span><span>${App.fmtCurrency(grand)}</span></div>`;

  window._estimateTotals = { subtotal, labor, markup, grand };
}

// recalc on labor/markup change
['labor-rate','markup-pct'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (window._estimateItems) calcCosts(window._estimateItems, parseFloat(document.getElementById('est-footage').value) || 0);
  });
});

/* ── review & save ──────────────────────────────────────────── */
function buildReview() {
  const t = window._estimateTotals || {};
  const v = id => App.escHtml(document.getElementById(id).value);
  document.getElementById('estimate-review').innerHTML = `
    <div class="card">
      <h4>Customer</h4>
      <p>${v('est-fname')} ${v('est-lname')}</p>
      <p>${v('est-phone')} | ${v('est-email')}</p>
      <p>${v('est-address')}, ${v('est-city')}, ${v('est-state')} ${v('est-zip')}</p>
    </div>
    <div class="card" style="margin-top:12px">
      <h4>Fence Specs</h4>
      <p>Type: ${v('est-fence-type')} | Height: ${v('est-height')}ft | Footage: ${v('est-footage')}ft</p>
      <p>Color: ${v('est-color')}</p>
    </div>
    <div class="card" style="margin-top:12px">
      <h4>Cost Summary</h4>
      <p>Materials: ${App.escHtml(App.fmtCurrency(t.subtotal))}</p>
      <p>Labor: ${App.escHtml(App.fmtCurrency(t.labor))}</p>
      <p>Markup: ${App.escHtml(App.fmtCurrency(t.markup))}</p>
      <p><strong>Grand Total: ${App.escHtml(App.fmtCurrency(t.grand))}</strong></p>
    </div>`;
}

async function saveEstimate() {
  const estimate = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    firstName: document.getElementById('est-fname').value.trim(),
    lastName:  document.getElementById('est-lname').value.trim(),
    phone:     document.getElementById('est-phone').value.trim(),
    email:     document.getElementById('est-email').value.trim(),
    address:   document.getElementById('est-address').value.trim(),
    city:      document.getElementById('est-city').value.trim(),
    state:     document.getElementById('est-state').value.trim(),
    zip:       document.getElementById('est-zip').value.trim(),
    fenceType: document.getElementById('est-fence-type').value,
    height:    document.getElementById('est-height').value,
    footage:   document.getElementById('est-footage').value,
    color:     document.getElementById('est-color').value.trim(),
    walkGates: document.getElementById('est-walk-gates').value,
    driveGates:document.getElementById('est-drive-gates').value,
    items:     window._estimateItems || [],
    ...window._estimateTotals
  };

  // Save locally
  const all = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
  all.push(estimate);
  localStorage.setItem('fd_estimates', JSON.stringify(all));

  // Try to sync with backend
  try { await App.Api.post('/estimates', estimate); } catch (_) {}

  App.toast(`Estimate saved – Total: ${App.fmtCurrency(estimate.grand)}`, 'success');
  goToStep(1);
}

document.getElementById('print-estimate-btn').addEventListener('click', () => window.print());
document.getElementById('email-estimate-btn').addEventListener('click', () => {
  App.toast('Email feature requires backend configuration', 'info');
});
