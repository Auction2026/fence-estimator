const estimateMath = require('../services/estimateMath');

describe('estimateMath', () => {
  test('calculates labor and total values', () => {
    const labor = estimateMath.calculateLaborCost(200, 'Chain Link', 'Commercial', 60);
    expect(labor.hours).toBeGreaterThan(0);
    expect(labor.cost).toBeGreaterThan(0);
    const total = estimateMath.calculateTotal({ materialCost: 1000, laborCost: labor.cost, equipmentCost: 150, permitCost: 50 });
    expect(total.subtotal).toBeGreaterThan(1000);
    expect(total.total).toBeGreaterThan(total.subtotal);
  });
});
