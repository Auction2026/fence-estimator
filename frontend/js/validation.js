// Form Validation Utilities
'use strict';

const Validation = {
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phonePattern: /^(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
  validateEmail(value) { return this.emailPattern.test(String(value || '').trim()); },
  validatePhone(value) { return this.phonePattern.test(String(value || '').trim()); },
  validateRequired(value) { return String(value || '').trim().length > 0; },
  validateNumeric(value) { return value !== '' && !Number.isNaN(Number(value)); },
  validateRange(value, min, max) { if (!this.validateNumeric(value)) return false; const numeric = Number(value); return numeric >= min && numeric <= max; },
  validateDate(value) { if (!value) return false; const parsed = new Date(value); return !Number.isNaN(parsed.getTime()); },
  validateForm(form, rules = {}) {
    if (!form) return true;
    let valid = true;
    this.clearAllErrors(form);
    Object.keys(rules).forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
      if (!field) return;
      const value = field.type === 'checkbox' ? field.checked : field.value;
      const fieldRules = Array.isArray(rules[fieldName]) ? rules[fieldName] : [rules[fieldName]];
      fieldRules.forEach((rule) => {
        if (!rule) return;
        const passes = typeof rule.test === 'function' ? rule.test(value, field) : true;
        if (!passes && valid) valid = false;
        if (!passes) this.showError(field, rule.message || 'This field is invalid.');
      });
    });
    return valid;
  },
  showError(field, message) {
    if (!field) return;
    field.classList.add('is-invalid');
    let container = field.parentElement ? field.parentElement.querySelector('.field-error') : null;
    if (!container) {
      container = document.createElement('div');
      container.className = 'field-error';
      if (field.parentElement) field.parentElement.appendChild(container);
    }
    container.textContent = message;
    container.style.color = '#C62828';
    container.style.fontSize = '0.85rem';
    container.style.marginTop = '0.35rem';
  },
  clearError(field) { if (!field) return; field.classList.remove('is-invalid'); const container = field.parentElement ? field.parentElement.querySelector('.field-error') : null; if (container) container.remove(); },
  clearAllErrors(scope = document) { scope.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid')); scope.querySelectorAll('.field-error').forEach((node) => node.remove()); }
};
window.Validation = Validation;

Validation[`ruleRequired_1`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 1 is required.'
};

Validation[`ruleRequired_2`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 2 is required.'
};

Validation[`ruleRequired_3`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 3 is required.'
};

Validation[`ruleRequired_4`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 4 is required.'
};

Validation[`ruleRequired_5`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 5 is required.'
};

Validation[`ruleRequired_6`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 6 is required.'
};

Validation[`ruleRequired_7`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 7 is required.'
};

Validation[`ruleRequired_8`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 8 is required.'
};

Validation[`ruleRequired_9`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 9 is required.'
};

Validation[`ruleRequired_10`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 10 is required.'
};

Validation[`ruleRequired_11`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 11 is required.'
};

Validation[`ruleRequired_12`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 12 is required.'
};

Validation[`ruleRequired_13`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 13 is required.'
};

Validation[`ruleRequired_14`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 14 is required.'
};

Validation[`ruleRequired_15`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 15 is required.'
};

Validation[`ruleRequired_16`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 16 is required.'
};

Validation[`ruleRequired_17`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 17 is required.'
};

Validation[`ruleRequired_18`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 18 is required.'
};

Validation[`ruleRequired_19`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 19 is required.'
};

Validation[`ruleRequired_20`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 20 is required.'
};

Validation[`ruleRequired_21`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 21 is required.'
};

Validation[`ruleRequired_22`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 22 is required.'
};

Validation[`ruleRequired_23`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 23 is required.'
};

Validation[`ruleRequired_24`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 24 is required.'
};

Validation[`ruleRequired_25`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 25 is required.'
};

Validation[`ruleRequired_26`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 26 is required.'
};

Validation[`ruleRequired_27`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 27 is required.'
};

Validation[`ruleRequired_28`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 28 is required.'
};

Validation[`ruleRequired_29`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 29 is required.'
};

