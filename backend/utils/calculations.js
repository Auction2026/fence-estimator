const OVERHEAD_RATE = 0.12;
const MARGIN_RATE = 0.18;

function calculateMaterials({
  linearFeet = 0,
  fenceHeight = 6,
  gateCount = 0,
  postUnitCost = 34,
  meshUnitCostPerSqFt = 2.2,
  railUnitCost = 18,
  gateKitUnitCost = 210
}) {
  const posts = Math.ceil(linearFeet / 10) + 1;
  const meshSqFt = linearFeet * fenceHeight;
  const rails = Math.ceil(linearFeet / 10) * 2;
  const materialsCost = (
    (posts * postUnitCost) +
    (meshSqFt * meshUnitCostPerSqFt) +
    (rails * railUnitCost) +
    (gateCount * gateKitUnitCost)
  );
  return { posts, meshSqFt, rails, gateKits: gateCount, materialsCost };
}

function calculateLabor({ linearFeet = 0, laborRatePerFoot = 12 }) {
  return { laborHours: Math.ceil(linearFeet / 12), laborCost: linearFeet * laborRatePerFoot };
}

function calculateEquipment({ augerHours = 0, truckHours = 0 }) {
  const auger = augerHours * 65;
  const truck = truckHours * 45;
  return { auger, truck, totalEquipmentCost: auger + truck };
}

function calculateConcrete({ postCount = 0, bagsPerPost = 2, bagCost = 6.5 }) {
  const bags = postCount * bagsPerPost;
  return { bags, concreteCost: bags * bagCost };
}

function calculateEstimate(input) {
  const materials = calculateMaterials(input);
  const labor = calculateLabor(input);
  const equipment = calculateEquipment(input);
  const concrete = calculateConcrete({ postCount: materials.posts });
  const subtotal = materials.materialsCost + labor.laborCost + equipment.totalEquipmentCost + concrete.concreteCost;
  const overhead = subtotal * OVERHEAD_RATE;
  const margin = subtotal * MARGIN_RATE;
  return {
    materials,
    labor,
    equipment,
    concrete,
    subtotal,
    overhead,
    margin,
    total: subtotal + overhead + margin
  };
}

module.exports = {
  calculateMaterials,
  calculateLabor,
  calculateEquipment,
  calculateConcrete,
  calculateEstimate
};
