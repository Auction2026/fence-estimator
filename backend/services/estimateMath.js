function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function calculateMaterialCost(fenceType, linearFeet, height, barbedWire) {
  const baseCosts = {
    'Chain Link': { base: 8, perFoot: 2 },
    Wood: { base: 15, perFoot: 3.5 },
    Vinyl: { base: 12, perFoot: 4 },
    'Wrought Iron': { base: 20, perFoot: 5 },
    Composite: { base: 18, perFoot: 4.5 },
    Metal: { base: 14, perFoot: 3 },
    PVC: { base: 11, perFoot: 3.8 },
    Aluminum: { base: 13, perFoot: 3.2 },
  };
  const fence = baseCosts[fenceType] || baseCosts['Chain Link'];
  let cost = fence.base + (Number(linearFeet || 0) * fence.perFoot);
  cost *= Math.max(1, Number(height || 48) / 48);
  if (barbedWire) cost += Number(linearFeet || 0) * 0.5;
  return round(cost);
}

function calculateLaborCost(linearFeet, fenceType, installationType, laborRate = 50) {
  const baseHoursPerFoot = {
    'Chain Link': 0.015,
    Wood: 0.02,
    Vinyl: 0.018,
    'Wrought Iron': 0.025,
    Composite: 0.022,
    Metal: 0.016,
    PVC: 0.017,
    Aluminum: 0.016,
  };
  const multipliers = { Residential: 1, Commercial: 1.2, Industrial: 1.5, Specialty: 1.8 };
  const hours = Number(linearFeet || 0) * (baseHoursPerFoot[fenceType] || 0.015) * (multipliers[installationType] || 1);
  return { hours: round(hours), cost: round(hours * Number(laborRate || 50)) };
}

function calculateEquipmentCost(linearFeet) {
  const lf = Number(linearFeet || 0);
  const equipmentDailyRate = lf > 500 ? 250 : 150;
  const estimatedDays = Math.max(1, Math.ceil(lf / 200));
  return round(equipmentDailyRate * estimatedDays);
}

function calculateTotal(estimateData) {
  const subtotal = Number(estimateData.materialCost || 0) + Number(estimateData.laborCost || 0) + Number(estimateData.equipmentCost || 0) + Number(estimateData.permitCost || 0) + Number(estimateData.utilityCost || 0) + Number(estimateData.contingency || 0);
  const tax = subtotal * 0.13;
  return { subtotal: round(subtotal), tax: round(tax), total: round(subtotal + tax) };
}

module.exports = { calculateMaterialCost, calculateLaborCost, calculateEquipmentCost, calculateTotal };
