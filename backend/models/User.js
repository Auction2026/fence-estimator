class User {
  static normalize(payload = {}) {
    return {
      name: String(payload.name || '').trim(),
      email: String(payload.email || '').trim().toLowerCase(),
      password: String(payload.password || ''),
      role: String(payload.role || 'estimator').trim() || 'estimator'
    };
  }

  static validate(payload = {}) {
    const user = User.normalize(payload);
    const errors = [];

    if (!user.name) errors.push('Name is required.');
    if (!user.email || !user.email.includes('@')) errors.push('Valid email is required.');
    if (user.password.length < 8) errors.push('Password must be at least 8 characters.');

    return { value: user, errors };
  }
}

module.exports = User;
