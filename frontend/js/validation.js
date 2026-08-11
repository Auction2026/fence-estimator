const PHONE_REGEX = /^[0-9+()\-\s]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_REGEX = /^[A-Za-z0-9\-\s]{4,10}$/;

export function normalizeText(value = '') {
  return String(value).trim();
}

export function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function buildError(field, message) {
  return { field, message };
}

export function validateRequired(field, value, label = field) {
  return normalizeText(value) ? null : buildError(field, `${label} is required.`);
}

export function validateEmail(field, value, label = field) {
  if (!normalizeText(value)) return buildError(field, `${label} is required.`);
  return EMAIL_REGEX.test(String(value).trim()) ? null : buildError(field, `${label} must be a valid email address.`);
}

export function validatePhone(field, value, label = field) {
  if (!normalizeText(value)) return buildError(field, `${label} is required.`);
  return PHONE_REGEX.test(String(value).trim()) ? null : buildError(field, `${label} must be a valid phone number.`);
}

export function validatePostalCode(field, value, label = field) {
  if (!normalizeText(value)) return buildError(field, `${label} is required.`);
  return POSTAL_REGEX.test(String(value).trim()) ? null : buildError(field, `${label} must be a valid postal or ZIP code.`);
}

export function validateRange(field, value, min, max, label = field) {
  const numeric = normalizeNumber(value, Number.NaN);
  if (!Number.isFinite(numeric)) return buildError(field, `${label} must be a number.`);
  if (numeric < min || numeric > max) return buildError(field, `${label} must be between ${min} and ${max}.`);
  return null;
}

export function validateEstimateCustomer(customer = {}) {
  return [
    validateRequired('firstName', customer.firstName, 'First name'),
    validateRequired('lastName', customer.lastName, 'Last name'),
    validateEmail('email', customer.email, 'Email'),
    validatePhone('phone', customer.phone, 'Phone'),
    validateRequired('address', customer.address, 'Street address'),
    validateRequired('city', customer.city, 'City'),
    validateRequired('province', customer.province, 'Province/State'),
    validatePostalCode('postalCode', customer.postalCode, 'Postal code'),
  ].filter(Boolean);
}

export function validateFenceSpecifications(specs = {}) {
  return [
    validateRequired('fenceType', specs.fenceType, 'Fence type'),
    validateRequired('style', specs.style, 'Fence style'),
    validateRange('height', specs.height, 3, 10, 'Fence height'),
    validateRange('postSpacing', specs.postSpacing, 4, 16, 'Post spacing'),
    validateRange('wastePercent', specs.wastePercent ?? 0.05, 0, 0.2, 'Waste factor'),
  ].filter(Boolean);
}

export function validateMeasurements(measurements = {}) {
  const errors = [
    validateRange('linearFeet', measurements.linearFeet, 10, 50000, 'Linear footage'),
    validateRange('corners', measurements.corners ?? 4, 0, 40, 'Corners'),
    validateRange('ends', measurements.ends ?? 2, 0, 40, 'Ends'),
  ].filter(Boolean);

  (Array.isArray(measurements.gates) ? measurements.gates : []).forEach((gate, index) => {
    const gateCountError = validateRange(`gate-${index}-count`, gate.count ?? 1, 1, 10, `Gate ${index + 1} count`);
    const gateWidthError = validateRange(`gate-${index}-width`, gate.width ?? 4, 2, 40, `Gate ${index + 1} width`);
    if (gateCountError) errors.push(gateCountError);
    if (gateWidthError) errors.push(gateWidthError);
  });

  return errors;
}

export function validateCostInputs(costs = {}) {
  return [
    validateRange('laborRate', costs.laborRate, 15, 250, 'Labor rate'),
    validateRange('overheadPercent', costs.overheadPercent, 0, 0.5, 'Overhead percent'),
    validateRange('profitPercent', costs.profitPercent, 0, 0.75, 'Profit percent'),
    validateRange('taxPercent', costs.taxPercent, 0, 0.2, 'Tax percent'),
    validateRange('discountAmount', costs.discountAmount ?? 0, 0, 1000000, 'Discount amount'),
  ].filter(Boolean);
}

