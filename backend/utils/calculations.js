const FENCE_PROFILES = {
  'chain-link': { materialPerFoot: 28, labourHoursPer100: 14, concreteBagsPerPost: 2.5, postSpacing: 10, hardwarePerFoot: 4.75 },
  wood: { materialPerFoot: 36, labourHoursPer100: 18, concreteBagsPerPost: 2.75, postSpacing: 8, hardwarePerFoot: 6.25 },
  vinyl: { materialPerFoot: 48, labourHoursPer100: 16, concreteBagsPerPost: 3, postSpacing: 8, hardwarePerFoot: 5.5 },
  ornamental: { materialPerFoot: 54, labourHoursPer100: 15, concreteBagsPerPost: 2.5, postSpacing: 8, hardwarePerFoot: 6.75 },
  composite: { materialPerFoot: 62, labourHoursPer100: 20, concreteBagsPerPost: 3, postSpacing: 8, hardwarePerFoot: 7.5 }
};

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateEstimateBreakdown(input = {}) {
  const profile = FENCE_PROFILES[input.fenceType] || FENCE_PROFILES['chain-link'];
  const linearFeet = Number(input.linearFeet || 0);
  const gates = Number(input.gates || 0);
  const heightFeet = Number(input.heightFeet || 6);
  const tearOutFeet = Number(input.tearOutFeet || 0);
  const labourRate = Number(input.labourRate || 78);
  const overheadRate = Number(input.overheadRate ?? 0.12);
  const profitRate = Number(input.profitRate ?? 0.18);

  const posts = Math.max(2, Math.ceil(linearFeet / profile.postSpacing) + 1);
  const concreteBags = Math.ceil(posts * profile.concreteBagsPerPost);
  const materialCost = linearFeet * profile.materialPerFoot * (heightFeet / 6);
  const hardwareCost = linearFeet * profile.hardwarePerFoot + gates * 65;
  const concreteCost = concreteBags * 8.25;
  const tearOutCost = tearOutFeet * 7.5;
  const gateCost = gates * 345;
  const labourHours = (linearFeet / 100) * profile.labourHoursPer100 + gates * 1.5 + (tearOutFeet / 100) * 2;
  const labourCost = labourHours * labourRate;
  const subtotal = materialCost + hardwareCost + concreteCost + gateCost + labourCost + tearOutCost;
  const overhead = subtotal * overheadRate;
  const profit = (subtotal + overhead) * profitRate;
  const total = subtotal + overhead + profit;

  return {
    fenceType: input.fenceType || 'chain-link',
    linearFeet,
    heightFeet,
    gates,
    posts,
    concreteBags,
    labourHours: roundCurrency(labourHours),
    materialCost: roundCurrency(materialCost),
    hardwareCost: roundCurrency(hardwareCost),
    concreteCost: roundCurrency(concreteCost),
    gateCost: roundCurrency(gateCost),
    tearOutCost: roundCurrency(tearOutCost),
    labourCost: roundCurrency(labourCost),
    subtotal: roundCurrency(subtotal),
    overhead: roundCurrency(overhead),
    profit: roundCurrency(profit),
    total: roundCurrency(total)
  };
}

module.exports = { FENCE_PROFILES, calculateEstimateBreakdown, roundCurrency };
