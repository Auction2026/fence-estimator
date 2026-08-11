
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email || '').trim());
}

function validatePhone(phone) {
  const cleaned = String(phone || '').replace(/\D/g, '');
  return cleaned.length === 10;
}

function validateRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null && value !== '';
}

function validateNumber(value, min, max) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) {
    return false;
  }
  if (min !== undefined && num < min) {
    return false;
  }
  if (max !== undefined && num > max) {
    return false;
  }
  return true;
}

function validateProjectForm(formData) {
  const errors = [];

  if (!validateRequired(formData.customerName)) {
    errors.push('Customer name is required');
  }

  if (!validateEmail(formData.customerEmail)) {
    errors.push('Valid email is required');
  }

  if (!validatePhone(formData.customerPhone)) {
    errors.push('Valid phone number is required');
  }

  if (!validateRequired(formData.address)) {
    errors.push('Address is required');
  }

  return errors;
}

function validateFenceSpecs(specs) {
  const errors = [];

  if (!validateRequired(specs.fenceType)) {
    errors.push('Fence type is required');
  }

  if (!validateNumber(specs.height, 3, 12)) {
    errors.push('Height must be between 3 and 12 feet');
  }

  if (!validateNumber(specs.linearFeet, 1, 10000)) {
    errors.push('Linear feet must be between 1 and 10,000');
  }

  if (!validateNumber(specs.numberOfPosts, 0, 1000)) {
    errors.push('Post count must be between 0 and 1,000');
  }

  return errors;
}

function validateContractForm(formData) {
  const errors = [];

  if (!validateNumber(formData.priceLockDays, 1, 365)) {
    errors.push('Price lock must be between 1 and 365 days');
  }

  if (!validateNumber(formData.depositPercent, 0, 100)) {
    errors.push('Deposit percent must be between 0 and 100');
  }

  if (!validateRequired(formData.scopeOfWork)) {
    errors.push('Scope of work is required');
  }

  return errors;
}

function validateSignOff(formData) {
  const errors = [];
  if (!validateRequired(formData.customerSignature)) {
    errors.push('Customer signature or initials are required');
  }
  return errors;
}

function sanitizeText(value) {
  return String(value || '').replace(/[<>]/g, '').trim();
}

function displayValidationErrors(errors) {
  const errorContainer = document.getElementById('errors');
  if (!errorContainer) {
    return;
  }

  errorContainer.innerHTML = '';
  errors.forEach((message) => {
    const node = document.createElement('div');
    node.className = 'error-message';
    node.textContent = message;
    errorContainer.appendChild(node);
  });
}

window.FenceValidation = {
  validateEmail,
  validatePhone,
  validateRequired,
  validateNumber,
  validateProjectForm,
  validateFenceSpecs,
  validateContractForm,
  validateSignOff,
  sanitizeText,
  displayValidationErrors
};