export function validateReviewApproval(review = {}) {
  const errors = [];
  if (!review.acceptedTerms) errors.push(buildError('acceptedTerms', 'You must confirm the estimate terms before generating a proposal.'));
  if (review.sendEmail && !EMAIL_REGEX.test(String(review.deliveryEmail || '').trim())) {
    errors.push(buildError('deliveryEmail', 'A valid delivery email is required to send the estimate.'));
  }
  return errors;
}

export const STEP_VALIDATORS = {
  1: (state) => validateEstimateCustomer(state.customer),
  2: (state) => validateFenceSpecifications({ ...state.specifications }),
  3: (state) => validateMeasurements(state.measurements),
  4: (state) => validateCostInputs(state.pricing),
  5: (state) => validateReviewApproval(state.review),
};

export function validateWizardStep(step, state) {
  return STEP_VALIDATORS[step] ? STEP_VALIDATORS[step](state) : [];
}

export function validateEstimateState(state = {}) {
  return Object.keys(STEP_VALIDATORS).map((step) => validateWizardStep(Number(step), state)).flat();
}

export function errorsByField(errors = []) {
  return errors.reduce((result, error) => {
    if (!result[error.field]) result[error.field] = [];
    result[error.field].push(error.message);
    return result;
  }, {});
}

export function applyValidationToForm(form, errors = []) {
  if (!(form instanceof HTMLFormElement)) return;
  const byField = errorsByField(errors);
  [...form.querySelectorAll('[name]')].forEach((field) => {
    const wrapper = field.closest('[data-field-wrapper]') || field.closest('.field') || field.parentElement;
    const errorElement = wrapper?.querySelector('[data-field-error]');
    const fieldErrors = byField[field.name] || [];
    wrapper?.classList.toggle('is-invalid', fieldErrors.length > 0);
    field.setAttribute('aria-invalid', String(fieldErrors.length > 0));
    if (errorElement) errorElement.textContent = fieldErrors[0] || '';
  });
}

export function sanitizeEstimateInput(payload = {}) {
  return {
    customer: {
      firstName: normalizeText(payload.customer?.firstName),
      lastName: normalizeText(payload.customer?.lastName),
      email: normalizeText(payload.customer?.email).toLowerCase(),
      phone: normalizeText(payload.customer?.phone),
      address: normalizeText(payload.customer?.address),
      city: normalizeText(payload.customer?.city),
      province: normalizeText(payload.customer?.province),
      postalCode: normalizeText(payload.customer?.postalCode).toUpperCase(),
    },
    specifications: {
      fenceType: normalizeText(payload.specifications?.fenceType),
      style: normalizeText(payload.specifications?.style),
      color: normalizeText(payload.specifications?.color),
      height: normalizeNumber(payload.specifications?.height, 0),
      postSpacing: normalizeNumber(payload.specifications?.postSpacing, 8),
      wastePercent: normalizeNumber(payload.specifications?.wastePercent, 0.05),
      material: normalizeText(payload.specifications?.material),
      stain: Boolean(payload.specifications?.stain),
      capBoard: Boolean(payload.specifications?.capBoard),
    },
    measurements: {
      linearFeet: normalizeNumber(payload.measurements?.linearFeet, 0),
      corners: normalizeNumber(payload.measurements?.corners, 4),
      ends: normalizeNumber(payload.measurements?.ends, 2),
      gates: Array.isArray(payload.measurements?.gates) ? payload.measurements.gates.map((gate) => ({ width: normalizeNumber(gate.width, 4), count: normalizeNumber(gate.count, 1), swing: normalizeText(gate.swing) || 'single' })) : [],
    },
    pricing: {
      laborRate: normalizeNumber(payload.pricing?.laborRate, 58),
      overheadPercent: normalizeNumber(payload.pricing?.overheadPercent, 0.12),
      profitPercent: normalizeNumber(payload.pricing?.profitPercent, 0.2),
      taxPercent: normalizeNumber(payload.pricing?.taxPercent, 0.13),
      discountAmount: normalizeNumber(payload.pricing?.discountAmount, 0),
    },
    review: {
      acceptedTerms: Boolean(payload.review?.acceptedTerms),
      sendEmail: Boolean(payload.review?.sendEmail),
      deliveryEmail: normalizeText(payload.review?.deliveryEmail),
    },
  };
}

if (typeof window !== 'undefined') {
  window.FenceEstimatorValidation = { validateWizardStep, validateEstimateState, sanitizeEstimateInput };
}
