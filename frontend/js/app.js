(function bootstrapEstimator(global) {
  const FE = global.FenceEstimator;
  const { byId, toNumber, uid, today } = FE.utils;

  const CATALOG = [
    { sku: 'CL-001', name: 'Chain Link Fabric 6 ft', category: 'Chain Link', unitPrice: 24 },
    { sku: 'CL-002', name: 'Chain Link Line Post', category: 'Chain Link', unitPrice: 34 },
    { sku: 'WD-101', name: 'Pressure Treated Fence Board', category: 'Wood', unitPrice: 11 },
    { sku: 'WD-102', name: '4x4 Treated Post', category: 'Wood', unitPrice: 24 },
    { sku: 'VN-201', name: 'Vinyl Privacy Panel', category: 'Vinyl', unitPrice: 41 },
    { sku: 'OR-301', name: 'Ornamental Section', category: 'Ornamental', unitPrice: 52 },
    { sku: 'AL-401', name: 'Aluminum Panel', category: 'Aluminum', unitPrice: 44 },
    { sku: 'GT-500', name: 'Single Swing Gate Kit', category: 'Gate', unitPrice: 180 },
    { sku: 'GT-501', name: 'Double Drive Gate Kit', category: 'Gate', unitPrice: 425 },
    { sku: 'AC-900', name: 'Permit Package', category: 'Service', unitPrice: 195 },
  ];

  const defaultState = {
    currentTab: 'tab1-project',
    project: { customerName: '', customerEmail: '', customerPhone: '', projectDate: today(), address: '', city: '', province: '', postalCode: '', propertySize: '', status: 'draft', projectNotes: '' },
    specs: { fenceType: 'chain-link', height: 6, color: 'Galvanized', grade: 'Residential', linearFeet: 0, posts: 0, gates: 0, gateWidth: 4, terrain: 'Flat', installType: 'Residential' },
    layout: { drawingData: '', notes: '', frontageFeet: 0, rearFeet: 0, leftFeet: 0, rightFeet: 0 },
    installation: { crewSize: 3, laborRate: 65, equipmentRate: 175, startDate: '', durationDays: 1, soilConditions: 'Standard', notes: '' },
    drawings: { notes: '', files: [] },
    permits: { required: false, permitNumber: '', status: 'pending', fee: 0, notes: '' },
    utilities: { hydro: false, gas: false, water: false, sewer: false, locateRequested: false, notes: '' },
    estimate: { materials: 0, labor: 0, equipment: 0, permits: 0, extras: 0, subtotal: 0, tax: 0, total: 0, scopeSummary: [] },
    contract: { depositRate: 0.25, warranty: '1 year labor / manufacturer material warranty', paymentTerms: '25% deposit on approval. Balance due on completion.', priceLocked: false, customerAccepted: false },
    extras: [],
    crew: [],
    changeOrders: [],
    signoff: { completionDate: '', companyRep: '', inspectionPassed: false, customerWalkthrough: false, warrantyExplained: false, outstandingItems: '' },
    notes: [],
    mapping: { address: '', lat: '', lng: '', width: 0, depth: 0 },
    audit: { lastSavedAt: '' },
    catalogQuery: '',
  };

  FE.catalogFilter = function catalogFilter(query) {
    const needle = String(query || '').trim().toLowerCase();
    if (!needle) return CATALOG;
    return CATALOG.filter((item) => [item.sku, item.name, item.category].some((part) => part.toLowerCase().includes(needle)));
  };

  FE.state = FE.Storage.load(defaultState);

  FE.persist = function persist(message = 'Saved.') {
    FE.state.audit.lastSavedAt = new Date().toLocaleString();
    FE.Storage.save(FE.state);
    FE.state.estimate = FE.Calculations.calculateEstimate(FE.state);
    FE.UI.renderAll();
    FE.UI.message(message);
  };

  FE.removeItem = function removeItem(type, id) {
    const mapping = { extra: 'extras', crew: 'crew', change: 'changeOrders', note: 'notes' };
    if (type === 'drawing') FE.state.drawings.files = FE.state.drawings.files.filter((entry) => entry.id !== id);
    else FE.state[mapping[type]] = FE.state[mapping[type]].filter((entry) => entry.id !== id);
    FE.persist(`${type} removed`);
  };

  function fillField(id, value, property = 'value') {
    const element = byId(id);
    if (!element) return;
    if (property === 'checked') element.checked = Boolean(value);
    else element.value = value ?? '';
  }

  function syncFieldsFromState() {
    const { project, specs, layout, installation, drawings, permits, utilities, contract, signoff, mapping } = FE.state;
    fillField('customerName', project.customerName); fillField('customerEmail', project.customerEmail); fillField('customerPhone', project.customerPhone); fillField('projectDate', project.projectDate); fillField('customerAddress', project.address); fillField('customerCity', project.city); fillField('customerProvince', project.province); fillField('customerPostal', project.postalCode); fillField('propertySize', project.propertySize); fillField('projectStatus', project.status); fillField('projectNotes', project.projectNotes);
    fillField('fenceType', specs.fenceType); fillField('fenceHeight', specs.height); fillField('fenceColor', specs.color); fillField('materialGrade', specs.grade); fillField('linearFeet', specs.linearFeet); fillField('numberOfPosts', specs.posts); fillField('numberOfGates', specs.gates); fillField('gateWidth', specs.gateWidth); fillField('terrainType', specs.terrain); fillField('installType', specs.installType);
    fillField('layoutNotes', layout.notes); fillField('frontageFeet', layout.frontageFeet); fillField('rearFeet', layout.rearFeet); fillField('leftFeet', layout.leftFeet); fillField('rightFeet', layout.rightFeet);
    fillField('crewSize', installation.crewSize); fillField('laborRate', installation.laborRate); fillField('equipmentRate', installation.equipmentRate); fillField('startDate', installation.startDate); fillField('durationDays', installation.durationDays); fillField('soilConditions', installation.soilConditions); fillField('installationNotes', installation.notes);
    fillField('drawingNotes', drawings.notes); fillField('permitRequired', permits.required, 'checked'); fillField('permitNumber', permits.permitNumber); fillField('permitStatus', permits.status); fillField('permitFee', permits.fee); fillField('permitNotes', permits.notes);
    ['hydro', 'gas', 'water', 'sewer'].forEach((name) => document.querySelector(`input[name="utility"][value="${name}"]`).checked = Boolean(utilities[name]));
    fillField('locateRequested', utilities.locateRequested, 'checked'); fillField('utilityNotes', utilities.notes);
    fillField('depositRate', contract.depositRate); fillField('warrantyText', contract.warranty); fillField('paymentTerms', contract.paymentTerms); fillField('priceLocked', contract.priceLocked, 'checked'); fillField('customerAccepted', contract.customerAccepted, 'checked');
    fillField('completionDate', signoff.completionDate); fillField('companyRep', signoff.companyRep); fillField('inspectionPassed', signoff.inspectionPassed, 'checked'); fillField('customerWalkthrough', signoff.customerWalkthrough, 'checked'); fillField('warrantyExplained', signoff.warrantyExplained, 'checked'); fillField('outstandingItems', signoff.outstandingItems);
    fillField('mappingAddress', mapping.address || project.address); fillField('mappingLat', mapping.lat); fillField('mappingLng', mapping.lng); fillField('mappingWidth', mapping.width); fillField('mappingDepth', mapping.depth);
  }

  function bindGlobalEvents() {
    document.querySelectorAll('.tab-btn').forEach((button) => button.addEventListener('click', () => FE.UI.switchTab(button.dataset.tab)));
    byId('exportStateBtn').addEventListener('click', () => FE.Storage.exportState(FE.state));
    byId('importStateInput').addEventListener('change', async (event) => {
      const [file] = event.target.files || [];
      if (!file) return;
      FE.state = Object.assign({}, defaultState, await FE.Storage.importFile(file));
      syncFieldsFromState();
      FE.persist('Imported saved workspace');
      FE.modules.tools.drawing?.init();
    });
    byId('resetStateBtn').addEventListener('click', () => {
      FE.state = FE.Storage.reset(defaultState);
      syncFieldsFromState();
      FE.persist('Workspace reset');
      global.location.reload();
    });
    byId('refreshEstimateBtn').addEventListener('click', () => FE.persist('Estimate refreshed'));
    byId('recalculateBtn').addEventListener('click', () => FE.persist('Estimate recalculated'));
    byId('printEstimateBtn').addEventListener('click', () => FE.modules.tools.printing.printEstimate());
    byId('downloadContractBtn').addEventListener('click', () => FE.modules.tools.export.downloadContract());
    byId('productSearch').addEventListener('input', (event) => {
      FE.state.catalogQuery = event.target.value;
      FE.UI.renderCatalog(FE.catalogFilter(event.target.value));
    });
    document.body.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-id]');
      if (!button) return;
      FE.removeItem(button.dataset.removeType, button.dataset.removeId);
    });
  }

  function runModuleHooks(methodName) {
    Object.values(FE.modules.tabs).forEach((module) => typeof module[methodName] === 'function' && module[methodName]());
  }

  document.addEventListener('DOMContentLoaded', () => {
    FE.state.catalog = CATALOG;
    FE.state.estimate = FE.Calculations.calculateEstimate(FE.state);
    syncFieldsFromState();
    bindGlobalEvents();
    runModuleHooks('bind');
    Object.values(FE.modules.tools).forEach((tool) => typeof tool.init === 'function' && tool.init());
    FE.UI.renderAll();
    FE.UI.switchTab(FE.state.currentTab || 'tab1-project');
    FE.UI.message('Workspace ready.');
  });

  FE.helpers = { uid, toNumber };
})(window);
