
function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateEstimate(fenceSpecs, materials = {}, labor = {}) {
  const normalizedSpecs = normalizeFenceSpecs(fenceSpecs);
  const materialCost = calculateMaterialCost(normalizedSpecs, materials);
  const laborCost = calculateLaborCost(normalizedSpecs, labor);
  const equipmentCost = calculateEquipmentCost(normalizedSpecs);
  const permitCost = toNumber(materials.permitAllowance, 150);
  const utilityCost = toNumber(materials.utilityAllowance, 100);
  const subtotal = roundCurrency(materialCost + laborCost + equipmentCost + permitCost + utilityCost);
  const taxRate = toNumber(materials.taxRate, 13) / 100;
  const contingencyRate = toNumber(materials.contingencyRate, 10) / 100;
  const tax = roundCurrency(subtotal * taxRate);
  const contingency = roundCurrency(subtotal * contingencyRate);
  const total = roundCurrency(subtotal + tax + contingency);

  return {
    materialCost,
    laborCost,
    equipmentCost,
    permitCost,
    utilityCost,
    subtotal,
    tax,
    contingency,
    total,
    breakdown: {
      materials: materialCost,
      labor: laborCost,
      equipment: equipmentCost,
      permits: permitCost,
      utilities: utilityCost
    }
  };
}

function normalizeFenceSpecs(fenceSpecs = {}) {
  const linearFeet = Math.max(1, toNumber(fenceSpecs.linearFeet, 1));
  const height = Math.max(3, toNumber(fenceSpecs.height, 6));
  const numberOfGates = Math.max(0, toNumber(fenceSpecs.numberOfGates, 0));
  const spacing = Math.max(6, toNumber(fenceSpecs.postSpacing, 8));
  const numberOfPosts = Math.max(2, toNumber(fenceSpecs.numberOfPosts, Math.ceil(linearFeet / spacing) + 1));
  return {
    ...fenceSpecs,
    linearFeet,
    height,
    numberOfPosts,
    numberOfGates,
    fenceType: fenceSpecs.fenceType || 'chain-link',
    markupPercent: toNumber(fenceSpecs.markupPercent, 35),
    cornerPosts: Math.max(0, toNumber(fenceSpecs.cornerPosts, 4)),
    endPosts: Math.max(0, toNumber(fenceSpecs.endPosts, 2)),
    linePosts: Math.max(0, toNumber(fenceSpecs.linePosts, Math.max(0, numberOfPosts - 6)))
  };
}

function getFenceRate(fenceType) {
  const table = {
    'chain-link': { fabric: 0.85, hardware: 2.0, post: 45, gate: 250, laborFactor: 0.5, equipment: 3.0 },
    ornamental: { fabric: 4.25, hardware: 2.85, post: 78, gate: 650, laborFactor: 0.7, equipment: 4.5 },
    vinyl: { fabric: 5.4, hardware: 1.75, post: 62, gate: 575, laborFactor: 0.8, equipment: 3.5 },
    wood: { fabric: 4.1, hardware: 1.2, post: 38, gate: 420, laborFactor: 0.9, equipment: 3.25 },
    privacy: { fabric: 6.15, hardware: 2.4, post: 68, gate: 695, laborFactor: 1.0, equipment: 3.8 }
  };
  return table[fenceType] || table['chain-link'];
}

function calculateMaterialCost(fenceSpecs, materials = {}) {
  const rates = getFenceRate(fenceSpecs.fenceType);
  let cost = 0;

  const linearFeet = fenceSpecs.linearFeet;
  const height = fenceSpecs.height;
  const fabricUnitRate = toNumber(materials.fabricRate, rates.fabric);
  const chainLinkCost = linearFeet * height * fabricUnitRate;
  cost += chainLinkCost;

  const postCount = fenceSpecs.numberOfPosts;
  const postCost = postCount * toNumber(materials.postRate, rates.post);
  cost += postCost;

  const gateCount = fenceSpecs.numberOfGates || 0;
  const gateCost = gateCount * toNumber(materials.gateRate, rates.gate);
  cost += gateCost;

  const hardwareCost = linearFeet * toNumber(materials.hardwareRate, rates.hardware);
  cost += hardwareCost;

  const concreteBags = Math.max(4, Math.ceil(postCount * 1.5));
  const concreteRate = toNumber(materials.concreteRate, 7.5);
  cost += concreteBags * concreteRate;

  const marginMultiplier = 1 + (toNumber(fenceSpecs.markupPercent, 35) / 100);
  return roundCurrency(cost * marginMultiplier);
}

function calculateLaborCost(fenceSpecs, labor = {}) {
  const rates = getFenceRate(fenceSpecs.fenceType);
  const linearFeet = fenceSpecs.linearFeet;
  const terrainMultiplier = labor.terrain === 'difficult' ? 1.25 : labor.terrain === 'moderate' ? 1.1 : 1;
  const gateHours = Math.max(0, toNumber(fenceSpecs.numberOfGates, 0)) * toNumber(labor.gateHours, 1.5);
  const baseHours = (linearFeet / 10) * toNumber(labor.installHoursPerTenFeet, rates.laborFactor);
  const laborHours = (baseHours + gateHours) * terrainMultiplier;
  const laborRate = toNumber(labor.rate, 50);
  return roundCurrency(laborHours * laborRate);
}

function calculateEquipmentCost(fenceSpecs) {
  const rates = getFenceRate(fenceSpecs.fenceType);
  const linearFeet = fenceSpecs.linearFeet;
  const gateAllowance = toNumber(fenceSpecs.numberOfGates, 0) * 40;
  return roundCurrency((linearFeet * rates.equipment) + gateAllowance);
}

function applyChangeOrder(originalEstimate, changeOrder) {
  const updatedTotal = roundCurrency(toNumber(originalEstimate.total) + toNumber(changeOrder.costChange));
  return {
    ...originalEstimate,
    originalTotal: toNumber(originalEstimate.total),
    costChange: toNumber(changeOrder.costChange),
    reason: changeOrder.reason,
    scopeChange: changeOrder.scopeChange || '',
    total: updatedTotal
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(toNumber(value));
}

function toBreakdownRows(estimate) {
  return [
    { category: 'Materials', amount: formatCurrency(estimate.materialCost), notes: 'Fence fabric, posts, gates, hardware, concrete' },
    { category: 'Labour', amount: formatCurrency(estimate.laborCost), notes: 'Crew installation labour and terrain factor' },
    { category: 'Equipment', amount: formatCurrency(estimate.equipmentCost), notes: 'Auger, mixer, transport, and jobsite tools' },
    { category: 'Permits', amount: formatCurrency(estimate.permitCost), notes: 'Municipal permit allowance' },
    { category: 'Utilities', amount: formatCurrency(estimate.utilityCost), notes: 'Locate and utility coordination allowance' },
    { category: 'Subtotal', amount: formatCurrency(estimate.subtotal), notes: 'Before tax and contingency' },
    { category: 'Tax', amount: formatCurrency(estimate.tax), notes: 'HST or configured tax rate' },
    { category: 'Contingency', amount: formatCurrency(estimate.contingency), notes: 'Allowance for field variance' },
    { category: 'Total', amount: formatCurrency(estimate.total), notes: 'Customer-facing estimate total' }
  ];
}

window.FenceCalculations = {
  calculateEstimate,
  calculateMaterialCost,
  calculateLaborCost,
  calculateEquipmentCost,
  applyChangeOrder,
  formatCurrency,
  normalizeFenceSpecs,
  toBreakdownRows
};
window.calculateEstimate = calculateEstimate;
