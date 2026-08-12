const {
  normalizeValue,
  isRequired,
  isValidEmail,
  isValidPhone,
  isValidPostalCode,
  isPositiveNumber,
  isWithinRange,
  sanitizeText,
  validateRequiredFields,
  validateProjectData,
  validateFenceSpecs,
  validateEstimateInput,
  validateUserRegistration
} = require('../frontend/js/validation');

describe('primitive validation helpers', () => {
  test('normalizeValue trims strings and leaves non-strings untouched', () => {
    expect(normalizeValue('  hello  ')).toBe('hello');
    expect(normalizeValue(42)).toBe(42);
  });

  test.each([
    ['text', true],
    ['  text  ', true],
    ['', false],
    ['   ', false],
    [0, true],
    [false, true],
    [null, false],
    [undefined, false]
  ])('isRequired(%p) => %p', (value, expected) => {
    expect(isRequired(value)).toBe(expected);
  });

  test.each([
    ['user@example.com', true],
    ['USER@EXAMPLE.CA', true],
    ['invalid', false],
    ['user@example', false],
    ['', false]
  ])('isValidEmail(%p) => %p', (value, expected) => {
    expect(isValidEmail(value)).toBe(expected);
  });

  test.each([
    ['555-123-4567', true],
    ['+1 (555) 123-4567', true],
    ['4165557890', true],
    ['12345', false],
    ['', false]
  ])('isValidPhone(%p) => %p', (value, expected) => {
    expect(isValidPhone(value)).toBe(expected);
  });

  test.each([
    ['K1A 0B1', true],
    ['k1a0b1', true],
    ['90210', true],
    ['12345-6789', true],
    ['ABC123', false],
    ['', false]
  ])('isValidPostalCode(%p) => %p', (value, expected) => {
    expect(isValidPostalCode(value)).toBe(expected);
  });

  test.each([
    [5, false, true],
    [0, false, false],
    [0, true, true],
    [-1, true, false],
    ['3.5', false, true],
    ['abc', false, false]
  ])('isPositiveNumber(%p, allowZero=%p) => %p', (value, allowZero, expected) => {
    expect(isPositiveNumber(value, { allowZero })).toBe(expected);
  });

  test.each([
    [5, 1, 10, true],
    [0, 1, 10, false],
    [10, 1, 10, true],
    [11, 1, 10, false],
    ['7', 1, 10, true]
  ])('isWithinRange(%p, %p, %p) => %p', (value, min, max, expected) => {
    expect(isWithinRange(value, min, max)).toBe(expected);
  });

  test('sanitizeText strips angle brackets and compresses whitespace', () => {
    expect(sanitizeText(' <b>Hello</b>   world ')).toBe('bHello/b world');
  });

  test('sanitizeText obeys maximum length', () => {
    expect(sanitizeText('abcdef', 4)).toBe('abcd');
  });
});

describe('validateRequiredFields', () => {
  test('returns field-specific errors', () => {
    expect(validateRequiredFields({ a: 'value', b: '' }, ['a', 'b', 'c'])).toEqual({
      valid: false,
      errors: {
        b: 'b is required',
        c: 'c is required'
      }
    });
  });

  test('passes when all fields are present', () => {
    expect(validateRequiredFields({ a: 1, b: 'two' }, ['a', 'b'])).toEqual({ valid: true, errors: {} });
  });
});

describe('validateProjectData', () => {
  const validProject = {
    customerName: 'Jane Customer',
    customerEmail: 'JANE@EXAMPLE.COM',
    customerPhone: '(555) 444-3322',
    address: '123 Fence Lane',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 2T6',
    propertySize: '1200',
    projectNotes: '  Backyard replacement project.  '
  };

  test('accepts a well-formed project payload and returns sanitized data', () => {
    const result = validateProjectData(validProject);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitized).toEqual({
      customerName: 'Jane Customer',
      customerEmail: 'jane@example.com',
      customerPhone: '(555) 444-3322',
      address: '123 Fence Lane',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 2T6',
      propertySize: 1200,
      projectNotes: 'Backyard replacement project.'
    });
  });

  test('flags missing required fields', () => {
    const result = validateProjectData({});
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      customerName: 'customerName is required',
      customerEmail: 'customerEmail is required',
      customerPhone: 'customerPhone is required',
      address: 'address is required',
      city: 'city is required',
      province: 'province is required',
      postalCode: 'postalCode is required'
    });
  });

  test('rejects invalid contact fields', () => {
    const result = validateProjectData({
      ...validProject,
      customerEmail: 'bad-email',
      customerPhone: '1234',
      postalCode: 'XYZ',
      propertySize: -1
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.objectContaining({
      customerEmail: 'customerEmail must be a valid email address',
      customerPhone: 'customerPhone must be a valid phone number',
      postalCode: 'postalCode must be a valid Canadian or US postal code',
      propertySize: 'propertySize must be zero or greater'
    }));
  });

  test('allows empty property size while still sanitizing notes', () => {
    const result = validateProjectData({
      ...validProject,
      propertySize: '',
      projectNotes: '<script>alert(1)</script>   review'
    });
    expect(result.valid).toBe(true);
    expect(result.sanitized.propertySize).toBe('');
    expect(result.sanitized.projectNotes).toBe('scriptalert(1)/script review');
  });
});

