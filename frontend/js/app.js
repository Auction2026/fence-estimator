const appState = {
  currentTab: 'tab1',
  projectData: {},
  specsData: {},
  estimate: { materials: 0, labor: 0, equipment: 0, permits: 0, extras: 0, subtotal: 0, tax: 0, total: 0 },
  isPriceLocked: false,
  extras: [],
  crew: [],
  notes: [],
  changeOrders: [],
  permits: {},
  utilities: [],
};

let drawingSession = null;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadSavedData();
  setupEventListeners();
  initTabModules();
  switchTab('tab1');
});

function initializeApp() {
  if (window.fenceUI) window.fenceUI.showMessage('Application startup');
}

function setupEventListeners() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('change', calculateEstimate);
  });
}

function initTabModules() {
  for (let i = 1; i <= 17; i += 1) {
    const mod = window[`tab${i}Module`];
    if (mod && typeof mod.init === 'function') mod.init();
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);

  if (selectedTab) selectedTab.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');

  appState.currentTab = tabName;
  saveAppState();
}

function saveProject(event) {
  event.preventDefault();
  const data = {
    name: document.getElementById('customerName').value,
    email: document.getElementById('customerEmail').value,
    phone: document.getElementById('customerPhone').value,
    address: document.getElementById('customerAddress').value,
    city: document.getElementById('customerCity').value,
    province: document.getElementById('customerProvince').value,
    postal: document.getElementById('customerPostal').value,
    propertySize: document.getElementById('propertySize').value,
  };

  const result = window.fenceValidation?.validateProjectData ? window.fenceValidation.validateProjectData(data) : { valid: true, errors: {} };
  if (!result.valid) {
    alert(`Project form errors: ${Object.values(result.errors).join(', ')}`);
    return;
  }

  appState.projectData = data;
  saveAppState();
  alert('Project information saved successfully.');
}

function saveSpecs(event) {
  event.preventDefault();
  const data = {
    fenceType: document.getElementById('fenceType').value,
    height: Number(document.getElementById('fenceHeight').value || 0),
    color: document.getElementById('fenceColor').value,
    materialGrade: document.getElementById('materialGrade').value,
    linearFeet: Number(document.getElementById('linearFeet').value || 0),
    numberOfPosts: Number(document.getElementById('numberOfPosts').value || 0),
    numberOfGates: Number(document.getElementById('numberOfGates').value || 0),
    gateWidth: Number(document.getElementById('gateWidth').value || 0),
  };

  const result = window.fenceValidation?.validateSpecsData ? window.fenceValidation.validateSpecsData(data) : { valid: true, errors: {} };
  if (!result.valid) {
    alert(`Specs form errors: ${Object.values(result.errors).join(', ')}`);
    return;
  }

  appState.specsData = data;
  saveAppState();
  calculateEstimate();
  alert('Specifications saved successfully.');
}

function calculateEstimate() {
  const specs = appState.specsData;
  if (!window.calcEngine) return;
  if (!specs || !specs.linearFeet) {
    appState.estimate.materials = 0;
    appState.estimate.labor = 0;
    appState.estimate.equipment = 0;
    updateEstimateDisplay();
    return;
  }

  appState.estimate.materials = window.calcEngine.calculateMaterials(specs);
  appState.estimate.labor = window.calcEngine.calculateLabor(specs);
  appState.estimate.equipment = window.calcEngine.calculateEquipment(specs);

  const totals = window.calcEngine.calculateTotals(appState.estimate);
  appState.estimate.subtotal = totals.subtotal;
  appState.estimate.tax = totals.tax;
  appState.estimate.total = totals.total;

  updateEstimateDisplay();
}

function updateEstimateDisplay() {
  if (window.fenceUI?.updateEstimateUI) {
    window.fenceUI.updateEstimateUI(appState.estimate);
    return;
  }
  const fallback = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = `$${Number(value || 0).toFixed(2)}`;
  };
  fallback('estimateMaterials', appState.estimate.materials);
  fallback('estimateLabor', appState.estimate.labor);
  fallback('estimateEquipment', appState.estimate.equipment);
  fallback('estimatePermits', appState.estimate.permits);
  fallback('estimateExtras', appState.estimate.extras);
  fallback('estimateSubtotal', appState.estimate.subtotal);
  fallback('estimateTax', appState.estimate.tax);
  fallback('estimateTotal', appState.estimate.total);
}

function saveAppState() {
  if (window.fenceStorage?.saveState) {
    window.fenceStorage.saveState(appState);
  } else {
    localStorage.setItem('fenceEstimatorState', JSON.stringify(appState));
  }
}

