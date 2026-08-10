function calculateMaterials({ linearFeet = 0, fenceHeight = 6, gateCount = 0 }) {
  const posts = Math.ceil(linearFeet / 10) + 1;
  const meshSqFt = linearFeet * fenceHeight;
  const rails = Math.ceil(linearFeet / 10) * 2;
  return { posts, meshSqFt, rails, gateKits: gateCount };
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
  const subtotal = labor.laborCost + equipment.totalEquipmentCost + concrete.concreteCost;
  const overhead = subtotal * 0.12;
  const margin = subtotal * 0.18;
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
