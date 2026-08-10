window.FEAuth = {
  async login(email, password) {
    const result = await FEApi.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    FEApi.token = result.token;
    FEStorage.set('auth', result);
    return result;
  },
  load() {
    const saved = FEStorage.get('auth');
    if (saved?.token) FEApi.token = saved.token;
    return saved;
  }
};
