window.FEApi = {
  baseUrl: '/api',
  token: null,
  headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.token) h.Authorization = 'Bearer ' + this.token;
    return h;
  },
  async request(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers: { ...this.headers(), ...(options.headers || {}) } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.blob();
  }
};
