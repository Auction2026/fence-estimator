const {
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
} = require('../frontend/js/calculations');

describe('calculations.js constants', () => {
  test('exports baseline pricing tables used by the estimator', () => {
    expect(MATERIAL_COSTS['Chain Link']).toEqual(expect.objectContaining({ base: 8, perFoot: 2 }));
    expect(GRADE_MULTIPLIERS.premium).toBeGreaterThan(GRADE_MULTIPLIERS.standard);
    expect(LABOR_HOURS_PER_FOOT.Wood).toBeGreaterThan(LABOR_HOURS_PER_FOOT['Chain Link']);
    expect(INSTALLATION_MULTIPLIERS.Industrial).toBeGreaterThan(INSTALLATION_MULTIPLIERS.Residential);
    expect(GATE_TYPE_MULTIPLIERS.Cantilever).toBeGreaterThan(GATE_TYPE_MULTIPLIERS.Swing);
  });
});

describe('normalizeFenceType', () => {
  test.each([
    ['chainlink', 'Chain Link'],
    ['Chain Link', 'Chain Link'],
    ['wroughtiron', 'Wrought Iron'],
    ['Aluminium', 'Aluminum'],
    ['unknown-type', 'Chain Link'],
    [undefined, 'Chain Link']
  ])('normalizes %p to %p', (input, expected) => {
    expect(normalizeFenceType(input)).toBe(expected);
  });

  test('getMaterialProfile falls back to chain link profile', () => {
    expect(getMaterialProfile('mystery')).toEqual(MATERIAL_COSTS['Chain Link']);
  });
});

describe('rounding helpers', () => {
  test('roundCurrency keeps 2 decimal places', () => {
    expect(roundCurrency(12.3456)).toBe(12.35);
    expect(roundCurrency(12.344)).toBe(12.34);
  });

  test('roundCurrency safely handles nullish inputs', () => {
    expect(roundCurrency(undefined)).toBe(0);
    expect(roundCurrency(null)).toBe(0);
  });
});

describe('quantity helpers', () => {
  test.each([
    [0, 8, 0],
    [1, 8, 1],
    [16, 8, 2],
    [17, 8, 3],
    [20, 6, 4]
  ])('calculatePanelCount(%p, %p) => %p', (feet, width, expected) => {
    expect(calculatePanelCount(feet, width)).toBe(expected);
  });

  test.each([
    [0, 8, 0],
    [8, 8, 2],
    [16, 8, 3],
    [100, 10, 11]
  ])('calculatePostCount(%p, %p) => %p', (feet, spacing, expected) => {
    expect(calculatePostCount(feet, spacing)).toBe(expected);
  });

  test('calculateConcreteBags rounds up partial bags', () => {
    expect(calculateConcreteBags(10, 2)).toBe(20);
    expect(calculateConcreteBags(3, 1.5)).toBe(5);
  });
});

describe('material cost calculations', () => {
  test('matches backend formula for a standard chain link estimate', () => {
    expect(calculateMaterialCost('Chain Link', 100, 48, false, 'standard')).toBe(208);
  });

  test('applies height multiplier', () => {
    const baseHeight = calculateMaterialCost('Wood', 120, 48, false, 'standard');
    const taller = calculateMaterialCost('Wood', 120, 72, false, 'standard');
    expect(taller).toBeGreaterThan(baseHeight);
    expect(taller).toBe(652.5);
  });

  test('adds barbed wire surcharge using legacy property name', () => {
    const withoutWire = calculateMaterialCost({ fenceType: 'Chain Link', linearFeet: 250, heightInches: 48, barchedWire: false });
    const withWire = calculateMaterialCost({ fenceType: 'Chain Link', linearFeet: 250, heightInches: 48, barchedWire: true });
    expect(withWire - withoutWire).toBe(125);
  });

  test('applies material grade multiplier and waste factor', () => {
    const standard = calculateMaterialCost({ fenceType: 'Vinyl', linearFeet: 100, heightInches: 48, materialGrade: 'standard' });
    const premiumWaste = calculateMaterialCost({ fenceType: 'Vinyl', linearFeet: 100, heightInches: 48, materialGrade: 'premium', wasteFactor: 0.1 });
    expect(premiumWaste).toBeGreaterThan(standard);
    expect(premiumWaste).toBe(521.18);
  });

  test('clamps negative footage to zero', () => {
    expect(calculateMaterialCost({ fenceType: 'Wood', linearFeet: -10, heightInches: 48 })).toBe(15);
  });

  test.each([
    ['Chain Link', 200, 48, 0.1, 448.8],
    ['Composite', 90, 60, 0, 528.75],
    ['Aluminum', 180, 48, 0, 589],
    ['Wrought Iron', 75, 48, 0, 395]
  ])('calculates material cost for %s fence', (type, feet, inches, wasteFactor, expected) => {
    expect(calculateMaterialCost({ fenceType: type, linearFeet: feet, heightInches: inches, wasteFactor })).toBe(expected);
  });
});

