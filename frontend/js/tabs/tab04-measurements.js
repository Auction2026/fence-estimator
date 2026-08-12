(function (global) {
'use strict';

/**
 * Measurement entry helpers for linear footage, sections, gates, corners, terrain, soil, and interactive calculators.
 * The module stores tab state locally and emits events so the estimator shell
 * can react without tightly coupling each screen to a single page layout.
 */
const STORAGE_KEY = 'fence-estimator.tab04.measurements';
const DEFAULT_SELECTORS = {
    root: '[data-tab="measurements"], #tab-measurements, #tab04-measurements',
    form: 'form',
    saveButton: '[data-action="save-measurements"], .js-save-measurements, button[type="submit"]',
    status: '[data-role="measurements-status"], .js-measurements-status, .form-status'
};
const DEFAULT_STATE = {
    linearFeet: 0,
    sections: 0,
    gates: 0,
    corners: 0,
    terrainType: "flat",
    soilType: "standard"
};
const FIELDS = [
    { key: 'linearFeet', selector: '[name="linearFeet"], #linearFeet', defaultValue: 0 },
    { key: 'sections', selector: '[name="sections"], #sections', defaultValue: 0 },
    { key: 'gates', selector: '[name="gates"], #measurementGates', defaultValue: 0 },
    { key: 'corners', selector: '[name="corners"], #corners', defaultValue: 0 },
    { key: 'terrainType', selector: '[name="terrainType"], #terrainType', defaultValue: "flat" },
    { key: 'soilType', selector: '[name="soilType"], #soilType', defaultValue: "standard" }
];

function parseStoredValue() {
    try {
        return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
        console.warn('measurements storage parse failed.', error);
        return {};
    }
}

function query(root, selector) {
    return selector ? root.querySelector(selector) : null;
}

function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
}

function asNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function asCurrency(value) {
    return '$' + asNumber(value, 0).toFixed(2);
}

function updateStatus(elements, message, isError) {
    if (!elements.status) {
        return;
    }

    elements.status.textContent = message || '';
    elements.status.dataset.state = isError ? 'error' : 'ready';
}

function readField(root, field) {
    const element = query(root, field.selector);
    if (!element) {
        return field.defaultValue;
    }

    if (element.type === 'checkbox') {
        return Boolean(element.checked);
    }

    if (element.tagName === 'SELECT' && element.multiple) {
        return Array.from(element.selectedOptions).map(function (option) {
            return option.value;
        });
    }

    return element.value;
}

function writeField(root, field, value) {
    const element = query(root, field.selector);
    if (!element) {
        return;
    }

    if (element.type === 'checkbox') {
        element.checked = Boolean(value);
        return;
    }

    if (element.tagName === 'SELECT' && element.multiple && Array.isArray(value)) {
        Array.from(element.options).forEach(function (option) {
            option.selected = value.indexOf(option.value) >= 0;
        });
        return;
    }

    element.value = value == null ? '' : value;
}

function collectState(root) {
    const data = Object.assign({}, DEFAULT_STATE);

    FIELDS.forEach(function (field) {
        data[field.key] = readField(root, field);
    });

    return data;
}

function hydrate(root, state) {
    FIELDS.forEach(function (field) {
        writeField(root, field, state[field.key]);
    });

}

function persist(state) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents(root, elements, save) {
    if (elements.form) {
        elements.form.addEventListener('input', function (event) {
            handleInput(root, elements, event);
        });
        elements.form.addEventListener('change', function (event) {
            handleInput(root, elements, event);
        });
        elements.form.addEventListener('submit', function (event) {
            event.preventDefault();
            save();
        });
    }

    if (elements.saveButton) {
        elements.saveButton.addEventListener('click', save);
    }

}

function handleInput(root, elements, event) {
    const target = event && event.target ? event.target : null;
    const state = collectState(root);

    state.linearFeet = calculateLinearFeet(state);
    writeField(root, FIELDS[0], state.linearFeet);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab04Measurements-changed', state);
}

function validate(state, options) {
    if (typeof options.validate === 'function') {
        return options.validate(state);
    }

    if (asNumber(state.linearFeet, 0) <= 0) {
        return { valid: false, message: 'Linear feet must be greater than zero.' };
    }

    return { valid: true, message: '' };
}

function render(root, elements, state) {
    updateStatus(elements, '', false);

    const calculator = query(root, '[data-role="measurement-total"], .js-measurement-total');
    const adjusted = query(root, '[data-role="terrain-adjusted-total"], .js-terrain-adjusted-total');
    const baseFeet = calculateLinearFeet(state);
    const adjustedFeet = applyTerrainFactor(baseFeet, state.terrainType);

    if (calculator) {
        calculator.textContent = baseFeet + ' LF';
    }

    if (adjusted) {
        adjusted.textContent = adjustedFeet.toFixed(1) + ' adjusted LF';
    }

}

/**
 * Initialize the measurements tab.
 *
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object}}
 */
function initTab04Measurements(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);

    if (!root) {
        console.warn('measurements root not found.');
        return { save: function () { return false; }, load: function () { return {}; }, getState: function () { return {}; } };
    }

    const elements = {
        form: query(root, DEFAULT_SELECTORS.form),
        saveButton: query(root, DEFAULT_SELECTORS.saveButton),
        status: query(root, DEFAULT_SELECTORS.status)
    };
    const initialState = Object.assign({}, DEFAULT_STATE, parseStoredValue());

    function save() {
        const state = collectState(root);
        const result = validate(state, settings) || { valid: true, message: '' };

        if (!result.valid) {
            updateStatus(elements, result.message || 'Please review the highlighted fields.', true);
            emit('fence-estimator:tab04Measurements-invalid', state);
            return false;
        }


        state.linearFeet = calculateLinearFeet(state);
        hydrate(root, state);
        global.localStorage.setItem('fence-estimator.activeMeasurements', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Measurements saved.', false);
        emit('fence-estimator:tab04Measurements-saved', state);
        return true;
    }

    hydrate(root, initialState);
    bindEvents(root, elements, save);
    render(root, elements, initialState);

    return {
        save: save,
        load: function () {
            const state = Object.assign({}, DEFAULT_STATE, parseStoredValue());
            hydrate(root, state);
            render(root, elements, state);
            return state;
        },
        getState: function () {
            return collectState(root);
        }
    };
}


const TERRAIN_FACTORS = { flat: 1, slope: 1.08, hill: 1.15 };
const SOIL_FACTORS = { standard: 1, clay: 1.05, rock: 1.18, sandy: 1.03 };

function calculateLinearFeet(state) {
    const sections = asNumber(state.sections, 0);
    const gates = asNumber(state.gates, 0);
    const corners = asNumber(state.corners, 0);
    const manualFeet = asNumber(state.linearFeet, 0);
    const calculated = (sections * 8) + (gates * 4) + (corners * 2);
    return Math.max(manualFeet, calculated);
}

function applyTerrainFactor(feet, terrainType) {
    return feet * (TERRAIN_FACTORS[terrainType] || 1);
}

const api = {
    init: initTab04Measurements,
    initTab04Measurements: initTab04Measurements
};

global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab04Measurements = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
})(typeof window !== 'undefined' ? window : globalThis);

