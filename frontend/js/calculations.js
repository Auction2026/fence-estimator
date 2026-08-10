const profiles = {
  'chain-link': { materialPerFoot: 28, labourHoursPer100: 14, concreteBagsPerPost: 2.5, postSpacing: 10, hardwarePerFoot: 4.75 },
  wood: { materialPerFoot: 36, labourHoursPer100: 18, concreteBagsPerPost: 2.75, postSpacing: 8, hardwarePerFoot: 6.25 },
  vinyl: { materialPerFoot: 48, labourHoursPer100: 16, concreteBagsPerPost: 3, postSpacing: 8, hardwarePerFoot: 5.5 },
  ornamental: { materialPerFoot: 54, labourHoursPer100: 15, concreteBagsPerPost: 2.5, postSpacing: 8, hardwarePerFoot: 6.75 },
  composite: { materialPerFoot: 62, labourHoursPer100: 20, concreteBagsPerPost: 3, postSpacing: 8, hardwarePerFoot: 7.5 }
};

const round = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

export function calculateEstimate(payload = {}) {
  const profile = profiles[payload.fenceType] || profiles['chain-link'];
  const linearFeet = Number(payload.linearFeet || 0);
  const gates = Number(payload.gates || 0);
  const heightFeet = Number(payload.heightFeet || 6);
  const tearOutFeet = Number(payload.tearOutFeet || 0);
  const labourRate = Number(payload.labourRate || 78);
  const overheadRate = Number(payload.overheadRate ?? 0.12);
  const profitRate = Number(payload.profitRate ?? 0.18);
  const posts = Math.max(2, Math.ceil(linearFeet / profile.postSpacing) + 1);
  const concreteBags = Math.ceil(posts * profile.concreteBagsPerPost);
  const materialCost = linearFeet * profile.materialPerFoot * (heightFeet / 6);
  const hardwareCost = linearFeet * profile.hardwarePerFoot + gates * 65;
  const concreteCost = concreteBags * 8.25;
  const tearOutCost = tearOutFeet * 7.5;
  const gateCost = gates * 345;
  const labourHours = (linearFeet / 100) * profile.labourHoursPer100 + gates * 1.5 + (tearOutFeet / 100) * 2;
  const labourCost = labourHours * labourRate;
  const subtotal = materialCost + hardwareCost + concreteCost + gateCost + tearOutCost + labourCost;
  const overhead = subtotal * overheadRate;
  const profit = (subtotal + overhead) * profitRate;
  return {
    posts,
    concreteBags,
    labourHours: round(labourHours),
    materialCost: round(materialCost),
    hardwareCost: round(hardwareCost),
    concreteCost: round(concreteCost),
    gateCost: round(gateCost),
    tearOutCost: round(tearOutCost),
    labourCost: round(labourCost),
    subtotal: round(subtotal),
    overhead: round(overhead),
    profit: round(profit),
    total: round(subtotal + overhead + profit)
  };
}
