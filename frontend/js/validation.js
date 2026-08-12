const validators = {
  required(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
  },
  phone(value) {
    return /^[0-9+()\-\s]{7,20}$/.test(String(value || ''));
  },
  postal(value) {
    return String(value || '').trim().length >= 5;
  },
};

function validateProjectData(data) {
  const errors = {};
  if (!validators.required(data.name)) errors.name = 'Customer name is required';
  if (!validators.email(data.email)) errors.email = 'Valid email is required';
  if (!validators.phone(data.phone)) errors.phone = 'Valid phone is required';
  if (!validators.required(data.address)) errors.address = 'Address is required';
  return { valid: Object.keys(errors).length === 0, errors };
}

function validateSpecsData(data) {
  const errors = {};
  if (!validators.required(data.fenceType)) errors.fenceType = 'Fence type is required';
  if (Number(data.linearFeet) <= 0) errors.linearFeet = 'Linear feet must be greater than 0';
  if (Number(data.numberOfPosts) < 0) errors.numberOfPosts = 'Post count cannot be negative';
  return { valid: Object.keys(errors).length === 0, errors };
}

window.fenceValidation = { validateProjectData, validateSpecsData };