describe('validateFenceSpecs', () => {
  const validSpecs = {
    fenceType: 'wood',
    height: 6,
    color: 'Cedar',
    materialGrade: 'premium',
    linearFeet: 140,
    numberOfPosts: 19,
    numberOfGates: 2,
    gateWidth: 5
  };

  test('accepts standard fence specs', () => {
    const result = validateFenceSpecs(validSpecs);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitized).toEqual({
      fenceType: 'wood',
      height: 6,
      color: 'Cedar',
      materialGrade: 'premium',
      linearFeet: 140,
      numberOfPosts: 19,
      numberOfGates: 2,
      gateWidth: 5
    });
  });

  test('supports using fenceHeight from the DOM form model', () => {
    const result = validateFenceSpecs({
      fenceType: 'vinyl',
      fenceHeight: 5,
      linearFeet: 75,
      numberOfPosts: 10,
      numberOfGates: 1,
      gateWidth: 4
    });
    expect(result.valid).toBe(true);
    expect(result.sanitized.height).toBe(5);
  });

  test('rejects unsupported fence types and invalid dimensions', () => {
    const result = validateFenceSpecs({
      fenceType: 'stone',
      height: 2,
      linearFeet: 0,
      numberOfPosts: -1,
      numberOfGates: -4,
      gateWidth: 25
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      fenceType: 'fenceType must be one of the supported fence types',
      linearFeet: 'linearFeet must be greater than zero',
      height: 'height must be between 3 and 12 feet',
      numberOfPosts: 'numberOfPosts must be zero or greater',
      numberOfGates: 'numberOfGates must be zero or greater',
      gateWidth: 'gateWidth must be between 0 and 24 feet'
    });
  });

  test('normalizes empty optional values', () => {
    const result = validateFenceSpecs({
      fenceType: 'chainlink',
      height: 4,
      color: '',
      materialGrade: '',
      linearFeet: 50,
      numberOfPosts: 0,
      numberOfGates: 0,
      gateWidth: 0
    });
    expect(result.valid).toBe(true);
    expect(result.sanitized.materialGrade).toBe('standard');
  });
});

describe('validateEstimateInput', () => {
  test('passes a complete estimate request', () => {
    expect(validateEstimateInput({
      projectId: 'PRJ-1',
      customerName: 'Jane Customer',
      fenceType: 'Wood',
      linearFeet: 180,
      laborRate: 55,
      permitCost: 0,
      utilityCost: 120,
      contingency: 50
    })).toEqual({ valid: true, errors: {} });
  });

  test('fails for missing required fields', () => {
    expect(validateEstimateInput({})).toEqual({
      valid: false,
      errors: {
        projectId: 'projectId is required',
        customerName: 'customerName is required',
        fenceType: 'fenceType is required'
      }
    });
  });

  test('fails for negative or zero numeric values where not allowed', () => {
    const result = validateEstimateInput({
      projectId: 'PRJ-1',
      customerName: 'Jane Customer',
      fenceType: 'Wood',
      linearFeet: 0,
      laborRate: -5,
      permitCost: -1,
      utilityCost: -2,
      contingency: -3
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      linearFeet: 'linearFeet must be greater than zero',
      laborRate: 'laborRate must be greater than zero',
      permitCost: 'permitCost must be zero or greater',
      utilityCost: 'utilityCost must be zero or greater',
      contingency: 'contingency must be zero or greater'
    });
  });
});

describe('validateUserRegistration', () => {
  test('accepts a valid registration payload', () => {
    expect(validateUserRegistration({
      username: 'estimator1',
      email: 'estimator@example.com',
      password: 'secret123',
      company: 'Fence Depot',
      phone: '5551234567'
    })).toEqual({ valid: true, errors: {} });
  });

  test('requires username, email, password, and company', () => {
    expect(validateUserRegistration({})).toEqual({
      valid: false,
      errors: {
        username: 'username must be at least 3 characters',
        email: 'email must be valid',
        password: 'password must be at least 6 characters',
        company: 'company is required'
      }
    });
  });

  test('flags short passwords and invalid phone numbers', () => {
    const result = validateUserRegistration({
      username: 'ab',
      email: 'bad-email',
      password: '123',
      company: '',
      phone: '12'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      username: 'username must be at least 3 characters',
      email: 'email must be valid',
      password: 'password must be at least 6 characters',
      company: 'company is required',
      phone: 'phone must be valid'
    });
  });
});
