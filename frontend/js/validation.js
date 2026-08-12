/**
 * @module validation
 * @description Validation utilities for fence estimator forms and field-level error presentation.
 */
(function validationModule(global) {
    'use strict';

    // Validation constants and helper messages
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var PHONE_PATTERN = /^(?:\+1\s?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    var ZIP_PATTERN = /^(?:\d{5})(?:-\d{4})?$/;
    var MAX_TEXT_LENGTH = 255;
    var DEFAULT_ERROR_CLASS = "field-error";
    var FIELD_LABELS = {
        firstName: "firstName",
        lastName: "lastName",
        company: "company",
        email: "email",
        phone: "phone",
        address1: "address1",
        city: "city",
        state: "state",
        zip: "zip",
        fenceType: "fenceType",
        height: "height",
        linearFeet: "linearFeet",
        gateWidth: "gateWidth",
        deposit: "deposit",
        projectName: "projectName",
        projectNumber: "projectNumber",
        paymentMethod: "paymentMethod",
    };
    function toText(value) {
        return value === null || typeof value === 'undefined' ? '' : String(value).trim();
    }

    function toNumber(value) {
        var parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    function createResult() {
        return {
            valid: true,
            errors: {},
            messages: []
        };
    }

    function addError(result, field, message) {
        result.valid = false;
        if (!result.errors[field]) {
            result.errors[field] = [];
        }
        result.errors[field].push(message);
        result.messages.push(message);
        return result;
    }

    function mergeResults(target, source) {
        var output = target || createResult();
        var incoming = source || createResult();
        if (!incoming.valid) {
            output.valid = false;
        }
        Object.keys(incoming.errors || {}).forEach(function eachKey(key) {
            if (!output.errors[key]) {
                output.errors[key] = [];
            }
            output.errors[key] = output.errors[key].concat(incoming.errors[key]);
        });
        output.messages = output.messages.concat(incoming.messages || []);
        return output;
    }

    function getElement(fieldOrElement) {
        if (!fieldOrElement) {
            return null;
        }
        if (fieldOrElement.nodeType === 1) {
            return fieldOrElement;
        }
        return global.document ? global.document.getElementById(fieldOrElement) || global.document.querySelector('[name="' + fieldOrElement + '"]') : null;
    }

    function getFieldLabel(fieldName) {
        return FIELD_LABELS[fieldName] || fieldName;
    }

    function validateRequired(value, fieldName, result) {
        var output = result || createResult();
        if (!toText(value)) {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' is required.');
        }
        return output;
    }

    function validateEmail(value, fieldName, result) {
        var output = result || createResult();
        var text = toText(value).toLowerCase();
        if (text && !EMAIL_PATTERN.test(text)) {
            addError(output, fieldName || 'email', 'Enter a valid email address.');
        }
        return output;
    }

    function validatePhone(value, fieldName, result) {
        var output = result || createResult();
        var text = toText(value);
        if (text && !PHONE_PATTERN.test(text)) {
            addError(output, fieldName || 'phone', 'Enter a valid phone number.');
        }
        return output;
    }

    function validateZip(value, fieldName, result) {
        var output = result || createResult();
        var text = toText(value);
        if (text && !ZIP_PATTERN.test(text)) {
            addError(output, fieldName || 'zip', 'Enter a valid ZIP code.');
        }
        return output;
    }

    function validateNumber(value, fieldName, options, result) {
        var output = result || createResult();
        var numeric = toNumber(value);
        if (Number.isNaN(numeric)) {
            addError(output, fieldName || 'number', getFieldLabel(fieldName || 'number') + ' must be a number.');
            return output;
        }
        if (options && options.integer && numeric % 1 !== 0) {
            addError(output, fieldName || 'number', getFieldLabel(fieldName || 'number') + ' must be a whole number.');
        }
        return output;
    }

    function validateRange(value, fieldName, min, max, result) {
        var output = result || createResult();
        var numeric = toNumber(value);
        if (Number.isNaN(numeric)) {
            addError(output, fieldName || 'number', getFieldLabel(fieldName || 'number') + ' must be a number.');
            return output;
        }
        if (typeof min === 'number' && numeric < min) {
            addError(output, fieldName || 'number', getFieldLabel(fieldName || 'number') + ' must be at least ' + min + '.');
        }
        if (typeof max === 'number' && numeric > max) {
            addError(output, fieldName || 'number', getFieldLabel(fieldName || 'number') + ' must be no more than ' + max + '.');
        }
        return output;
    }

    function validateMaxLength(value, fieldName, maxLength, result) {
        var output = result || createResult();
        var text = toText(value);
        if (text.length > (maxLength || MAX_TEXT_LENGTH)) {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' is too long.');
        }
        return output;
    }

    function clearError(fieldOrElement) {
        var element = getElement(fieldOrElement);
        if (!element) {
            return;
        }
        element.classList.remove(DEFAULT_ERROR_CLASS);
        element.removeAttribute('aria-invalid');
        var describedBy = element.getAttribute('aria-describedby');
        if (describedBy) {
            describedBy.split(/\s+/).forEach(function eachId(id) {
                var node = global.document.getElementById(id);
                if (node && node.getAttribute('data-validation-message') === 'true') {
                    node.remove();
                }
            });
            element.removeAttribute('aria-describedby');
        }
    }

    function showError(fieldOrElement, message) {
        var element = getElement(fieldOrElement);
        if (!element || !global.document) {
            return;
        }
        clearError(element);
        element.classList.add(DEFAULT_ERROR_CLASS);
        element.setAttribute('aria-invalid', 'true');
        var messageNode = global.document.createElement('div');
        messageNode.className = 'validation-message';
        messageNode.setAttribute('data-validation-message', 'true');
        messageNode.id = (element.id || element.name || 'field') + '-error';
        messageNode.textContent = message;
        if (element.parentNode) {
            element.parentNode.appendChild(messageNode);
        }
        element.setAttribute('aria-describedby', messageNode.id);
    }

    function applyErrors(result) {
        Object.keys(result.errors || {}).forEach(function eachField(fieldName) {
            var errors = result.errors[fieldName];
            if (errors && errors.length) {
                showError(fieldName, errors[0]);
            }
        });
        return result;
    }
    // Domain-specific validators
    function validateCustomer(customer) {
        var data = customer || {};
        var result = createResult();
        validateRequired(data.firstName, 'firstName', result);
        validateRequired(data.lastName, 'lastName', result);
        validateRequired(data.email, 'email', result);
        validateRequired(data.phone, 'phone', result);
        validateEmail(data.email, 'email', result);
        validatePhone(data.phone, 'phone', result);
        validateMaxLength(data.company, 'company', 120, result);
        validateMaxLength(data.address1, 'address1', 180, result);
        validateRequired(data.city, 'city', result);
        validateRequired(data.state, 'state', result);
        validateRequired(data.zip, 'zip', result);
        validateZip(data.zip, 'zip', result);
        return result;
    }

    function validateProject(project) {
        var data = project || {};
        var result = createResult();
        validateRequired(data.projectName, 'projectName', result);
        validateMaxLength(data.projectName, 'projectName', 140, result);
        validateMaxLength(data.projectNumber, 'projectNumber', 40, result);
        if (data.startDate && Number.isNaN(Date.parse(data.startDate))) {
            addError(result, 'startDate', 'Project start date is invalid.');
        }
        if (data.endDate && Number.isNaN(Date.parse(data.endDate))) {
            addError(result, 'endDate', 'Project end date is invalid.');
        }
        if (data.startDate && data.endDate && Date.parse(data.endDate) < Date.parse(data.startDate)) {
            addError(result, 'endDate', 'Project end date must be after the start date.');
        }
        validateRequired(data.address1, 'address1', result);
        validateRequired(data.city, 'city', result);
        validateRequired(data.state, 'state', result);
        validateRequired(data.zip, 'zip', result);
        validateZip(data.zip, 'zip', result);
        return result;
    }

    function validateFence(fence) {
        var data = fence || {};
        var result = createResult();
        var validTypes = ['chain-link', 'wood', 'vinyl', 'aluminum', 'wrought-iron'];
        validateRequired(data.fenceType, 'fenceType', result);
        validateRequired(data.height, 'height', result);
        validateRequired(data.linearFeet, 'linearFeet', result);
        validateNumber(data.height, 'height', { integer: false }, result);
        validateRange(data.height, 'height', 3, 12, result);
        validateNumber(data.linearFeet, 'linearFeet', { integer: false }, result);
        validateRange(data.linearFeet, 'linearFeet', 1, 100000, result);
        if (data.fenceType && validTypes.indexOf(String(data.fenceType).toLowerCase()) === -1) {
            addError(result, 'fenceType', 'Fence type is not supported.');
        }
        if (data.postSpacing) {
            validateRange(data.postSpacing, 'postSpacing', 4, 12, result);
        }
        if (data.picketGapInches) {
            validateRange(data.picketGapInches, 'picketGapInches', 0, 2, result);
        }
        return result;
    }

    function validateGate(gate) {
        var data = gate || {};
        var result = createResult();
        validateRequired(data.type, 'gateType', result);
        validateRequired(data.width, 'gateWidth', result);
        validateNumber(data.width, 'gateWidth', { integer: false }, result);
        validateRange(data.width, 'gateWidth', 3, 24, result);
        if (data.height) {
            validateRange(data.height, 'gateHeight', 3, 12, result);
        }
        if (data.quantity) {
            validateRange(data.quantity, 'gateQuantity', 1, 20, result);
        }
        return result;
    }

    function validatePayment(payment) {
        var data = payment || {};
        var result = createResult();
        if (data.deposit !== '' && data.deposit !== null && typeof data.deposit !== 'undefined') {
            validateNumber(data.deposit, 'deposit', { integer: false }, result);
            validateRange(data.deposit, 'deposit', 0, 10000000, result);
        }
        if (data.total !== '' && data.total !== null && typeof data.total !== 'undefined') {
            validateNumber(data.total, 'total', { integer: false }, result);
            validateRange(data.total, 'total', 0, 10000000, result);
        }
        validateRequired(data.paymentMethod, 'paymentMethod', result);
        if (data.deposit && data.total && toNumber(data.deposit) > toNumber(data.total)) {
            addError(result, 'deposit', 'Deposit cannot exceed total amount.');
        }
        return result;
    }

    function clearAllErrors(scope) {
        var root = scope && scope.nodeType === 1 ? scope : global.document;
        if (!root || !root.querySelectorAll) {
            return;
        }
        root.querySelectorAll("." + DEFAULT_ERROR_CLASS).forEach(function eachNode(node) {
            clearError(node);
        });
    }

    function validateAll(payload) {
        var data = payload || {};
        var result = createResult();
        clearAllErrors(data.scope);
        mergeResults(result, validateCustomer(data.customer));
        mergeResults(result, validateProject(data.project));
        mergeResults(result, validateFence(data.fence));
        (Array.isArray(data.gates) ? data.gates : []).forEach(function eachGate(gate, index) {
            var gateResult = validateGate(gate);
            if (!gateResult.valid) {
                Object.keys(gateResult.errors).forEach(function eachField(fieldName) {
                    result.errors["gate-" + index + "-" + fieldName] = gateResult.errors[fieldName];
                });
                result.valid = false;
                result.messages = result.messages.concat(gateResult.messages);
            }
        });
        mergeResults(result, validatePayment(data.payment));
        applyErrors(result);
        return result;
    }

    function validateAddressBlock(data) {
        var source = data || {};
        var result = createResult();
        validateRequired(source.address1, "address1", result);
        validateRequired(source.city, "city", result);
        validateRequired(source.state, "state", result);
        validateRequired(source.zip, "zip", result);
        validateZip(source.zip, "zip", result);
        return result;
    }

    function validateContactBlock(data) {
        var source = data || {};
        var result = createResult();
        validateRequired(source.firstName, "firstName", result);
        validateRequired(source.lastName, "lastName", result);
        validateRequired(source.email, "email", result);
        validateEmail(source.email, "email", result);
        validateRequired(source.phone, "phone", result);
        validatePhone(source.phone, "phone", result);
        return result;
    }

    function validateProjectMetadata(data) {
        var source = data || {};
        var result = createResult();
        validateRequired(source.projectName, "projectName", result);
        validateRequired(source.projectNumber, "projectNumber", result);
        return result;
    }



    // Supplemental field and form utilities
    function validateSelect(value, fieldName, allowedValues, result) {
        var output = result || createResult();
        var text = toText(value);
        if (!text) {
            return output;
        }
        if (Array.isArray(allowedValues) && allowedValues.indexOf(text) === -1) {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' contains an invalid selection.');
        }
        return output;
    }

    function validateLengthRange(value, fieldName, minLength, maxLength, result) {
        var output = result || createResult();
        var text = toText(value);
        if (typeof minLength === 'number' && text.length < minLength) {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' is too short.');
        }
        if (typeof maxLength === 'number' && text.length > maxLength) {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' is too long.');
        }
        return output;
    }

    function validateFutureDate(value, fieldName, result) {
        var output = result || createResult();
        if (!toText(value)) {
            return output;
        }
        var parsed = Date.parse(value);
        if (Number.isNaN(parsed)) {
            addError(output, fieldName || 'date', getFieldLabel(fieldName || 'date') + ' is not a valid date.');
            return output;
        }
        if (parsed < Date.now() - (24 * 60 * 60 * 1000)) {
            addError(output, fieldName || 'date', getFieldLabel(fieldName || 'date') + ' must be today or later.');
        }
        return output;
    }

    function validateBoolean(value, fieldName, required, result) {
        var output = result || createResult();
        if (required && typeof value !== 'boolean') {
            addError(output, fieldName || 'field', getFieldLabel(fieldName || 'field') + ' must be true or false.');
        }
        return output;
    }

    function validateMoney(value, fieldName, result) {
        var output = result || createResult();
        if (toText(value) === '') {
            return output;
        }
        validateNumber(value, fieldName, { integer: false }, output);
        validateRange(value, fieldName, 0, 100000000, output);
        return output;
    }

    function validateArrayOfGates(gates) {
        var result = createResult();
        (Array.isArray(gates) ? gates : []).forEach(function eachGate(gate, index) {
            var gateResult = validateGate(gate);
            if (!gateResult.valid) {
                Object.keys(gateResult.errors).forEach(function eachField(fieldName) {
                    result.errors['gates[' + index + '].' + fieldName] = gateResult.errors[fieldName];
                });
                result.valid = false;
                result.messages = result.messages.concat(gateResult.messages);
            }
        });
        return result;
    }

    function focusFirstError(result) {
        var firstField = Object.keys(result && result.errors ? result.errors : {})[0];
        if (!firstField) {
            return null;
        }
        var element = getElement(firstField);
        if (element && typeof element.focus === 'function') {
            element.focus();
        }
        return element || null;
    }

    function normalizeFormData(form) {
        if (!form || !form.elements) {
            return {};
        }
        return Array.prototype.slice.call(form.elements).reduce(function reducer(output, element) {
            if (!element.name) {
                return output;
            }
            if (element.type === 'checkbox') {
                output[element.name] = Boolean(element.checked);
            } else if (element.type === 'radio') {
                if (element.checked) {
                    output[element.name] = element.value;
                }
            } else {
                output[element.name] = element.value;
            }
            return output;
        }, {});
    }

    function validateEstimateNotes(notes) {
        var result = createResult();
        validateLengthRange(notes, 'notes', 0, 2000, result);
        return result;
    }

    function validateDiscount(value) {
        var result = createResult();
        if (toText(value) === '') {
            return result;
        }
        validateNumber(value, 'discount', { integer: false }, result);
        validateRange(value, 'discount', 0, 100, result);
        return result;
    }

    function validateTermsAccepted(value) {
        var result = createResult();
        validateBoolean(value, 'termsAccepted', true, result);
        if (value !== true) {
            addError(result, 'termsAccepted', 'Terms and conditions must be accepted.');
        }
        return result;
    }

    function validateSchedule(data) {
        var source = data || {};
        var result = createResult();
        validateFutureDate(source.installationDate, 'installationDate', result);
        validateFutureDate(source.expirationDate, 'expirationDate', result);
        if (source.installationDate && source.expirationDate && Date.parse(source.expirationDate) < Date.parse(source.installationDate)) {
            addError(result, 'expirationDate', 'Expiration date must be on or after the installation date.');
        }
        return result;
    }

    function validateReference(reference) {
        var result = createResult();
        validateLengthRange(reference, 'reference', 0, 60, result);
        return result;
    }

    var exported = {
        validateCustomer: validateCustomer,
        validateProject: validateProject,
        validateFence: validateFence,
        validateGate: validateGate,
        validatePayment: validatePayment,
        validateEmail: validateEmail,
        validatePhone: validatePhone,
        validateZip: validateZip,
        validateRequired: validateRequired,
        validateNumber: validateNumber,
        validateRange: validateRange,
        showError: showError,
        clearError: clearError,
        validateAll: validateAll,
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }

    global.FenceEstimatorValidation = exported;
}(typeof window !== "undefined" ? window : globalThis));
