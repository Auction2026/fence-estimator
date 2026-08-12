const jwt = require('jsonwebtoken');
const { extractBearerToken, authenticateRequest } = require('../middleware/auth');

describe('auth middleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'fence-estimator-test-secret';
  });

  test('extractBearerToken parses bearer header', () => {
    expect(extractBearerToken('Bearer ' + 'token-123')).toBe('token-123');
    expect(extractBearerToken('Basic nope')).toBe('');
  });

  test('authenticateRequest populates request user info', () => {
    const token = jwt.sign({ userId: 'user-1', role: 'admin' }, process.env.JWT_SECRET);
    const req = { header: () => 'Bearer ' + token };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authenticateRequest(req, res, next);
    expect(req.userId).toBe('user-1');
    expect(req.userRole).toBe('admin');
    expect(next).toHaveBeenCalled();
  });
});