Validation[`ruleRequired_30`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 30 is required.'
};

Validation[`ruleRequired_31`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 31 is required.'
};

Validation[`ruleRequired_32`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 32 is required.'
};

Validation[`ruleRequired_33`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 33 is required.'
};

Validation[`ruleRequired_34`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 34 is required.'
};

Validation[`ruleRequired_35`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 35 is required.'
};

Validation[`ruleRequired_36`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 36 is required.'
};

Validation[`ruleRequired_37`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 37 is required.'
};

Validation[`ruleRequired_38`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 38 is required.'
};

Validation[`ruleRequired_39`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 39 is required.'
};

Validation[`ruleRequired_40`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 40 is required.'
};

Validation[`ruleRequired_41`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 41 is required.'
};

Validation[`ruleRequired_42`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 42 is required.'
};

Validation[`ruleRequired_43`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 43 is required.'
};

Validation[`ruleRequired_44`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 44 is required.'
};

Validation[`ruleRequired_45`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 45 is required.'
};

Validation[`ruleRequired_46`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 46 is required.'
};

Validation[`ruleRequired_47`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 47 is required.'
};

Validation[`ruleRequired_48`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 48 is required.'
};

Validation[`ruleRequired_49`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 49 is required.'
};

Validation[`ruleRequired_50`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 50 is required.'
};

Validation[`ruleRequired_51`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 51 is required.'
};

Validation[`ruleRequired_52`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 52 is required.'
};

Validation[`ruleRequired_53`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 53 is required.'
};

Validation[`ruleRequired_54`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 54 is required.'
};

Validation[`ruleRequired_55`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 55 is required.'
};

Validation[`ruleRequired_56`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 56 is required.'
};

Validation[`ruleRequired_57`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 57 is required.'
};

Validation[`ruleRequired_58`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 58 is required.'
};

Validation[`ruleRequired_59`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 59 is required.'
};

Validation[`ruleRequired_60`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 60 is required.'
};

Validation[`ruleRequired_61`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 61 is required.'
};

Validation[`ruleRequired_62`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 62 is required.'
};

Validation[`ruleRequired_63`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 63 is required.'
};

Validation[`ruleRequired_64`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 64 is required.'
};

Validation[`ruleRequired_65`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 65 is required.'
};

Validation[`ruleRequired_66`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 66 is required.'
};

Validation[`ruleRequired_67`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 67 is required.'
};

Validation[`ruleRequired_68`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 68 is required.'
};

Validation[`ruleRequired_69`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 69 is required.'
};

Validation[`ruleRequired_70`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 70 is required.'
};

Validation[`ruleRequired_71`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 71 is required.'
};

Validation[`ruleRequired_72`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 72 is required.'
};

Validation[`ruleRequired_73`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 73 is required.'
};

Validation[`ruleRequired_74`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 74 is required.'
};

Validation[`ruleRequired_75`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 75 is required.'
};

Validation[`ruleRequired_76`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 76 is required.'
};

Validation[`ruleRequired_77`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 77 is required.'
};

Validation[`ruleRequired_78`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 78 is required.'
};

Validation[`ruleRequired_79`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 79 is required.'
};

Validation[`ruleRequired_80`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 80 is required.'
};

Validation[`ruleRequired_81`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 81 is required.'
};

Validation[`ruleRequired_82`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 82 is required.'
};

Validation[`ruleRequired_83`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 83 is required.'
};

Validation[`ruleRequired_84`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 84 is required.'
};

Validation[`ruleRequired_85`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 85 is required.'
};

Validation[`ruleRequired_86`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 86 is required.'
};

Validation[`ruleRequired_87`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 87 is required.'
};

Validation[`ruleRequired_88`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 88 is required.'
};

Validation[`ruleRequired_89`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 89 is required.'
};

Validation[`ruleRequired_90`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 90 is required.'
};

Validation[`ruleRequired_91`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 91 is required.'
};

Validation[`ruleRequired_92`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 92 is required.'
};

Validation[`ruleRequired_93`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 93 is required.'
};

Validation[`ruleRequired_94`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 94 is required.'
};

Validation[`ruleRequired_95`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 95 is required.'
};