describe('labor cost calculations', () => {
  test('returns both hours and cost', () => {
    expect(calculateLaborCost(100, 'Chain Link', 'Residential', 50)).toEqual({ hours: 1.5, cost: 75 });
  });

  test('applies installation multipliers', () => {
    const residential = calculateLaborCost(200, 'Wood', 'Residential', 55);
    const industrial = calculateLaborCost(200, 'Wood', 'Industrial', 55);
    expect(industrial.hours).toBeGreaterThan(residential.hours);
    expect(industrial.cost).toBeGreaterThan(residential.cost);
  });

  test('falls back to chain link hours for unknown fence types', () => {
    expect(calculateLaborCost(120, 'Unknown', 'Residential', 50)).toEqual({ hours: 1.8, cost: 90 });
  });

  test.each([
    [100, 'Vinyl', 'Commercial', 60, { hours: 2.16, cost: 129.6 }],
    [250, 'Wrought Iron', 'Specialty', 85, { hours: 11.25, cost: 956.25 }],
    [0, 'Wood', 'Residential', 50, { hours: 0, cost: 0 }]
  ])('calculateLaborCost(%p, %p, %p, %p)', (feet, type, install, rate, expected) => {
    expect(calculateLaborCost(feet, type, install, rate)).toEqual(expected);
  });
});

describe('equipment and gate calculations', () => {
  test('uses higher daily rate for projects over 500 linear feet', () => {
    expect(calculateEquipmentCost(499, 50)).toBe(450);
    expect(calculateEquipmentCost(501, 50)).toBe(750);
  });

  test('adds auger charge for large post counts', () => {
    expect(calculateEquipmentCost(200, 79)).toBe(150);
    expect(calculateEquipmentCost(200, 81)).toBe(250);
  });

  test('returns zero equipment when no footage and no posts are provided', () => {
    expect(calculateEquipmentCost(0, 0)).toBe(0);
  });

  test.each([
    [0, 4, 'Swing', 0],
    [1, 4, 'Swing', 150],
    [2, 4, 'Double Swing', 525],
    [1, 6, 'Sliding', 484],
    [1, 12, 'Cantilever', 1204],
    [3, 4, 'None', 0]
  ])('calculateGateCost(%p, %p, %p) => %p', (count, width, type, expected) => {
    expect(calculateGateCost(count, width, type)).toBe(expected);
  });
});

describe('permit, extras, tax, and total calculations', () => {
  test.each([
    ['Residential', false, null, 125],
    ['Commercial', true, null, 300],
    ['Industrial', false, null, 325],
    ['Specialty', false, 999, 999]
  ])('calculatePermitCost(%p, %p, %p)', (type, expedited, overrideCost, expected) => {
    expect(calculatePermitCost(type, expedited, overrideCost)).toBe(expected);
  });

  test('calculateExtrasTotal sums arbitrary optional extras', () => {
    expect(calculateExtrasTotal([{ cost: 10 }, { cost: 15.5 }, { cost: 4.25 }])).toBe(29.75);
  });

  test('calculateTax uses customizable tax rate', () => {
    expect(calculateTax(1000)).toBe(130);
    expect(calculateTax(1000, 0.05)).toBe(50);
  });

  test('calculateTotal produces subtotal, tax, and final total', () => {
    expect(calculateTotal({
      materialCost: 500,
      laborCost: 200,
      equipmentCost: 100,
      permitCost: 25,
      utilityCost: 10,
      contingency: 15,
      gateCost: 75,
      extrasCost: 50
    })).toEqual({
      subtotal: 975,
      tax: 126.75,
      total: 1101.75
    });
  });

  test('calculateTotal defaults missing optional values to zero', () => {
    expect(calculateTotal({ materialCost: 100, laborCost: 50, equipmentCost: 25 })).toEqual({
      subtotal: 175,
      tax: 22.75,
      total: 197.75
    });
  });
});

describe('inventory-aware pricing', () => {
  const inventory = {
    'CL-PANEL-8': { unitPrice: 95.5, stock: 15 },
    'POST-2-3-8': { unitPrice: 44.25, stock: 120 },
    'GATE-SLIDE-12': { unitPrice: 825, stock: 2 }
  };

  test('enriches line items using inventory pricing', () => {
    expect(applyInventoryPricing([
      { sku: 'CL-PANEL-8', quantity: 3 },
      { sku: 'POST-2-3-8', quantity: 10 },
      { sku: 'GATE-SLIDE-12', quantity: 1 }
    ], inventory)).toEqual([
      { sku: 'CL-PANEL-8', quantity: 3, inStock: 15, unitPrice: 95.5, lineTotal: 286.5 },
      { sku: 'POST-2-3-8', quantity: 10, inStock: 120, unitPrice: 44.25, lineTotal: 442.5 },
      { sku: 'GATE-SLIDE-12', quantity: 1, inStock: 2, unitPrice: 825, lineTotal: 825 }
    ]);
  });

  test('prefers explicit unit price over inventory value when supplied', () => {
    const [item] = applyInventoryPricing([{ sku: 'CL-PANEL-8', quantity: 2, unitPrice: 88 }], inventory);
    expect(item.unitPrice).toBe(88);
    expect(item.lineTotal).toBe(176);
  });

  test('handles missing inventory records gracefully', () => {
    const [item] = applyInventoryPricing([{ sku: 'UNKNOWN', quantity: 5 }], inventory);
    expect(item.inStock).toBe(0);
    expect(item.unitPrice).toBe(0);
    expect(item.lineTotal).toBe(0);
  });
});

