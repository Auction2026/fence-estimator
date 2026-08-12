const MATERIAL_COSTS = {
  'Chain Link': { base: 8, perFoot: 2, panelWidth: 8 },
  'Wood': { base: 15, perFoot: 3.5, panelWidth: 8 },
  'Vinyl': { base: 12, perFoot: 4, panelWidth: 8 },
  'Wrought Iron': { base: 20, perFoot: 5, panelWidth: 6 },
  'Composite': { base: 18, perFoot: 4.5, panelWidth: 8 },
  'Metal': { base: 14, perFoot: 3, panelWidth: 8 },
  'PVC': { base: 11, perFoot: 3.8, panelWidth: 8 },
  'Aluminum': { base: 13, perFoot: 3.2, panelWidth: 6 }
};

const GRADE_MULTIPLIERS = {
  standard: 1,
  premium: 1.15,
  commercial: 1.3
};

const LABOR_HOURS_PER_FOOT = {
  'Chain Link': 0.015,
  'Wood': 0.02,
  'Vinyl': 0.018,
  'Wrought Iron': 0.025,
  'Composite': 0.022,
  'Metal': 0.016,
  'PVC': 0.017,
  'Aluminum': 0.016
};

const INSTALLATION_MULTIPLIERS = {
  Residential: 1,
  Commercial: 1.2,
  Industrial: 1.5,
  Specialty: 1.8
};

const GATE_TYPE_MULTIPLIERS = {
  Swing: 1,
  'Double Swing': 1.75,
  Sliding: 2.2,
  Cantilever: 2.8,
  Barrier: 2.5,
  None: 0
};

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function normalizeFenceType(fenceType) {
  const normalized = String(fenceType || '').trim().toLowerCase();
  const aliasMap = {
    chainlink: 'Chain Link',
    'chain link': 'Chain Link',
    wood: 'Wood',
    vinyl: 'Vinyl',
    wroughtiron: 'Wrought Iron',
    'wrought iron': 'Wrought Iron',
    composite: 'Composite',
    metal: 'Metal',
    pvc: 'PVC',
    aluminum: 'Aluminum',
    aluminium: 'Aluminum'
  };
  return aliasMap[normalized] || 'Chain Link';
}

function getMaterialProfile(fenceType) {
  return MATERIAL_COSTS[normalizeFenceType(fenceType)] || MATERIAL_COSTS['Chain Link'];
}

function calculatePanelCount(linearFeet, panelWidth = 8) {
  const feet = Math.max(0, Number(linearFeet) || 0);
  const width = Math.max(1, Number(panelWidth) || 8);
  return Math.ceil(feet / width);
}

function calculatePostCount(linearFeet, spacing = 8) {
  const feet = Math.max(0, Number(linearFeet) || 0);
  const normalizedSpacing = Math.max(1, Number(spacing) || 8);
  if (feet === 0) return 0;
  return Math.ceil(feet / normalizedSpacing) + 1;
}

function calculateConcreteBags(numberPosts, bagsPerPost = 2) {
  const posts = Math.max(0, Number(numberPosts) || 0);
  const bags = Math.max(0, Number(bagsPerPost) || 0);
  return Math.ceil(posts * bags);
}

function calculateMaterialCost(optionsOrFenceType, linearFeet, heightInches = 48, barbedWire = false, materialGrade = 'standard') {
  const options = typeof optionsOrFenceType === 'object'
    ? optionsOrFenceType
    : { fenceType: optionsOrFenceType, linearFeet, heightInches, barbedWire, materialGrade };

  const profile = getMaterialProfile(options.fenceType);
  const feet = Math.max(0, Number(options.linearFeet) || 0);
  const inches = Math.max(1, Number(options.heightInches ?? options.height) || 48);
  const wire = Boolean(options.barbedWire ?? options.barchedWire);
  const wasteFactor = Math.max(0, Number(options.wasteFactor) || 0);
  const gradeMultiplier = GRADE_MULTIPLIERS[options.materialGrade || 'standard'] || 1;

  let cost = profile.base + (feet * profile.perFoot);
  cost *= inches / 48;
  cost *= gradeMultiplier;

  if (wire) {
    cost += feet * 0.5;
  }

  if (wasteFactor > 0) {
    cost *= 1 + wasteFactor;
  }

  return roundCurrency(cost);
}

function calculateLaborCost(linearFeet, fenceType, installationType = 'Residential', laborRate = 50) {
  const feet = Math.max(0, Number(linearFeet) || 0);
  const hoursPerFoot = LABOR_HOURS_PER_FOOT[normalizeFenceType(fenceType)] || 0.015;
  const multiplier = INSTALLATION_MULTIPLIERS[installationType] || 1;
  const rate = Math.max(0, Number(laborRate) || 0);
  const hours = feet * hoursPerFoot * multiplier;
  return {
    hours: roundCurrency(hours),
    cost: roundCurrency(hours * rate)
  };
}

