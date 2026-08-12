(function (global) {
'use strict';
/**
 * Project details tab helpers for job setup, project type selection, date coordination, and job number handling.
 * @module tab02Project
 */
const STORAGE_KEY = 'fence-estimator.tab02.project';
const DEFAULT_SELECTORS = {
    root: '[data-tab="project"], #tab-project, #tab02-project',
    form: 'form',
    saveButton: '[data-action="save-project"], .js-save-project, button[type="submit"]',
    status: '[data-role="project-status"], .js-project-status, .form-status'
};
const DEFAULT_STATE = {
    projectName: "",
    siteAddress: "",
    startDate: "",
    endDate: "",
    notes: "",
    projectType: "residential",
    jobNumber: ""
};
const FIELDS = [
    { key: 'projectName', selector: '[name="projectName"], #projectName', defaultValue: "" },
    { key: 'siteAddress', selector: '[name="siteAddress"], #siteAddress', defaultValue: "" },
    { key: 'startDate', selector: '[name="projectStartDate"], #projectStartDate', defaultValue: "" },
    { key: 'endDate', selector: '[name="projectEndDate"], #projectEndDate', defaultValue: "" },
    { key: 'notes', selector: '[name="projectNotes"], #projectNotes', defaultValue: "" },
    { key: 'projectType', selector: '[name="projectType"], #projectType', defaultValue: "residential" },
    { key: 'jobNumber', selector: '[name="jobNumber"], #jobNumber', defaultValue: "" }
];
function parseStoredValue() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('project storage parse failed.', error); return {}; }
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

    if ((!state.jobNumber || !String(state.jobNumber).trim()) && target && (target.id === 'projectName' || target.name === 'projectName')) {
        state.jobNumber = buildJobNumber(state.projectType, state.projectName);
        writeField(root, FIELDS[6], state.jobNumber);
    }
    syncProjectDates(root, state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab02Project-changed', state);
}
function validate(state, options) {
    if (typeof options.validate === 'function') { return options.validate(state); }

    if (!String(state.projectName || '').trim()) { return { valid: false, message: 'Project name is required.' }; }
    if (!String(state.siteAddress || '').trim()) { return { valid: false, message: 'Site address is required.' }; }
    if (state.startDate && state.endDate && state.endDate < state.startDate) {
        return { valid: false, message: 'End date must be after the start date.' };
    }

    return { valid: true, message: '' };
}
function render(root, elements, state) {
    updateStatus(elements, '', false);

}
/**
 * Initialize the project tab.
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object, refresh: function(): Object}}
 */
function initTab02Project(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);
    if (!root) {
        console.warn('project root not found.');
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
            emit('fence-estimator:tab02Project-invalid', state);
            return false;
        }

        state.jobNumber = state.jobNumber || buildJobNumber(state.projectType, state.projectName);
        state.projectName = String(state.projectName || '').trim();
        state.siteAddress = String(state.siteAddress || '').trim();
        hydrate(root, state);
        global.localStorage.setItem('fence-estimator.activeProject', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Project details saved.', false);
        emit('fence-estimator:tab02Project-saved', state);
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

function buildJobNumber(projectType, projectName) {
    const prefix = String(projectType || 'residential').slice(0, 3).toUpperCase();
    const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const code = String(projectName || 'JOB').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'JOB';
    return prefix + '-' + stamp + '-' + code;
}
function syncProjectDates(root, state) {
    if (state.startDate && !state.endDate) {
        state.endDate = state.startDate;
        writeField(root, FIELDS[3], state.endDate);
    }
}

const api = { init: initTab02Project, initTab02Project: initTab02Project };
global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab02Project = api;
if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);

