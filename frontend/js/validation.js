/**
 * validation.js – Form validation for Fence Estimator Pro
 */

const Validation = (() => {
  // ── Regex patterns ────────────────────────────────────────────
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const POSTAL_CA_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  const ZIP_US_REGEX = /^\d{5}(-\d{4})?$/;

  // ── Field validators ──────────────────────────────────────────
  function isRequired(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  function isEmail(value) {
    return EMAIL_REGEX.test(String(value).trim());
  }

  function isPhone(value) {
    return PHONE_REGEX.test(String(value).trim());
  }

  function isPostalCode(value) {
    const v = String(value).trim();
    return POSTAL_CA_REGEX.test(v) || ZIP_US_REGEX.test(v);
  }

  function isNumber(value, { min = null, max = null } = {}) {
    const n = parseFloat(value);
    if (isNaN(n)) return false;
    if (min !== null && n < min) return false;
    if (max !== null && n > max) return false;
    return true;
  }

  function isInteger(value, { min = null, max = null } = {}) {
    const n = parseInt(value, 10);
    if (isNaN(n) || n !== parseFloat(value)) return false;
    if (min !== null && n < min) return false;
    if (max !== null && n > max) return false;
    return true;
  }

  function isDate(value) {
    if (!value) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  }

  function minLength(value, min) {
    return String(value).trim().length >= min;
  }

  function maxLength(value, max) {
    return String(value).trim().length <= max;
  }

  // ── Field-level validation with visual feedback ───────────────
  function validateField(input, rules) {
    const value = input.value;
    let error = null;

    for (const rule of rules) {
      if (rule.required && !isRequired(value)) {
        error = rule.message || 'This field is required.';
        break;
      }
      if (rule.email && value && !isEmail(value)) {
        error = rule.message || 'Please enter a valid email address.';
        break;
      }
      if (rule.phone && value && !isPhone(value)) {
        error = rule.message || 'Please enter a valid phone number.';
        break;
      }
      if (rule.postal && value && !isPostalCode(value)) {
        error = rule.message || 'Please enter a valid postal/zip code.';
        break;
      }
      if (rule.min !== undefined && value && !isNumber(value, { min: rule.min })) {
        error = rule.message || `Minimum value is ${rule.min}.`;
        break;
      }
      if (rule.max !== undefined && value && !isNumber(value, { max: rule.max })) {
        error = rule.message || `Maximum value is ${rule.max}.`;
        break;
      }
      if (rule.minLen && !minLength(value, rule.minLen)) {
        error = rule.message || `Minimum ${rule.minLen} characters required.`;
        break;
      }
      if (rule.maxLen && !maxLength(value, rule.maxLen)) {
        error = rule.message || `Maximum ${rule.maxLen} characters allowed.`;
        break;
      }
    }

    showFieldError(input, error);
    return error === null;
  }

  function showFieldError(input, errorMsg) {
    input.classList.remove('invalid', 'valid');
    let errEl = input.parentElement.querySelector('.field-error');

    if (errorMsg) {
      input.classList.add('invalid');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        errEl.style.cssText = 'color:#c0392b;font-size:12px;display:block;margin-top:2px;';
        input.parentElement.appendChild(errEl);
      }
      errEl.textContent = errorMsg;
    } else {
      input.classList.add('valid');
      if (errEl) errEl.remove();
    }
  }

  // ── Form validators ───────────────────────────────────────────
  function validateProjectForm() {
    const fields = [
      { id: 'cust-name', rules: [{ required: true }] },
      { id: 'cust-email', rules: [{ required: true }, { email: true }] },
      { id: 'cust-phone', rules: [{ required: true }, { phone: true }] },
      { id: 'prop-address', rules: [{ required: true }] },
      { id: 'prop-city', rules: [{ required: true }] },
      { id: 'prop-province', rules: [{ required: true }] },
      { id: 'prop-postal', rules: [{ required: true }] },
      { id: 'estimator-name', rules: [{ required: true }] },
      { id: 'estimate-date', rules: [{ required: true }] }
    ];
    return validateFields(fields);
  }

  function validateSpecsForm() {
    const fields = [
      { id: 'fence-type', rules: [{ required: true }] },
      { id: 'fence-height', rules: [{ required: true }] },
      { id: 'linear-feet', rules: [{ required: true }, { min: 1 }] }
    ];
    return validateFields(fields);
  }

  function validateFields(fieldDefs) {
    let allValid = true;
    fieldDefs.forEach(({ id, rules }) => {
      const el = document.getElementById(id);
      if (el && !validateField(el, rules)) {
        allValid = false;
      }
    });
    return allValid;
  }

  // ── Real-time validation setup ────────────────────────────────
  function attachRealtime(inputId, rules) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('blur', () => validateField(el, rules));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(el, rules);
    });
  }

  function setupProjectValidation() {
    attachRealtime('cust-email', [{ required: true }, { email: true }]);
    attachRealtime('cust-phone', [{ required: true }, { phone: true }]);
    attachRealtime('prop-postal', [{ required: true }]);
    attachRealtime('linear-feet', [{ required: true }, { min: 1 }]);
  }

  return {
    isRequired, isEmail, isPhone, isPostalCode,
    isNumber, isInteger, isDate, minLength, maxLength,
    validateField, showFieldError,
    validateProjectForm, validateSpecsForm,
    attachRealtime, setupProjectValidation
  };
})();
