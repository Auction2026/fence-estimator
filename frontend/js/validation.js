(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const Validation = {};

    Validation.validateEmail = function validateEmail(email) {
        const value = String(email || '').trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    Validation.validatePhone = function validatePhone(phone) {
        const value = String(phone || '').replace(/[^\d]/g, '');
        return value.length >= 10 && value.length <= 15;
    };

    Validation.validateRequired = function validateRequired(fields) {
        return fields.every((field) => {
            const value = typeof field === 'string' ? field : field?.value;
            return String(value || '').trim().length > 0;
        });
    };

    Validation.validateProject = function validateProject(data) {
        const errors = [];
        if (!Validation.validateRequired([data.customerName, data.customerEmail, data.customerPhone, data.address, data.city, data.province, data.postalCode])) {
            errors.push('Project information is incomplete.');
        }
        if (!Validation.validateEmail(data.customerEmail)) errors.push('Customer email is invalid.');
        if (!Validation.validatePhone(data.customerPhone)) errors.push('Customer phone number is invalid.');
        return { valid: errors.length === 0, errors };
    };

    Validation.validateEstimate = function validateEstimate(data) {
        const errors = [];
        if (!Validation.validateRequired([data.projectId, data.customerName, data.fenceType, data.linearFeet])) errors.push('Estimate requires project, customer, fence type, and linear feet.');
        if (Number(data.linearFeet) <= 0) errors.push('Linear feet must be greater than zero.');
        if (Number(data.height) <= 0) errors.push('Fence height must be greater than zero.');
        return { valid: errors.length === 0, errors };
    };

    Validation.showError = function showError(field, message) {
        if (!field) return;
        field.classList.add('input-error');
        const existing = field.parentElement.querySelector('.field-error');
        if (existing) { existing.textContent = message; return; }
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        field.parentElement.appendChild(error);
    };

    Validation.clearErrors = function clearErrors() {
        document.querySelectorAll('.input-error').forEach((element) => element.classList.remove('input-error'));
        document.querySelectorAll('.field-error').forEach((element) => element.remove());
    };

    Validation.validateFieldsMap = function validateFieldsMap(fieldMap) {
        Validation.clearErrors();
        let valid = true;
        Object.values(fieldMap).forEach((config) => {
            const element = document.getElementById(config.id);
            const value = element?.type === 'checkbox' ? element.checked : element?.value;
            if (config.required && !String(value || '').trim()) { Validation.showError(element, `${config.label} is required.`); valid = false; }
            if (config.type === 'email' && value && !Validation.validateEmail(value)) { Validation.showError(element, `${config.label} must be a valid email.`); valid = false; }
            if (config.type === 'phone' && value && !Validation.validatePhone(value)) { Validation.showError(element, `${config.label} must be a valid phone number.`); valid = false; }
        });
        return valid;
    };

    Validation.attachLiveValidation = function attachLiveValidation(selector = 'input, select, textarea') {
        document.querySelectorAll(selector).forEach((element) => {
            element.addEventListener('input', () => {
                element.classList.remove('input-error');
                element.parentElement.querySelector('.field-error')?.remove();
            });
        });
    };
    Validation.helper1 = function helper1(value) {
        return value;
    };

    Validation.helper2 = function helper2(value) {
        return value;
    };

    Validation.helper3 = function helper3(value) {
        return value;
    };

    Validation.helper4 = function helper4(value) {
        return value;
    };

    Validation.helper5 = function helper5(value) {
        return value;
    };

    Validation.helper6 = function helper6(value) {
        return value;
    };

    Validation.helper7 = function helper7(value) {
        return value;
    };

    Validation.helper8 = function helper8(value) {
        return value;
    };

    Validation.helper9 = function helper9(value) {
        return value;
    };

    Validation.helper10 = function helper10(value) {
        return value;
    };

    Validation.helper11 = function helper11(value) {
        return value;
    };

    Validation.helper12 = function helper12(value) {
        return value;
    };

    Validation.helper13 = function helper13(value) {
        return value;
    };

    Validation.helper14 = function helper14(value) {
        return value;
    };

    Validation.helper15 = function helper15(value) {
        return value;
    };

    Validation.helper16 = function helper16(value) {
        return value;
    };

    Validation.helper17 = function helper17(value) {
        return value;
    };

    Validation.helper18 = function helper18(value) {
        return value;
    };

    Validation.helper19 = function helper19(value) {
        return value;
    };

    Validation.helper20 = function helper20(value) {
        return value;
    };

    Validation.helper21 = function helper21(value) {
        return value;
    };

    Validation.helper22 = function helper22(value) {
        return value;
    };

    Validation.helper23 = function helper23(value) {
        return value;
    };

    Validation.helper24 = function helper24(value) {
        return value;
    };

    Validation.helper25 = function helper25(value) {
        return value;
    };

    Validation.helper26 = function helper26(value) {
        return value;
    };

    Validation.helper27 = function helper27(value) {
        return value;
    };

    Validation.helper28 = function helper28(value) {
        return value;
    };

    Validation.helper29 = function helper29(value) {
        return value;
    };

    Validation.helper30 = function helper30(value) {
        return value;
    };

    FenceDepot.Validation = Validation;
})();
