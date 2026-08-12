/**
 * FENCE DEPOT ESTIMATOR - Form Validation
 * frontend/js/validation.js
 */

'use strict';

var Validation = (function () {

  // ---- INDIVIDUAL VALIDATORS ----
  function isRequired(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  function isPhone(value) {
    return /^[\d\s\-().+]{7,20}$/.test(String(value || '').trim());
  }

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  function isPositive(value) {
    return isNumber(value) && parseFloat(value) > 0;
  }

  function isInRange(value, min, max) {
    var n = parseFloat(value);
    return isNumber(n) && n >= min && n <= max;
  }

  function isZipCode(value) {
    return /^\d{5}(-\d{4})?$/.test(String(value || '').trim());
  }

  function minLength(value, len) {
    return String(value || '').trim().length >= len;
  }

  function maxLength(value, len) {
    return String(value || '').trim().length <= len;
  }

  // ---- FIELD VALIDATION ----
  function validateField(input, rules) {
    var value   = input.value;
    var errors  = [];

    if (rules.required && !isRequired(value))         errors.push('This field is required.');
    if (value && rules.email    && !isEmail(value))   errors.push('Enter a valid email address.');
    if (value && rules.phone    && !isPhone(value))   errors.push('Enter a valid phone number.');
    if (value && rules.number   && !isNumber(value))  errors.push('Enter a valid number.');
    if (value && rules.positive && !isPositive(value))errors.push('Must be a positive number.');
    if (value && rules.zip      && !isZipCode(value)) errors.push('Enter a valid ZIP code (e.g. 12345).');
    if (value && rules.min      !== undefined && !isInRange(value, rules.min, Infinity)) {
      errors.push('Minimum value is ' + rules.min + '.');
    }
    if (value && rules.max      !== undefined && !isInRange(value, -Infinity, rules.max)) {
      errors.push('Maximum value is ' + rules.max + '.');
    }
    if (value && rules.minLen   !== undefined && !minLength(value, rules.minLen)) {
      errors.push('Must be at least ' + rules.minLen + ' characters.');
    }

    var errEl = input.parentElement && input.parentElement.querySelector('.form-error');
    if (errors.length > 0) {
      input.classList.add('error');
      if (errEl) { errEl.textContent = errors[0]; errEl.classList.add('show'); }
      return false;
    } else {
      input.classList.remove('error');
      if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
      return true;
    }
  }

  // ---- FORM VALIDATION ----
  function validateForm(formId, rules) {
    var form   = document.getElementById(formId);
    if (!form) return true;
    var valid  = true;

    Object.keys(rules).forEach(function (fieldName) {
      var input = form.querySelector('[name="' + fieldName + '"], #' + fieldName);
      if (input) {
        if (!validateField(input, rules[fieldName])) valid = false;
      }
    });

    return valid;
  }

  // ---- TAB-SPECIFIC VALIDATORS ----

  function validateProjectTab() {
    return validateForm('form-project', {
      customer_name:  { required: true, minLen: 2 },
      customer_email: { required: true, email: true },
      customer_phone: { required: true, phone: true },
      customer_address:{ required: true },
      customer_city:  { required: true },
      customer_state: { required: true },
      customer_zip:   { required: true, zip: true },
    });
  }

  function validateSpecsTab() {
    return validateForm('form-specs', {
      fence_type:     { required: true },
      fence_height:   { required: true, positive: true, min: 2, max: 20 },
      linear_feet:    { required: true, positive: true, min: 1, max: 99999 },
      material_color: { required: true },
    });
  }

  function validateEstimateTab() {
    return validateForm('form-estimate', {
      tax_rate: { required: true, number: true, min: 0, max: 25 },
    });
  }

  // ---- INLINE VALIDATION (real-time) ----
  function attachInlineValidation(inputEl, rules) {
    inputEl.addEventListener('blur', function () {
      validateField(inputEl, rules);
    });
    inputEl.addEventListener('input', function () {
      if (inputEl.classList.contains('error')) {
        validateField(inputEl, rules);
      }
    });
  }

  // ---- UTILITIES ----
  function clearErrors(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('show');
    });
  }

  // ---- PUBLIC ----
  return {
    isRequired, isEmail, isPhone, isNumber, isPositive, isInRange, isZipCode, minLength, maxLength,
    validateField, validateForm,
    validateProjectTab, validateSpecsTab, validateEstimateTab,
    attachInlineValidation, clearErrors,
  };

})();

window.Validation = Validation;
