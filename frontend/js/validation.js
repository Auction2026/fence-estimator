
const Validation = (() => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s().-]{7,20}$/
  };

  const isRequired = (value) => String(value ?? '').trim().length > 0;
  const isEmail = (value) => patterns.email.test(String(value || '').trim());
  const isPhone = (value) => patterns.phone.test(String(value || '').trim());
  const inRange = (value, min, max) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= min && n <= max;
  };
  const textLength = (value, min, max) => {
    const len = String(value || '').trim().length;
    return len >= min && len <= max;
  };
  const isDate = (value) => !Number.isNaN(new Date(value).getTime());

  function displayError(input, message) {
    if (!input) return;
    input.setCustomValidity(message || '');
    input.reportValidity();
  }

  function validateForm(form) {
    const invalid = [];
    if (!form) return invalid;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
      if (field.hasAttribute('required') && !isRequired(field.value)) invalid.push({ field, message: 'This field is required.' });
      if (field.type === 'email' && field.value && !isEmail(field.value)) invalid.push({ field, message: 'Enter a valid email.' });
      if (field.type === 'tel' && field.value && !isPhone(field.value)) invalid.push({ field, message: 'Enter a valid phone.' });
      if (field.type === 'date' && field.value && !isDate(field.value)) invalid.push({ field, message: 'Enter a valid date.' });
    });

    invalid.forEach((item) => displayError(item.field, item.message));
    return invalid;
  }

  return { isEmail, isPhone, isRequired, inRange, textLength, isDate, validateForm, displayError };
})();
