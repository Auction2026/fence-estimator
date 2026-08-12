(function (global) {
'use strict';

/**
 * Gate configuration helpers for walk and drive gates, single and double leaf options, and hardware pricing.
 * The module stores tab state locally and emits events so the estimator shell
 * can react without tightly coupling each screen to a single page layout.
 */
const STORAGE_KEY = 'fence-estimator.tab07.gates';
const DEFAULT_SELECTORS = {
    root: '[data-tab="gates"], #tab-gates, #tab07-gates',
    form: 'form',
    saveButton: '[data-action="save-gates"], .js-save-gates, button[type="submit"]',
    status: '[data-role="gates-status"], .js-gates-status, .form-status'
};
const DEFAULT_STATE = {
    gateSwing: "single",
    gateUse: "walk",
    gateWidth: 4,
    gateHeight: 4,
    hardwarePackage: "standard",
    automaticOperator: false,
    gateTotal: 0
};
const FIELDS = [
    { key: 'gateSwing', selector: '[name="gateSwing"], #gateSwing', defaultValue: "single" },
    { key: 'gateUse', selector: '[name="gateUse"], #gateUse', defaultValue: "walk" },
    { key: 'gateWidth', selector: '[name="gateWidth"], #gateWidth', defaultValue: 4 },
    { key: 'gateHeight', selector: '[name="gateHeight"], #gateHeight', defaultValue: 4 },
    { key: 'hardwarePackage', selector: '[name="hardwarePackage"], #hardwarePackage', defaultValue: "standard" },
    { key: 'automaticOperator', selector: '[name="automaticOperator"], #automaticOperator', defaultValue: false }
];

function parseStoredValue() {
    try {
        return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
        console.warn('gates storage parse failed.', error);
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

    data.gateTotal = calculateGateTotal(data);

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

    state.gateTotal = calculateGateTotal(state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab07Gates-changed', state);
}

function validate(state, options) {
    if (typeof options.validate === 'function') {
        return options.validate(state);
    }

    if (asNumber(state.gateWidth, 0) <= 0 || asNumber(state.gateHeight, 0) <= 0) {
        return { valid: false, message: 'Gate dimensions must be greater than zero.' };
    }

    return { valid: true, message: '' };
}

function render(root, elements, state) {
    updateStatus(elements, '', false);

    const total = query(root, '[data-role="gate-total"], .js-gate-total');
    if (total) {
        total.textContent = asCurrency(state.gateTotal);
    }

}

/**
 * Initialize the gates tab.
 *
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object}}
 */
function initTab07Gates(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);

    if (!root) {
        console.warn('gates root not found.');
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
            emit('fence-estimator:tab07Gates-invalid', state);
            return false;
        }


        state.gateTotal = calculateGateTotal(state);
        global.localStorage.setItem('fence-estimator.activeGates', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Gate configuration saved.', false);
        emit('fence-estimator:tab07Gates-saved', state);
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


const HARDWARE_COSTS = { standard: 85, premium: 155, commercial: 260 };

function calculateGateTotal(state) {
    const width = asNumber(state.gateWidth, 0);
    const height = asNumber(state.gateHeight, 0);
    const base = width * height * (state.gateUse === 'drive' ? 28 : 18);
    const swingFactor = state.gateSwing === 'double' ? 1.45 : 1;
    const operatorCost = state.automaticOperator ? 1800 : 0;
    return (base * swingFactor) + (HARDWARE_COSTS[state.hardwarePackage] || HARDWARE_COSTS.standard) + operatorCost;
}

const api = {
    init: initTab07Gates,
    initTab07Gates: initTab07Gates
};

global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab07Gates = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
})(typeof window !== 'undefined' ? window : globalThis);

