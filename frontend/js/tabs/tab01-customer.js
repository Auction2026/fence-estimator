(function (global) {
'use strict';
/**
 * Customer information tab helpers for contact capture, validation calls, light auto-fill, and customer saves.
 * @module tab01Customer
 */
const STORAGE_KEY = 'fence-estimator.tab01.customer';
const DEFAULT_SELECTORS = {
    root: '[data-tab="customer"], #tab-customer, #tab01-customer',
    form: 'form',
    saveButton: '[data-action="save-customer"], .js-save-customer, button[type="submit"]',
    status: '[data-role="customer-status"], .js-customer-status, .form-status'
};
const DEFAULT_STATE = {
    name: "",
    address: "",
    phone: "",
    email: "",
    company: ""
};
const FIELDS = [
    { key: 'name', selector: '[name="customerName"], #customerName', defaultValue: "" },
    { key: 'address', selector: '[name="customerAddress"], #customerAddress', defaultValue: "" },
    { key: 'phone', selector: '[name="customerPhone"], #customerPhone', defaultValue: "" },
    { key: 'email', selector: '[name="customerEmail"], #customerEmail', defaultValue: "" },
    { key: 'company', selector: '[name="customerCompany"], #customerCompany', defaultValue: "" }
];
function parseStoredValue() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('customer storage parse failed.', error); return {}; }
}
function query(root, selector) { return selector ? root.querySelector(selector) : null; }
function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail })); }
function asNumber(value, fallback) { const numeric = Number(value); return Number.isFinite(numeric) ? numeric : fallback; }
function asCurrency(value) { return '$' + asNumber(value, 0).toFixed(2); }
function updateStatus(elements, message, isError) {
    if (!elements.status) { return; }
    elements.status.textContent = message || '';
    elements.status.dataset.state = isError ? 'error' : 'ready';
}
function readField(root, field) {
    const element = query(root, field.selector);
    if (!element) { return field.defaultValue; }
    if (element.type === 'checkbox') { return Boolean(element.checked); }
    if (element.tagName === 'SELECT' && element.multiple) {
        return Array.from(element.selectedOptions).map(function (option) { return option.value; });
    }
    return element.value;
}
function writeField(root, field, value) {
    const element = query(root, field.selector);
    if (!element) { return; }
    if (element.type === 'checkbox') { element.checked = Boolean(value); return; }
    if (element.tagName === 'SELECT' && element.multiple && Array.isArray(value)) {
        Array.from(element.options).forEach(function (option) { option.selected = value.indexOf(option.value) >= 0; });
        return;
    }
    element.value = value == null ? '' : value;
}
function collectState(root) {
    const data = Object.assign({}, DEFAULT_STATE);
    FIELDS.forEach(function (field) { data[field.key] = readField(root, field); });

    return data;
}
function hydrate(root, state) {
    FIELDS.forEach(function (field) { writeField(root, field, state[field.key]); });

}
function persist(state) { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function bindEvents(root, elements, save) {
    if (elements.form) {
        elements.form.addEventListener('input', function (event) { handleInput(root, elements, event); });
        elements.form.addEventListener('change', function (event) { handleInput(root, elements, event); });
        elements.form.addEventListener('submit', function (event) { event.preventDefault(); save(); });
    }
    if (elements.saveButton) { elements.saveButton.addEventListener('click', save); }

}
function handleInput(root, elements, event) {
    const target = event && event.target ? event.target : null;
    const state = collectState(root);

    if (target && (target.id === 'customerPhone' || target.name === 'customerPhone')) {
        state.phone = formatPhone(state.phone);
        writeField(root, FIELDS[2], state.phone);
    }
    if (target && (target.id === 'customerEmail' || target.name === 'customerEmail')) {
        state.email = String(state.email || '').trim().toLowerCase();
        writeField(root, FIELDS[3], state.email);
        state.company = inferCompanyName(state.company, state.email);
        writeField(root, FIELDS[4], state.company);
    }

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab01Customer-changed', state);
}
function validate(state, options) {
    if (typeof options.validate === 'function') { return options.validate(state); }

    if (!String(state.name || '').trim()) { return { valid: false, message: 'Customer name is required.' }; }
    if (String(state.email || '').trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        return { valid: false, message: 'Enter a valid email address.' };
    }
    if (String(state.phone || '').replace(/\D/g, '').length < 10) {
        return { valid: false, message: 'Enter a 10-digit phone number.' };
    }

    return { valid: true, message: '' };
}
function render(root, elements, state) {
    updateStatus(elements, '', false);

}
/**
 * Initialize the customer tab.
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object, refresh: function(): Object}}
 */
function initTab01Customer(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);
    if (!root) {
        console.warn('customer root not found.');
        return { save: function () { return false; }, load: function () { return {}; }, getState: function () { return {}; }, refresh: function () { return {}; } };
    }
    const elements = {
        form: query(root, DEFAULT_SELECTORS.form),
        saveButton: query(root, DEFAULT_SELECTORS.saveButton),
        status: query(root, DEFAULT_SELECTORS.status)
    };
    const initialState = Object.assign({}, DEFAULT_STATE, parseStoredValue());
    function refresh() {
        const state = Object.assign({}, DEFAULT_STATE, parseStoredValue());
        hydrate(root, state);
        render(root, elements, state);
        return state;
    }
    function save() {
        const state = collectState(root);
        const result = validate(state, settings) || { valid: true, message: '' };
        if (!result.valid) {
            updateStatus(elements, result.message || 'Please review the highlighted fields.', true);
            emit('fence-estimator:tab01Customer-invalid', state);
            return false;
        }

        state.name = toTitleCase(state.name);
        state.address = String(state.address || '').trim();
        state.phone = formatPhone(state.phone);
        state.email = String(state.email || '').trim().toLowerCase();
        state.company = inferCompanyName(state.company, state.email);
        hydrate(root, state);
        global.localStorage.setItem('fence-estimator.activeCustomer', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Customer details saved.', false);
        emit('fence-estimator:tab01Customer-saved', state);
        return true;
    }
    hydrate(root, initialState);
    bindEvents(root, elements, save);
    render(root, elements, initialState);

    applySavedCustomer(root, initialState);

    return {
        save: save,
        load: refresh,
        refresh: refresh,
        getState: function () { return collectState(root); }
    };
}

function toTitleCase(value) {
    return String(value || '').trim().replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}
function formatPhone(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) { return digits; }
    if (digits.length < 7) { return '(' + digits.slice(0, 3) + ') ' + digits.slice(3); }
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
}
function inferCompanyName(company, email) {
    if (String(company || '').trim()) { return String(company).trim(); }
    const domain = String(email || '').split('@')[1] || '';
    return domain ? toTitleCase(domain.split('.')[0].replace(/[-_]+/g, ' ')) : '';
}
function applySavedCustomer(root, state) {
    const active = parseStoredValue();
    hydrate(root, Object.assign({}, state, active));
}

const api = { init: initTab01Customer, initTab01Customer: initTab01Customer };
global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab01Customer = api;
if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);

