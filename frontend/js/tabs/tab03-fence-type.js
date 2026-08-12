(function (global) {
'use strict';
/**
 * Fence type tab helpers for chain-link, wood, vinyl, aluminum, wrought-iron, and related height/style/grade options.
 * @module tab03FenceType
 */
const STORAGE_KEY = 'fence-estimator.tab03.fence-type';
const DEFAULT_SELECTORS = {
    root: '[data-tab="fence-type"], #tab-fence-type, #tab03-fence-type',
    form: 'form',
    saveButton: '[data-action="save-fence-type"], .js-save-fence-type, button[type="submit"]',
    status: '[data-role="fence-type-status"], .js-fence-type-status, .form-status'
};
const DEFAULT_STATE = {
    fenceType: "chain-link",
    height: "4",
    color: "galvanized",
    style: "standard",
    grade: "residential"
};
const FIELDS = [
    { key: 'fenceType', selector: '[name="fenceType"], #fenceType', defaultValue: "chain-link" },
    { key: 'height', selector: '[name="fenceHeight"], #fenceHeight', defaultValue: "4" },
    { key: 'color', selector: '[name="fenceColor"], #fenceColor', defaultValue: "galvanized" },
    { key: 'style', selector: '[name="fenceStyle"], #fenceStyle', defaultValue: "standard" },
    { key: 'grade', selector: '[name="fenceGrade"], #fenceGrade', defaultValue: "residential" }
];
function parseStoredValue() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('fence type storage parse failed.', error); return {}; }
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

    if (target && (target.id === 'fenceType' || target.name === 'fenceType')) { applyFencePreset(root, state.fenceType); }

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab03FenceType-changed', state);
}
function validate(state, options) {
    if (typeof options.validate === 'function') { return options.validate(state); }

    if (!String(state.fenceType || '').trim()) { return { valid: false, message: 'Select a fence type.' }; }
    if (asNumber(state.height, 0) <= 0) { return { valid: false, message: 'Select a valid fence height.' }; }

    return { valid: true, message: '' };
}
function render(root, elements, state) {
    updateStatus(elements, '', false);

    const summary = query(root, '[data-role="fence-type-summary"], .js-fence-type-summary');
    if (summary) { summary.textContent = [state.fenceType, state.height + ' ft', state.color, state.style, state.grade].join(' • '); }

}
/**
 * Initialize the fence type tab.
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object, refresh: function(): Object}}
 */
function initTab03FenceType(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);
    if (!root) {
        console.warn('fence type root not found.');
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
            emit('fence-estimator:tab03FenceType-invalid', state);
            return false;
        }

        global.localStorage.setItem('fence-estimator.activeFenceType', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Fence type saved.', false);
        emit('fence-estimator:tab03FenceType-saved', state);
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

const FENCE_PRESETS = {
    'chain-link': { height: '4', color: 'galvanized', style: 'knuckle-selvage', grade: 'commercial' },
    wood: { height: '6', color: 'cedar', style: 'privacy', grade: 'residential' },
    vinyl: { height: '6', color: 'white', style: 'privacy', grade: 'residential' },
    aluminum: { height: '5', color: 'black', style: 'ornamental', grade: 'commercial' },
    'wrought-iron': { height: '6', color: 'matte-black', style: 'decorative', grade: 'industrial' }
};
function applyFencePreset(root, fenceType) {
    const preset = FENCE_PRESETS[fenceType];
    if (!preset) { return; }
    writeField(root, FIELDS[1], preset.height);
    writeField(root, FIELDS[2], preset.color);
    writeField(root, FIELDS[3], preset.style);
    writeField(root, FIELDS[4], preset.grade);
}

const api = { init: initTab03FenceType, initTab03FenceType: initTab03FenceType };
global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab03FenceType = api;
if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);