describe('calculateEstimate end-to-end', () => {
  test('builds a full residential chain link estimate', () => {
    expect(calculateEstimate({
      fenceType: 'Chain Link',
      linearFeet: 180,
      heightInches: 48,
      installationType: 'Residential',
      laborRate: 60,
      numberOfGates: 1,
      gateWidth: 4,
      gateType: 'Swing',
      utilityCost: 75,
      contingency: 50,
      extrasCost: 100,
      taxRate: 0.13
    })).toEqual({
      materialCost: 368,
      laborHours: 2.7,
      laborCost: 162,
      equipmentCost: 150,
      permitCost: 125,
      gateCost: 150,
      concreteBags: 48,
      panelCount: 23,
      postCount: 24,
      subtotal: 1180,
      tax: 153.4,
      total: 1333.4
    });
  });

  test('supports specialty wrought iron projects with overrides', () => {
    const result = calculateEstimate({
      fenceType: 'Wrought Iron',
      linearFeet: 300,
      heightInches: 72,
      installationType: 'Specialty',
      laborRate: 95,
      numberPosts: 45,
      bagsPerPost: 3,
      numberOfGates: 2,
      gateWidth: 8,
      gateType: 'Double Swing',
      permitCost: 500,
      utilityCost: 120,
      contingency: 300,
      extrasCost: 225,
      taxRate: 0.08
    });

    expect(result.materialCost).toBe(2280);
    expect(result.laborHours).toBe(13.5);
    expect(result.laborCost).toBe(1282.5);
    expect(result.equipmentCost).toBe(300);
    expect(result.permitCost).toBe(500);
    expect(result.gateCost).toBe(1015);
    expect(result.concreteBags).toBe(135);
    expect(result.panelCount).toBe(50);
    expect(result.postCount).toBe(45);
    expect(result.subtotal).toBe(6022.5);
    expect(result.tax).toBe(481.8);
    expect(result.total).toBe(6504.3);
  });

  test('auto-derives post count when omitted', () => {
    const result = calculateEstimate({
      fenceType: 'PVC',
      linearFeet: 64,
      heightInches: 48,
      installationType: 'Commercial',
      laborRate: 55,
      numberOfGates: 0,
      gateType: 'None'
    });
    expect(result.postCount).toBe(9);
    expect(result.concreteBags).toBe(18);
  });

  test('supports custom tax rates and expedited permits', () => {
    const result = calculateEstimate({
      fenceType: 'Wood',
      linearFeet: 90,
      heightInches: 48,
      installationType: 'Commercial',
      laborRate: 65,
      expeditedPermit: true,
      taxRate: 0.05
    });
    expect(result.permitCost).toBe(300);
    expect(result.tax).toBe(roundCurrency(result.subtotal * 0.05));
  });

  test('creates stable numbers for small projects and zero add-ons', () => {
    const result = calculateEstimate({
      fenceType: 'Aluminum',
      linearFeet: 12,
      heightInches: 48,
      installationType: 'Residential',
      laborRate: 50,
      numberOfGates: 0,
      utilityCost: 0,
      contingency: 0,
      extrasCost: 0,
      permitCost: 0
    });
    expect(result.materialCost).toBe(51.4);
    expect(result.laborHours).toBe(0.19);
    expect(result.laborCost).toBe(9.6);
    expect(result.equipmentCost).toBe(150);
    expect(result.subtotal).toBe(211);
    expect(result.total).toBe(238.43);
  });
});

describe('additional estimate scenarios', () => {
  test('handles commercial vinyl estimate with explicit post count', () => {
    const result = calculateEstimate({
      fenceType: 'Vinyl',
      linearFeet: 240,
      heightInches: 48,
      installationType: 'Commercial',
      laborRate: 70,
      numberPosts: 31,
      numberOfGates: 1,
      gateWidth: 5,
      gateType: 'Sliding',
      contingency: 125,
      utilityCost: 60,
      permitCost: 225
    });
    expect(result.postCount).toBe(31);
    expect(result.panelCount).toBe(30);
    expect(result.total).toBeGreaterThan(result.subtotal);
  });

  test('treats unknown installation type as residential baseline', () => {
    const result = calculateLaborCost(100, 'Wood', 'UnknownType', 50);
    expect(result).toEqual({ hours: 2, cost: 100 });
  });

  test('returns zero extras when list is empty', () => {
    expect(calculateExtrasTotal([])).toBe(0);
  });

  test('supports commercial grade multiplier indirectly through material grade', () => {
    const standard = calculateMaterialCost({ fenceType: 'Metal', linearFeet: 90, heightInches: 48, materialGrade: 'standard' });
    const commercial = calculateMaterialCost({ fenceType: 'Metal', linearFeet: 90, heightInches: 48, materialGrade: 'commercial' });
    expect(commercial).toBeGreaterThan(standard);
  });
});
