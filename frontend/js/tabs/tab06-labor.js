(function (global) {
'use strict';

/**
 * Labor estimation helpers for crew sizing, installation time, labor category breakdowns, and total labor cost.
 * The module stores tab state locally and emits events so the estimator shell
 * can react without tightly coupling each screen to a single page layout.
 */
const STORAGE_KEY = 'fence-estimator.tab06.labor';
const DEFAULT_SELECTORS = {
    root: '[data-tab="labor"], #tab-labor, #tab06-labor',
    form: 'form',
    saveButton: '[data-action="save-labor"], .js-save-labor, button[type="submit"]',
    status: '[data-role="labor-status"], .js-labor-status, .form-status'
};
const DEFAULT_STATE = {
    crewSize: 2,
    days: 1,
    hourlyRate: 65,
    setupTime: 1,
    installationHours: 6,
    deliveryHours: 1,
    cleanupHours: 1,
    laborTotal: 0
};
const FIELDS = [
    { key: 'crewSize', selector: '[name="crewSize"], #crewSize', defaultValue: 2 },
    { key: 'days', selector: '[name="laborDays"], #laborDays', defaultValue: 1 },
    { key: 'hourlyRate', selector: '[name="hourlyRate"], #hourlyRate', defaultValue: 65 },
    { key: 'setupTime', selector: '[name="setupTime"], #setupTime', defaultValue: 1 },
    { key: 'installationHours', selector: '[name="installationHours"], #installationHours', defaultValue: 6 },
    { key: 'deliveryHours', selector: '[name="deliveryHours"], #deliveryHours', defaultValue: 1 },
    { key: 'cleanupHours', selector: '[name="cleanupHours"], #cleanupHours', defaultValue: 1 }
];

function parseStoredValue() {
    try {
        return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
        console.warn('labor storage parse failed.', error);
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

    data.laborTotal = calculateLaborTotal(data);

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

    state.laborTotal = calculateLaborTotal(state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab06Labor-changed', state);
}

function validate(state, options) {
    if (typeof options.validate === 'function') {
        return options.validate(state);
    }

    if (asNumber(state.crewSize, 0) <= 0 || asNumber(state.hourlyRate, 0) <= 0) {
        return { valid: false, message: 'Crew size and hourly rate must be greater than zero.' };
    }

    return { valid: true, message: '' };
}

function render(root, elements, state) {
    updateStatus(elements, '', false);

    const total = query(root, '[data-role="labor-total"], .js-labor-total');
    if (total) {
        total.textContent = asCurrency(state.laborTotal);
    }

}

/**
 * Initialize the labor tab.
 *
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object}}
 */
function initTab06Labor(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);

    if (!root) {
        console.warn('labor root not found.');
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
            emit('fence-estimator:tab06Labor-invalid', state);
            return false;
        }


        state.laborTotal = calculateLaborTotal(state);
        global.localStorage.setItem('fence-estimator.activeLabor', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Labor estimate saved.', false);
        emit('fence-estimator:tab06Labor-saved', state);
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


function calculateLaborTotal(state) {
    const dailyHours = asNumber(state.setupTime, 0) + asNumber(state.installationHours, 0) + asNumber(state.deliveryHours, 0) + asNumber(state.cleanupHours, 0);
    return asNumber(state.crewSize, 0) * asNumber(state.days, 0) * dailyHours * asNumber(state.hourlyRate, 0);
}

const api = {
    init: initTab06Labor,
    initTab06Labor: initTab06Labor
};

global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab06Labor = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
})(typeof window !== 'undefined' ? window : globalThis);

