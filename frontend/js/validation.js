function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isValidPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

function isValidPostalCode(value) {
  const candidate = String(value || '').trim();
  const canadian = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  const usZip = /^\d{5}(-\d{4})?$/;
  return canadian.test(candidate) || usZip.test(candidate);
}

function isPositiveNumber(value, { allowZero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return false;
  return allowZero ? number >= 0 : number > 0;
}

function isWithinRange(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return false;
  return number >= min && number <= max;
}

function sanitizeText(value, maxLength = 500) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function validateRequiredFields(data, requiredFields = []) {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!isRequired(data[field])) {
      errors[field] = `${field} is required`;
    }
  });
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

function validateProjectData(project = {}) {
  const errors = {};
  const required = ['customerName', 'customerEmail', 'customerPhone', 'address', 'city', 'province', 'postalCode'];
  required.forEach((field) => {
    if (!isRequired(project[field])) {
      errors[field] = `${field} is required`;
    }
  });
  if (project.customerEmail && !isValidEmail(project.customerEmail)) {
    errors.customerEmail = 'customerEmail must be a valid email address';
  }
  if (project.customerPhone && !isValidPhone(project.customerPhone)) {
    errors.customerPhone = 'customerPhone must be a valid phone number';
  }
  if (project.postalCode && !isValidPostalCode(project.postalCode)) {
    errors.postalCode = 'postalCode must be a valid Canadian or US postal code';
  }
  if (project.propertySize !== undefined && project.propertySize !== '' && !isPositiveNumber(project.propertySize, { allowZero: true })) {
    errors.propertySize = 'propertySize must be zero or greater';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      customerName: sanitizeText(project.customerName, 120),
      customerEmail: String(project.customerEmail || '').trim().toLowerCase(),
      customerPhone: sanitizeText(project.customerPhone, 30),
      address: sanitizeText(project.address, 200),
      city: sanitizeText(project.city, 80),
      province: sanitizeText(project.province, 80),
      postalCode: sanitizeText(project.postalCode, 12).toUpperCase(),
      propertySize: project.propertySize === '' || project.propertySize === undefined ? '' : Number(project.propertySize),
      projectNotes: sanitizeText(project.projectNotes, 1000)
    }
  };
}

function validateFenceSpecs(specs = {}) {
  const errors = {};
  const allowedFenceTypes = ['chainlink', 'wood', 'vinyl', 'wroughtiron', 'composite', 'metal', 'pvc', 'aluminum'];
  if (!isRequired(specs.fenceType) || !allowedFenceTypes.includes(String(specs.fenceType).toLowerCase())) {
    errors.fenceType = 'fenceType must be one of the supported fence types';
  }
  if (!isPositiveNumber(specs.linearFeet)) {
    errors.linearFeet = 'linearFeet must be greater than zero';
  }
  if (!isWithinRange(specs.height ?? specs.fenceHeight, 3, 12)) {
    errors.height = 'height must be between 3 and 12 feet';
  }
  if (!isPositiveNumber(specs.numberOfPosts, { allowZero: true })) {
    errors.numberOfPosts = 'numberOfPosts must be zero or greater';
  }
  if (!isPositiveNumber(specs.numberOfGates ?? 0, { allowZero: true })) {
    errors.numberOfGates = 'numberOfGates must be zero or greater';
  }
  if (specs.gateWidth !== undefined && specs.gateWidth !== '' && !isWithinRange(specs.gateWidth, 0, 24)) {
    errors.gateWidth = 'gateWidth must be between 0 and 24 feet';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      fenceType: String(specs.fenceType || '').trim().toLowerCase(),
      height: Number(specs.height ?? specs.fenceHeight),
      color: sanitizeText(specs.color, 40),
      materialGrade: sanitizeText(specs.materialGrade || 'standard', 20).toLowerCase() || 'standard',
      linearFeet: Number(specs.linearFeet),
      numberOfPosts: Number(specs.numberOfPosts || 0),
      numberOfGates: Number(specs.numberOfGates || 0),
      gateWidth: Number(specs.gateWidth || 0)
    }
  };
}

function validateEstimateInput(estimate = {}) {
  const errors = {};
  ['projectId', 'customerName', 'fenceType'].forEach((field) => {
    if (!isRequired(estimate[field])) {
      errors[field] = `${field} is required`;
    }
  });
  ['linearFeet', 'laborRate'].forEach((field) => {
    if (estimate[field] !== undefined && estimate[field] !== '' && !isPositiveNumber(estimate[field])) {
      errors[field] = `${field} must be greater than zero`;
    }
  });
  ['permitCost', 'utilityCost', 'contingency'].forEach((field) => {
    if (estimate[field] !== undefined && estimate[field] !== '' && !isPositiveNumber(estimate[field], { allowZero: true })) {
      errors[field] = `${field} must be zero or greater`;
    }
  });
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

function validateUserRegistration(user = {}) {
  const errors = {};
  if (!isRequired(user.username) || String(user.username).trim().length < 3) {
    errors.username = 'username must be at least 3 characters';
  }
  if (!isValidEmail(user.email)) {
    errors.email = 'email must be valid';
  }
  if (!isRequired(user.password) || String(user.password).length < 6) {
    errors.password = 'password must be at least 6 characters';
  }
  if (!isRequired(user.company)) {
    errors.company = 'company is required';
  }
  if (user.phone && !isValidPhone(user.phone)) {
    errors.phone = 'phone must be valid';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  normalizeValue,
  isRequired,
  isValidEmail,
  isValidPhone,
  isValidPostalCode,
  isPositiveNumber,
  isWithinRange,
  sanitizeText,
  validateRequiredFields,
  validateProjectData,
  validateFenceSpecs,
  validateEstimateInput,
  validateUserRegistration
};
