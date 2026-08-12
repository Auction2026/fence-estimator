(function (global) {
'use strict';

/**
 * Estimate summary helpers that consolidate materials, labor, extras, tax, and grand total values for presentation and export.
 * The module stores tab state locally and emits events so the estimator shell
 * can react without tightly coupling each screen to a single page layout.
 */
const STORAGE_KEY = 'fence-estimator.tab09.summary';
const DEFAULT_SELECTORS = {
    root: '[data-tab="summary"], #tab-summary, #tab09-summary',
    form: 'form',
    saveButton: '[data-action="save-summary"], .js-save-summary, button[type="submit"]',
    status: '[data-role="summary-status"], .js-summary-status, .form-status'
};
const DEFAULT_STATE = {
    taxRate: 0.08,
    materialsSubtotal: 0,
    laborSubtotal: 0,
    extrasSubtotal: 0,
    grandTotal: 0,
    taxAmount: 0
};
const FIELDS = [
    { key: 'taxRate', selector: '[name="taxRate"], #taxRate', defaultValue: 0.08 },
    { key: 'materialsSubtotal', selector: '[name="materialsSubtotal"], #materialsSubtotal', defaultValue: 0 },
    { key: 'laborSubtotal', selector: '[name="laborSubtotal"], #laborSubtotal', defaultValue: 0 },
    { key: 'extrasSubtotal', selector: '[name="extrasSubtotal"], #extrasSubtotal', defaultValue: 0 },
    { key: 'grandTotal', selector: '[name="grandTotal"], #grandTotal', defaultValue: 0 }
];

function parseStoredValue() {
    try {
        return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
        console.warn('summary storage parse failed.', error);
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

    data.taxAmount = calculateTax(data);
    data.grandTotal = calculateGrandTotal(data);

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

    syncFromSources(root, state);
    state.taxAmount = calculateTax(state);
    state.grandTotal = calculateGrandTotal(state);
    hydrate(root, state);

    persist(state);
    render(root, elements, state);
    emit('fence-estimator:tab09Summary-changed', state);
}

function validate(state, options) {
    if (typeof options.validate === 'function') {
        return options.validate(state);
    }

    if (asNumber(state.taxRate, -1) < 0) {
        return { valid: false, message: 'Tax rate cannot be negative.' };
    }

    return { valid: true, message: '' };
}

function render(root, elements, state) {
    updateStatus(elements, '', false);

    const taxNode = query(root, '[data-role="tax-amount"], .js-tax-amount');
    const totalNode = query(root, '[data-role="grand-total"], .js-grand-total');
    const printButton = query(root, '[data-action="print-estimate"], .js-print-estimate');
    const exportButton = query(root, '[data-action="export-estimate"], .js-export-estimate');

    if (taxNode) {
        taxNode.textContent = asCurrency(state.taxAmount);
    }

    if (totalNode) {
        totalNode.textContent = asCurrency(state.grandTotal);
    }

    if (printButton && !printButton.dataset.bound) {
        printButton.dataset.bound = 'true';
        printButton.addEventListener('click', function () { global.print(); });
    }

    if (exportButton && !exportButton.dataset.bound) {
        exportButton.dataset.bound = 'true';
        exportButton.addEventListener('click', function () {
            emit('fence-estimator:summary-export', collectState(root));
        });
    }

}

/**
 * Initialize the summary tab.
 *
 * @param {Object} [options] Optional selectors and callbacks.
 * @returns {{save: function(): boolean, load: function(): Object, getState: function(): Object}}
 */
function initTab09Summary(options) {
    const settings = Object.assign({ validate: null }, options || {});
    const root = settings.root || document.querySelector(DEFAULT_SELECTORS.root);

    if (!root) {
        console.warn('summary root not found.');
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
            emit('fence-estimator:tab09Summary-invalid', state);
            return false;
        }


        syncFromSources(root, state);
        state.taxAmount = calculateTax(state);
        state.grandTotal = calculateGrandTotal(state);
        hydrate(root, state);
        global.localStorage.setItem('fence-estimator.activeSummary', JSON.stringify(state));

        persist(state);
        render(root, elements, state);
        updateStatus(elements, result.message || 'Summary saved.', false);
        emit('fence-estimator:tab09Summary-saved', state);
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


function readStateByKey(key) {
    try {
        return JSON.parse(global.localStorage.getItem(key) || '{}');
    } catch (error) {
        return {};
    }
}

function syncFromSources(root, state) {
    const materials = readStateByKey('fence-estimator.activeMaterials');
    const labor = readStateByKey('fence-estimator.activeLabor');
    const extras = readStateByKey('fence-estimator.activeExtras');
    state.materialsSubtotal = asNumber(materials.materialsTotal, asNumber(state.materialsSubtotal, 0));
    state.laborSubtotal = asNumber(labor.laborTotal, asNumber(state.laborSubtotal, 0));
    state.extrasSubtotal = asNumber(extras.extrasTotal, asNumber(state.extrasSubtotal, 0));
    writeField(root, FIELDS[1], state.materialsSubtotal);
    writeField(root, FIELDS[2], state.laborSubtotal);
    writeField(root, FIELDS[3], state.extrasSubtotal);
}

function calculateTax(state) {
    return (asNumber(state.materialsSubtotal, 0) + asNumber(state.laborSubtotal, 0) + asNumber(state.extrasSubtotal, 0)) * asNumber(state.taxRate, 0);
}

function calculateGrandTotal(state) {
    return asNumber(state.materialsSubtotal, 0) + asNumber(state.laborSubtotal, 0) + asNumber(state.extrasSubtotal, 0) + calculateTax(state);
}

const api = {
    init: initTab09Summary,
    initTab09Summary: initTab09Summary
};

global.FenceEstimatorTabs = global.FenceEstimatorTabs || {};
global.FenceEstimatorTabs.tab09Summary = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
})(typeof window !== 'undefined' ? window : globalThis);

