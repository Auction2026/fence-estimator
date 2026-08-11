(function initValidation(global) {
  function requireValue(value, label) {
    if (value === undefined || value === null || String(value).trim() === '') {
      return `${label} is required`;
    }
    return null;
  }

  global.FenceValidation = {
    requireValue,
  };
})(window);
