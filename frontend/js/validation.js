/**
 * FENCE DEPOT ESTIMATOR - Form Validation
 * validation.js
 */

'use strict';

const Validation = (() => {

  // ============================================================
  // RULES
  // ============================================================
  const RULES = {
    required: (v) => v !== null && v !== undefined && String(v).trim() !== '',
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()),
    phone:    (v) => /^[\d\s\-().+]{7,20}$/.test(String(v).trim()),
    postal:   (v) => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(String(v).trim()),
    minLen:   (min) => (v) => String(v).trim().length >= min,
    maxLen:   (max) => (v) => String(v).trim().length <= max,
    min:      (min) => (v) => Number(v) >= min,
    max:      (max) => (v) => Number(v) <= max,
    numeric:  (v) => !isNaN(parseFloat(v)) && isFinite(v),
    positive: (v) => Number(v) > 0,
    pattern:  (re) => (v) => re.test(String(v).trim()),
  };

  const MESSAGES = {
    required: 'This field is required.',
    email:    'Please enter a valid email address.',
    phone:    'Please enter a valid phone number.',
    postal:   'Please enter a valid Canadian postal code (e.g. A1A 1A1).',
    numeric:  'Please enter a number.',
    positive: 'Please enter a number greater than 0.',
    minLen:   (n) => `Must be at least ${n} characters.`,
    maxLen:   (n) => `Must be no more than ${n} characters.`,
    min:      (n) => `Must be at least ${n}.`,
    max:      (n) => `Must be no more than ${n}.`,
  };

  // ============================================================
  // CORE VALIDATE FUNCTION
  // ============================================================

  /**
   * validate(value, rules) → { valid: Boolean, message: String }
   *
   * rules is an array of strings or [ruleName, param] pairs, e.g.:
   *   ['required', ['minLen', 3], 'email']
   */
  function validate(value, rules = []) {
    for (const rule of rules) {
      const [name, param] = Array.isArray(rule) ? rule : [rule, null];
      let fn, msg;
      if (param !== null && param !== undefined) {
        fn  = RULES[name]?.(param);
        msg = MESSAGES[name]?.(param) || `Validation failed: ${name}`;
      } else {
        fn  = RULES[name];
        msg = MESSAGES[name] || `Validation failed: ${name}`;
      }
      if (fn && !fn(value)) return { valid: false, message: msg };
    }
    return { valid: true, message: '' };
  }

  // ============================================================
  // FORM VALIDATION
  // ============================================================

  /**
   * validateForm(formEl) — validates all fields with data-rules attribute.
   * Returns { valid, errors: Map<fieldName, message> }
   *
   * Usage in HTML:
   *   <input name="email" data-rules="required,email" data-label="Email">
   */
  function validateForm(formEl) {
    const fields = formEl.querySelectorAll('[data-rules]');
    const errors = new Map();

    fields.forEach(field => {
      const rules   = (field.dataset.rules || '').split(',').map(r => r.trim()).filter(Boolean);
      const result  = validate(field.value, rules);
      clearFieldError(field);
      if (!result.valid) {
        showFieldError(field, result.message);
        errors.set(field.name || field.id, result.message);
      } else {
        showFieldSuccess(field);
      }
    });

    return { valid: errors.size === 0, errors };
  }

  // ============================================================
  // FIELD-LEVEL UI
  // ============================================================
  function showFieldError(field, message) {
    field.classList.add('is-error');
    field.classList.remove('is-valid');
    let errEl = field.parentElement.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'form-error';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.classList.add('visible');
  }

  function showFieldSuccess(field) {
    field.classList.remove('is-error');
    field.classList.add('is-valid');
    const errEl = field.parentElement.querySelector('.form-error');
    if (errEl) errEl.classList.remove('visible');
  }

  function clearFieldError(field) {
    field.classList.remove('is-error', 'is-valid');
    const errEl = field.parentElement.querySelector('.form-error');
    if (errEl) errEl.classList.remove('visible');
  }

  function clearFormErrors(formEl) {
    formEl.querySelectorAll('.form-control').forEach(clearFieldError);
  }

  // ============================================================
  // REAL-TIME VALIDATION (blur events)
  // ============================================================
  function attachRealtime(formEl) {
    formEl.querySelectorAll('[data-rules]').forEach(field => {
      field.addEventListener('blur', () => {
        const rules  = (field.dataset.rules || '').split(',').map(r => r.trim()).filter(Boolean);
        const result = validate(field.value, rules);
        clearFieldError(field);
        if (!result.valid) showFieldError(field, result.message);
        else if (field.value.trim()) showFieldSuccess(field);
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('is-error')) clearFieldError(field);
      });
    });
  }

  // ============================================================
  // ESTIMATE-SPECIFIC VALIDATION
  // ============================================================
  function validateEstimateStep(step, data) {
    const errors = [];

    switch (step) {
      case 1: // Customer info
        if (!RULES.required(data.customerName))  errors.push('Customer name is required.');
        if (!RULES.email(data.customerEmail))     errors.push('Valid email is required.');
        if (!RULES.phone(data.customerPhone))     errors.push('Valid phone number is required.');
        if (!RULES.required(data.address))        errors.push('Address is required.');
        if (!RULES.required(data.city))           errors.push('City is required.');
        if (!RULES.required(data.province))       errors.push('Province is required.');
        if (data.postalCode && !RULES.postal(data.postalCode)) errors.push('Valid postal code is required.');
        break;

      case 2: // Fence type
        if (!RULES.required(data.fenceType))      errors.push('Please select a fence type.');
        if (!RULES.required(data.heightFt))       errors.push('Please select a fence height.');
        break;

      case 3: // Footage & gates
        if (!RULES.positive(data.footage))        errors.push('Please enter a valid linear footage (> 0).');
        if (Number(data.footage) > 10000)         errors.push('Footage seems too large — please double-check.');
        break;

      case 4: // Materials review — no required fields
        break;

      case 5: // Summary — no required fields
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    // Auto-attach realtime validation to any forms present at load time
    document.querySelectorAll('form[data-validate]').forEach(attachRealtime);
  }

  return { init, validate, validateForm, validateEstimateStep, attachRealtime, clearFormErrors, showFieldError, clearFieldError };
})();

window.Validation = Validation;