Validation[`ruleRequired_96`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 96 is required.'
};

Validation[`ruleRequired_97`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 97 is required.'
};

Validation[`ruleRequired_98`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 98 is required.'
};

Validation[`ruleRequired_99`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 99 is required.'
};

Validation[`ruleRequired_100`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 100 is required.'
};

Validation[`ruleRequired_101`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 101 is required.'
};

Validation[`ruleRequired_102`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 102 is required.'
};

Validation[`ruleRequired_103`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 103 is required.'
};

Validation[`ruleRequired_104`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 104 is required.'
};

Validation[`ruleRequired_105`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 105 is required.'
};

Validation[`ruleRequired_106`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 106 is required.'
};

Validation[`ruleRequired_107`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 107 is required.'
};

Validation[`ruleRequired_108`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 108 is required.'
};

Validation[`ruleRequired_109`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 109 is required.'
};

Validation[`ruleRequired_110`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 110 is required.'
};

Validation[`ruleRequired_111`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 111 is required.'
};

Validation[`ruleRequired_112`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 112 is required.'
};

Validation[`ruleRequired_113`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 113 is required.'
};

Validation[`ruleRequired_114`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 114 is required.'
};

Validation[`ruleRequired_115`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 115 is required.'
};

Validation[`ruleRequired_116`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 116 is required.'
};

Validation[`ruleRequired_117`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 117 is required.'
};

Validation[`ruleRequired_118`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 118 is required.'
};

Validation[`ruleRequired_119`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 119 is required.'
};

Validation[`ruleRequired_120`] = {
  test(value) { return Validation.validateRequired(value); },
  message: 'Field 120 is required.'
};

Validation[`makeNumericRule_1`] = function makeNumericRule_1(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_2`] = function makeNumericRule_2(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_3`] = function makeNumericRule_3(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_4`] = function makeNumericRule_4(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_5`] = function makeNumericRule_5(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_6`] = function makeNumericRule_6(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_7`] = function makeNumericRule_7(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_8`] = function makeNumericRule_8(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_9`] = function makeNumericRule_9(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_10`] = function makeNumericRule_10(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_11`] = function makeNumericRule_11(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_12`] = function makeNumericRule_12(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_13`] = function makeNumericRule_13(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_14`] = function makeNumericRule_14(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_15`] = function makeNumericRule_15(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_16`] = function makeNumericRule_16(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_17`] = function makeNumericRule_17(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_18`] = function makeNumericRule_18(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_19`] = function makeNumericRule_19(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_20`] = function makeNumericRule_20(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_21`] = function makeNumericRule_21(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_22`] = function makeNumericRule_22(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_23`] = function makeNumericRule_23(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_24`] = function makeNumericRule_24(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_25`] = function makeNumericRule_25(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_26`] = function makeNumericRule_26(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_27`] = function makeNumericRule_27(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_28`] = function makeNumericRule_28(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_29`] = function makeNumericRule_29(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_30`] = function makeNumericRule_30(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_31`] = function makeNumericRule_31(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_32`] = function makeNumericRule_32(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_33`] = function makeNumericRule_33(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_34`] = function makeNumericRule_34(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_35`] = function makeNumericRule_35(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_36`] = function makeNumericRule_36(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_37`] = function makeNumericRule_37(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_38`] = function makeNumericRule_38(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_39`] = function makeNumericRule_39(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_40`] = function makeNumericRule_40(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_41`] = function makeNumericRule_41(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_42`] = function makeNumericRule_42(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_43`] = function makeNumericRule_43(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_44`] = function makeNumericRule_44(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_45`] = function makeNumericRule_45(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_46`] = function makeNumericRule_46(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_47`] = function makeNumericRule_47(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_48`] = function makeNumericRule_48(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_49`] = function makeNumericRule_49(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};

Validation[`makeNumericRule_50`] = function makeNumericRule_50(min, max) {
  return {
    test(value) { return Validation.validateNumeric(value) && Validation.validateRange(value, min ?? 0, max ?? 1000000); },
    message: 'Enter a number between the permitted limits.'
  };
};