function calculateEquipmentCost(linearFeet, numberPosts = 0) {
  const feet = Math.max(0, Number(linearFeet) || 0);
  const posts = Math.max(0, Number(numberPosts) || 0);
  if (feet === 0 && posts === 0) return 0;
  const dailyRate = feet > 500 ? 250 : 150;
  const estimatedDays = Math.max(1, Math.ceil(feet / 200));
  const augerCharge = posts > 80 ? 100 : 0;
  return roundCurrency((dailyRate * estimatedDays) + augerCharge);
}

function calculateGateCost(numberOfGates = 0, gateWidth = 4, gateType = 'Swing') {
  const count = Math.max(0, Number(numberOfGates) || 0);
  const width = Math.max(0, Number(gateWidth) || 0);
  const typeMultiplier = GATE_TYPE_MULTIPLIERS[gateType] ?? 1;
  if (count === 0 || typeMultiplier === 0) return 0;
  const basePerGate = 150;
  const widthPremium = Math.max(0, width - 4) * 35;
  return roundCurrency(count * (basePerGate + widthPremium) * typeMultiplier);
}

function calculatePermitCost(installationType = 'Residential', expedited = false, overrideCost = null) {
  if (overrideCost !== null && overrideCost !== undefined) {
    return roundCurrency(overrideCost);
  }
  const baseCosts = {
    Residential: 125,
    Commercial: 225,
    Industrial: 325,
    Specialty: 275
  };
  let permit = baseCosts[installationType] || baseCosts.Residential;
  if (expedited) permit += 75;
  return roundCurrency(permit);
}

function calculateExtrasTotal(extras = []) {
  return roundCurrency(extras.reduce((sum, item) => sum + (Number(item.cost) || 0), 0));
}

function calculateTax(subtotal, taxRate = 0.13) {
  return roundCurrency((Number(subtotal) || 0) * (Number(taxRate) || 0));
}

function calculateTotal(estimateData, taxRate = 0.13) {
  const subtotal = roundCurrency(
    (Number(estimateData.materialCost) || 0) +
    (Number(estimateData.laborCost) || 0) +
    (Number(estimateData.equipmentCost) || 0) +
    (Number(estimateData.permitCost) || 0) +
    (Number(estimateData.utilityCost) || 0) +
    (Number(estimateData.contingency) || 0) +
    (Number(estimateData.gateCost) || 0) +
    (Number(estimateData.extrasCost) || 0)
  );
  const tax = calculateTax(subtotal, taxRate);
  return {
    subtotal,
    tax,
    total: roundCurrency(subtotal + tax)
  };
}

function applyInventoryPricing(items = [], inventory = {}) {
  return items.map((item) => {
    const sku = item.sku || item.id;
    const inventoryRecord = inventory[sku] || {};
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice ?? inventoryRecord.unitPrice) || 0;
    return {
      ...item,
      sku,
      inStock: Number(inventoryRecord.stock ?? 0),
      unitPrice: roundCurrency(unitPrice),
      lineTotal: roundCurrency(quantity * unitPrice)
    };
  });
}

function calculateEstimate(options = {}) {
  const materialCost = calculateMaterialCost(options);
  const labor = calculateLaborCost(
    options.linearFeet,
    options.fenceType,
    options.installationType || 'Residential',
    options.laborRate || 50
  );
  const postCount = options.numberPosts || calculatePostCount(options.linearFeet, options.postSpacing || 8);
  const gateCost = calculateGateCost(options.numberOfGates, options.gateWidth, options.gateType || 'Swing');
  const equipmentCost = calculateEquipmentCost(options.linearFeet, postCount);
  const permitCost = options.permitCost ?? calculatePermitCost(options.installationType || 'Residential', options.expeditedPermit);
  const totals = calculateTotal({
    materialCost,
    laborCost: labor.cost,
    equipmentCost,
    permitCost,
    utilityCost: options.utilityCost || 0,
    contingency: options.contingency || 0,
    gateCost,
    extrasCost: options.extrasCost || 0
  }, options.taxRate || 0.13);

  return {
    materialCost,
    laborHours: labor.hours,
    laborCost: labor.cost,
    equipmentCost,
    permitCost,
    gateCost,
    concreteBags: calculateConcreteBags(postCount, options.bagsPerPost || 2),
    panelCount: calculatePanelCount(options.linearFeet, getMaterialProfile(options.fenceType).panelWidth),
    postCount,
    ...totals
  };
}

module.exports = {
  MATERIAL_COSTS,
  GRADE_MULTIPLIERS,
  LABOR_HOURS_PER_FOOT,
  INSTALLATION_MULTIPLIERS,
  GATE_TYPE_MULTIPLIERS,
  roundCurrency,
  normalizeFenceType,
  getMaterialProfile,
  calculatePanelCount,
  calculatePostCount,
  calculateConcreteBags,
  calculateMaterialCost,
  calculateLaborCost,
  calculateEquipmentCost,
  calculateGateCost,
  calculatePermitCost,
  calculateExtrasTotal,
  calculateTax,
  calculateTotal,
  applyInventoryPricing,
  calculateEstimate
};
