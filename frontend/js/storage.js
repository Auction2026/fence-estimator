(function attachStorage(global) {
  const FE = global.FenceEstimator;
  FE.Storage = {
    load(defaultState) {
      try {
        const raw = localStorage.getItem(FE.config.storageKey);
        return raw ? Object.assign({}, defaultState, JSON.parse(raw)) : FE.utils.clone(defaultState);
      } catch (error) {
        return FE.utils.clone(defaultState);
      }
    },
    save(state) {
      localStorage.setItem(FE.config.storageKey, JSON.stringify(state));
      return state;
    },
    reset(defaultState) {
      localStorage.removeItem(FE.config.storageKey);
      return FE.utils.clone(defaultState);
    },
    exportState(state) {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fence-estimator-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
    async importFile(file) {
      const text = await file.text();
      return JSON.parse(text);
    },
    getToken() {
      return localStorage.getItem('fence-estimator-token') || '';
    },
  };
})(window);
