(function initApi(global) {
  async function request(path, options) {
    const response = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  global.FenceApi = {
    request,
  };
})(window);
