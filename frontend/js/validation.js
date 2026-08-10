window.FEValidate = {
  required(value) { return value !== undefined && value !== null && String(value).trim().length > 0; },
  positive(value) { return Number(value) > 0; }
};
