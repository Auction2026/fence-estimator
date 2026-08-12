const materialRates = {
  chainlink: 15,
  wood: 25,
  vinyl: 35,
  wroughtiron: 50,
  aluminum: 30,
};
const TAX_RATE = 0.13;

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function calculateMaterials(specs) {
  const footage = safeNumber(specs.linearFeet);
  const rate = materialRates[String(specs.fenceType || '').toLowerCase()] || 20;
  return Math.round(footage * rate * 100) / 100;
}

function calculateLabor(specs) {
  const footage = safeNumber(specs.linearFeet);
  const laborRate = 50;
  const hoursPerFoot = 0.5;
  return Math.round(footage * hoursPerFoot * laborRate * 100) / 100;
}

function calculateEquipment(specs) {
  const footage = safeNumber(specs.linearFeet);
  const gates = safeNumber(specs.numberOfGates);
  return Math.round((footage * 5 + gates * 150) * 100) / 100;
}

function calculateTotals(estimate) {
  const subtotal = safeNumber(estimate.materials) + safeNumber(estimate.labor) + safeNumber(estimate.equipment) + safeNumber(estimate.permits) + safeNumber(estimate.extras);
  const tax = subtotal * TAX_RATE;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100,
  };
}

window.calcEngine = { calculateMaterials, calculateLabor, calculateEquipment, calculateTotals };
