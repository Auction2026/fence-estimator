const controller = require('../controllers/projectController');

describe('projectController helpers', () => {
  test('normalizeProjectInput trims and coerces values', () => {
    expect(controller.normalizeProjectInput({
      customerName: '  Test Customer  ',
      customerEmail: 'TEST@EXAMPLE.COM ',
      propertySize: '4200',
      status: '',
    })).toEqual(expect.objectContaining({
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      propertySize: 4200,
      status: 'draft',
    }));
  });

  test('validateProjectPayload catches required fields', () => {
    const errors = controller.validateProjectPayload(controller.normalizeProjectInput({}));
    expect(errors).toContain('customerName is required');
    expect(errors).toContain('address is required');
  });
});
