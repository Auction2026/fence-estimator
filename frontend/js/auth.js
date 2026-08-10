window.FEAuth = {
  async login(email, password) {
    const result = await FEApi.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    FEApi.token = result.token;
    sessionStorage.setItem('auth_user', JSON.stringify(result.user || null));
    sessionStorage.setItem('auth_token', result.token);
    return result;
  },
  load() {
    const token = sessionStorage.getItem('auth_token');
    if (token) FEApi.token = token;
    let user = null;
    try { user = JSON.parse(sessionStorage.getItem('auth_user') || 'null'); } catch (_) { user = null; }
    return user || null;
  }
};