function loadSavedData() {
  let saved = null;
  if (window.fenceStorage?.loadState) {
    saved = window.fenceStorage.loadState();
  } else {
    try {
      saved = JSON.parse(localStorage.getItem('fenceEstimatorState') || 'null');
    } catch {
      saved = null;
    }
  }
  if (!saved) {
    updateEstimateDisplay();
    return;
  }

  Object.assign(appState, saved);

  if (appState.projectData?.name) document.getElementById('customerName').value = appState.projectData.name;
  if (appState.projectData?.email) document.getElementById('customerEmail').value = appState.projectData.email;
  if (appState.projectData?.phone) document.getElementById('customerPhone').value = appState.projectData.phone;

  updateEstimateDisplay();
  renderExtras();
  renderCrew();
  renderChanges();
  renderNotes();
}

function startDrawing() {
  drawingSession = window.drawingTool?.startDrawingTool?.('layoutCanvas') || null;
}

function clearCanvas() {
  if (drawingSession?.clear) drawingSession.clear();
}

function saveDrawing() {
  saveAppState();
  alert('Drawing session saved.');
}

function uploadDrawing(event) {
  event.preventDefault();
  alert('Drawing upload recorded.');
}

function savePermits(event) {
  event.preventDefault();
  const permitCostField = document.getElementById('permitCost');
  appState.estimate.permits = permitCostField ? Number(permitCostField.value || 0) : 75;
  appState.permits = {
    number: document.getElementById('permitNumber').value,
    status: document.getElementById('permitStatus').value,
  };
  calculateEstimate();
  saveAppState();
}

function saveUtilities(event) {
  event.preventDefault();
  appState.utilities = Array.from(document.querySelectorAll('#utilitiesForm input[name="utility"]:checked')).map((input) => input.value);
  saveAppState();
}

function generatePDF() {
  const payload = { project: appState.projectData, estimate: appState.estimate };
  window.printingTool?.exportEstimateJson(payload, `estimate-${Date.now()}.json`);
}

function lockPrice() {
  appState.isPriceLocked = true;
  saveAppState();
  alert('Price locked for this estimate.');
}

function signContract() {
  const contractCustomer = document.getElementById('contractCustomer');
  const contractPrice = document.getElementById('contractPrice');
  if (contractCustomer) contractCustomer.textContent = appState.projectData.name || '---';
  if (contractPrice) contractPrice.textContent = `$${Number(appState.estimate.total || 0).toFixed(2)}`;
  alert('Contract signature recorded.');
}

function addExtra(event) {
  event.preventDefault();
  const item = document.getElementById('extraItem').value.trim();
  const cost = Number(document.getElementById('extraCost').value || 0);
  if (!item) return;
  appState.extras.push({ item, cost });
  appState.estimate.extras = appState.extras.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  calculateEstimate();
  renderExtras();
  saveAppState();
  event.target.reset();
}

function renderExtras() {
  const tbody = document.getElementById('extrasTableBody');
  if (!tbody) return;
  tbody.innerHTML = appState.extras
    .map((row, idx) => `<tr><td>${escapeHtml(row.item)}</td><td>$${Number(row.cost).toFixed(2)}</td><td><button type="button" onclick="removeExtra(${idx})">Remove</button></td></tr>`)
    .join('');
}

function removeExtra(index) {
  appState.extras.splice(index, 1);
  appState.estimate.extras = appState.extras.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  calculateEstimate();
  renderExtras();
  saveAppState();
}

function addCrewMember(event) {
  event.preventDefault();
  const name = document.getElementById('crewName').value.trim();
  const role = document.getElementById('crewRole').value;
  if (!name) return;
  appState.crew.push({ name, role });
  renderCrew();
  saveAppState();
  event.target.reset();
}

function renderCrew() {
  const tbody = document.getElementById('crewTableBody');
  if (!tbody) return;
  tbody.innerHTML = appState.crew.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.role)}</td><td>-</td></tr>`).join('');
}

function addChangeOrder(event) {
  event.preventDefault();
  const description = document.getElementById('changeDescription').value.trim();
  const cost = Number(document.getElementById('changeCost').value || 0);
  if (!description) return;
  appState.changeOrders.push({ description, cost, createdAt: new Date().toISOString() });
  renderChanges();
  saveAppState();
  event.target.reset();
}

function renderChanges() {
  const host = document.getElementById('changeOrdersList');
  if (!host) return;
  host.innerHTML = appState.changeOrders
    .map((c) => `<div><strong>${escapeHtml(c.description)}</strong> — $${Number(c.cost).toFixed(2)}</div>`)
    .join('');
}

function signOffProject(event) {
  event.preventDefault();
  alert('Project sign-off recorded.');
}

function addNote(event) {
  event.preventDefault();
  const note = document.getElementById('noteContent').value.trim();
  if (!note) return;
  appState.notes.push({ note, at: new Date().toISOString() });
  renderNotes();
  saveAppState();
  event.target.reset();
}

function renderNotes() {
  const host = document.getElementById('notesList');
  if (!host) return;
  host.innerHTML = appState.notes.map((n) => `<div>${escapeHtml(n.note)}</div>`).join('');
}

function showHome() {
  switchTab('tab1');
}

function logout() {
  if (confirm('Logout?')) {
    window.fenceStorage?.clearState?.();
    localStorage.removeItem('fenceEstimatorState');
    window.location.reload();
  }
}
