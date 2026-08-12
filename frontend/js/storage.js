(function attachStorage(global) {
  const FE = global.FenceEstimator;
  function deepMerge(defaultValue, savedValue) {
    if (Array.isArray(defaultValue)) {
      return Array.isArray(savedValue) ? savedValue : FE.utils.clone(defaultValue);
    }
    if (defaultValue && typeof defaultValue === 'object') {
      const result = {};
      const source = savedValue && typeof savedValue === 'object' ? savedValue : {};
      Object.keys(defaultValue).forEach((key) => {
        result[key] = deepMerge(defaultValue[key], source[key]);
      });
      Object.keys(source).forEach((key) => {
        if (!(key in result)) result[key] = source[key];
      });
      return result;
    }
    return savedValue === undefined ? defaultValue : savedValue;
  }

  FE.Storage = {
    load(defaultState) {
      try {
        const raw = localStorage.getItem(FE.config.storageKey);
        return raw ? deepMerge(defaultState, JSON.parse(raw)) : FE.utils.clone(defaultState);
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
      setTimeout(() => URL.revokeObjectURL(url), 0);
    },
    async importFile(file) {
      try {
        const text = await file.text();
        return JSON.parse(text);
      } catch (error) {
        throw new Error('Imported file is not valid JSON');
      }
    },
    getToken() {
      return localStorage.getItem('fence-estimator-token') || '';
    },
  };
})(window);
