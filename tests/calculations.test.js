const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateEstimateBreakdown } = require('../backend/utils/calculations');

test('calculateEstimateBreakdown returns stable totals for a chain-link job', () => {
  const result = calculateEstimateBreakdown({
    fenceType: 'chain-link',
    linearFeet: 120,
    heightFeet: 6,
    gates: 1,
    tearOutFeet: 10,
    labourRate: 78,
    overheadRate: 0.12,
    profitRate: 0.18
  });

  assert.equal(result.posts, 13);
  assert.equal(result.concreteBags, 33);
  assert.equal(result.materialCost, 3360);
  assert.equal(result.total, 8101.74);
});
