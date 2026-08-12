(function (global) {
'use strict';
/**
 * Extras tab helpers for permits, demolition, concrete, barbed wire, privacy slats, line items, discount codes, and totals.
 * @module tab08Extras
 */
const STORAGE_KEY = 'fence-estimator.tab08.extras';
const DEFAULT_SELECTORS = {
    root: '[data-tab="extras"], #tab-extras, #tab08-extras',
    form: 'form',
    saveButton: '[data-action="save-extras"], .js-save-extras, button[type="submit"]',
    status: '[data-role="extras-status"], .js-extras-status, .form-status'
};
const DEFAULT_STATE = {
    permits: false,
    demolition: false,
    concrete: false,
    barbedWire: false,
    privacySlats: false,
    customItemName: "",
    customItemPrice: 0,
    discountCode: "",
    extrasTotal: 0
};
const FIELDS = [
    { key: 'permits', selector: '[name="permits"], #permits', defaultValue: false },
    { key: 'demolition', selector: '[name="demolition"], #demolition', defaultValue: false },
    { key: 'concrete', selector: '[name="concrete"], #concrete', defaultValue: false },
    { key: 'barbedWire', selector: '[name="barbedWire"], #barbedWire', defaultValue: false },
    { key: 'privacySlats', selector: '[name="privacySlats"], #privacySlats', defaultValue: false },
    { key: 'customItemName', selector: '[name="customItemName"], #customItemName', defaultValue: "" },
    { key: 'customItemPrice', selector: '[name="customItemPrice"], #customItemPrice', defaultValue: 0 },
    { key: 'discountCode', selector: '[name="discountCode"], #discountCode', defaultValue: "" }
];
function parseStoredValue() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('extras storage parse failed.', error); return {}; }
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

    data.extrasTotal = calculateExtrasTotal(data);

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

    state.extrasTotal = calculateExtrasTotal(state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab08Extras-changed', state);
}
function validate(state, options) {
    if (typeof options.validate === 'function') { return options.validate(state); }

    if (String(state.customItemName || '').trim() && asNumber(state.customItemPrice, 0) <= 0) {
        return { valid: false, message: 'Custom line items need a price.' };
    }

    return { valid: true, message: '' };
}
function render(root, elements, state) {
    updateStatus(elements, '', false);

    const total = query(root, '[data-role="extras-total"], .js-extras-total');
    if (total) { total.textContent = asCurrency(state.extrasTotal); }

}
/**
 * Initialize the extras tab.
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object, refresh: function(): Object}}
 */
function initTab08Extras(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);
    if (!root) {
        console.warn('extras root not found.');
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
            emit('fence-estimator:tab08Extras-invalid', state);
            return false;
        }

        state.extrasTotal = calculateExtrasTotal(state);
        global.localStorage.setItem('fence-estimator.activeExtras', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Extras saved.', false);
        emit('fence-estimator:tab08Extras-saved', state);
        return true;
    }
    hydrate(root, initialState);
    bindEvents(root, elements, save);
    render(root, elements, initialState);

    return {
        save: save,
        load: refresh,
        refresh: refresh,
        getState: function () { return collectState(root); }
    };
}

const EXTRA_COSTS = { permits: 275, demolition: 650, concrete: 425, barbedWire: 320, privacySlats: 540 };
const DISCOUNT_CODES = { SAVE5: 0.05, SAVE10: 0.10, COMMERCIAL15: 0.15 };
function calculateExtrasTotal(state) {
    const base = Object.keys(EXTRA_COSTS).reduce(function (total, key) { return total + (state[key] ? EXTRA_COSTS[key] : 0); }, 0)
        + (String(state.customItemName || '').trim() ? asNumber(state.customItemPrice, 0) : 0);
    const discount = DISCOUNT_CODES[String(state.discountCode || '').trim().toUpperCase()] || 0;
    return Math.max(0, base - (base * discount));
}

const api = { init: initTab08Extras, initTab08Extras: initTab08Extras };
global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab08Extras = api;
if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);

