(function (global) {
'use strict';
/**
 * Materials list tab helpers for auto-populated posts, rails, mesh or pickets, hardware, gates, and total pricing.
 * @module tab05Materials
 */
const STORAGE_KEY = 'fence-estimator.tab05.materials';
const DEFAULT_SELECTORS = {
    root: '[data-tab="materials"], #tab-materials, #tab05-materials',
    form: 'form',
    saveButton: '[data-action="save-materials"], .js-save-materials, button[type="submit"]',
    status: '[data-role="materials-status"], .js-materials-status, .form-status'
};
const DEFAULT_STATE = {
    postsQty: 0,
    railsQty: 0,
    meshQty: 0,
    hardwareQty: 0,
    gatesQty: 0,
    materialsTotal: 0
};
const FIELDS = [
    { key: 'postsQty', selector: '[name="postsQty"], #postsQty', defaultValue: 0 },
    { key: 'railsQty', selector: '[name="railsQty"], #railsQty', defaultValue: 0 },
    { key: 'meshQty', selector: '[name="meshQty"], #meshQty', defaultValue: 0 },
    { key: 'hardwareQty', selector: '[name="hardwareQty"], #hardwareQty', defaultValue: 0 },
    { key: 'gatesQty', selector: '[name="gatesQty"], #gatesQty', defaultValue: 0 }
];
function parseStoredValue() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('materials storage parse failed.', error); return {}; }
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

    data.materialsTotal = calculateMaterialsTotal(data);

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

    state.materialsTotal = calculateMaterialsTotal(state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab05Materials-changed', state);
}
function validate(state, options) {
    if (typeof options.validate === 'function') { return options.validate(state); }

    if ([state.postsQty, state.railsQty, state.meshQty, state.hardwareQty, state.gatesQty].every(function (value) { return asNumber(value, 0) === 0; })) {
        return { valid: false, message: 'Add at least one material quantity.' };
    }

    return { valid: true, message: '' };
}
function render(root, elements, state) {
    updateStatus(elements, '', false);

    const total = query(root, '[data-role="materials-total"], .js-materials-total');
    const packageValues = buildRecommendedPackage();
    if (total) { total.textContent = asCurrency(state.materialsTotal); }
    FIELDS.forEach(function (field, index) {
        if (asNumber(state[field.key], 0) === 0) { writeField(root, field, packageValues[index]); }
    });

}
/**
 * Initialize the materials tab.
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object, refresh: function(): Object}}
 */
function initTab05Materials(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);
    if (!root) {
        console.warn('materials root not found.');
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
            emit('fence-estimator:tab05Materials-invalid', state);
            return false;
        }

        state.materialsTotal = calculateMaterialsTotal(state);
        global.localStorage.setItem('fence-estimator.activeMaterials', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Materials updated.', false);
        emit('fence-estimator:tab05Materials-saved', state);
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

const UNIT_PRICES = { postsQty: 32, railsQty: 18, meshQty: 14, hardwareQty: 9, gatesQty: 245 };
function readLinkedState(key) {
    try { return JSON.parse(global.localStorage.getItem(key) || '{}'); }
    catch (error) { return {}; }
}
function buildRecommendedPackage() {
    const fenceTypeState = readLinkedState('fence-estimator.activeFenceType');
    const measurements = readLinkedState('fence-estimator.activeMeasurements');
    const fenceType = fenceTypeState.fenceType || 'chain-link';
    const linearFeet = asNumber(measurements.linearFeet, 0);
    const gates = asNumber(measurements.gates, 0);
    const divisor = fenceType === 'wood' ? 6 : 8;
    return [Math.ceil(linearFeet / divisor) + 1, Math.ceil(linearFeet / 8) * (fenceType === 'chain-link' ? 1 : 2), Math.ceil(linearFeet), Math.max(1, Math.ceil(linearFeet / 50)), gates];
}
function calculateMaterialsTotal(state) {
    return Object.keys(UNIT_PRICES).reduce(function (total, key) { return total + (asNumber(state[key], 0) * UNIT_PRICES[key]); }, 0);
}

const api = { init: initTab05Materials, initTab05Materials: initTab05Materials };
global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab05Materials = api;
if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);

