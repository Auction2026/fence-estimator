export function calculateMaterialEstimate({ linearFeet = 0, gateCount = 0, wastePercent = 8 }) {
  const feet = Number(linearFeet) || 0;
  const gates = Number(gateCount) || 0;
  const waste = 1 + (Number(wastePercent) || 0) / 100;
  const posts = Math.ceil(feet / 8) + 1 + gates * 2;
  const meshRolls = Math.ceil((feet * waste) / 50);
  const concreteBags = Math.ceil(posts * 2.5);

  return {
    posts,
    meshRolls,
    concreteBags,
    tensionBands: posts * 3,
    topRailFeet: Math.ceil(feet * waste)
  };
}
