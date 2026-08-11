(function () {
  function clearErrors() {
    document.querySelectorAll('.field-error').forEach((element) => element.remove());
    document.querySelectorAll('.error').forEach((element) => element.classList.remove('error'));
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) {
      return;
    }

    field.classList.add('error');
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.insertAdjacentElement('afterend', error);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  function isValidPhone(phone) {
    return /^\+?[0-9()\-\s.]{10,20}$/.test(String(phone || '').trim());
  }

  function normalizeValidationResult(errors) {
    clearErrors();
    Object.entries(errors).forEach(([fieldId, message]) => showError(fieldId, message));
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  function validateProjectInfo(data = {}) {
    const errors = {};
    if (!data.customerName?.trim()) errors.customerName = 'Customer name is required.';
    if (!data.address?.trim()) errors.address = 'Address is required.';
    if (!data.customerPhone?.trim() || !isValidPhone(data.customerPhone)) errors.customerPhone = 'Enter a valid phone number.';
    if (!data.customerEmail?.trim() || !isValidEmail(data.customerEmail)) errors.customerEmail = 'Enter a valid email address.';
    if (!data.projectDate) errors.projectDate = 'Project date is required.';
    if (!data.projectType?.trim()) errors.projectType = 'Project type is required.';
    if (!data.city?.trim()) errors.city = 'City is required.';
    if (!data.province?.trim()) errors.province = 'State / province is required.';
    if (!data.postalCode?.trim()) errors.postalCode = 'Postal code is required.';
    return normalizeValidationResult(errors);
  }

  function validateFenceSpecs(data = {}) {
    const errors = {};
    const totalFootage = Number(data.totalFootage);
    const height = Number(data.fenceHeight);
    if (!data.fenceType) errors.fenceType = 'Fence type is required.';
    if (!Number.isFinite(totalFootage) || totalFootage <= 0) errors.totalFootage = 'Enter footage greater than zero.';
    if (!Number.isFinite(height) || height < 3) errors.fenceHeight = 'Fence height must be at least 3 ft.';
    if (Number(data.gateCount || 0) < 0) errors.gateCount = 'Gate count cannot be negative.';
    if (Number(data.gateWidth || 0) < 0) errors.gateWidth = 'Gate width cannot be negative.';
    return normalizeValidationResult(errors);
  }

  function validateEstimate(data = {}) {
    const errors = {};
    if (!Array.isArray(data.materials) || data.materials.length === 0) errors['recalculate-estimate-btn'] = 'Calculate materials before saving an estimate.';
    if (Number(data.laborRate) <= 0) errors.laborRate = 'Labor rate must be greater than zero.';
    if (Number(data.markupPercent) < 0) errors.markupPercent = 'Markup cannot be negative.';
    return normalizeValidationResult(errors);
  }

  function validateContract(data = {}) {
    const errors = {};
    if (!data.lockedPrice || Number(data.lockedPrice) <= 0) errors.contractTerms = 'Lock the estimate price before generating a contract.';
    if (!data.contractTerms?.trim()) errors.contractTerms = 'Contract terms are required.';
    if (!data.customerSignature?.trim()) errors.customerSignature = 'Customer signature is required.';
    if (!data.salesSignature?.trim()) errors.salesSignature = 'Representative signature is required.';
    return normalizeValidationResult(errors);
  }

  window.Validation = {
    validateProjectInfo,
    validateFenceSpecs,
    validateEstimate,
    validateContract,
    showError,
    clearErrors,
    isValidEmail,
    isValidPhone
  };
})();
