'use strict';

const STORAGE_KEY = 'fenceEstimatorState';
const AUTO_SAVE_INTERVAL = 30000;
const TAB_IDS = Array.from({ length: 17 }, (_, index) => `tab${index + 1}`);
const TAB_MODULES = [
    { tabId: 'tab1', init: initProjectTab },
    { tabId: 'tab2', init: initSpecsTab },
    { tabId: 'tab3', init: initLayoutTab },
    { tabId: 'tab4', init: initInstallTab },
    { tabId: 'tab5', init: initDrawingsTab },
    { tabId: 'tab6', init: initPermitsTab },
    { tabId: 'tab7', init: initUtilitiesTab },
    { tabId: 'tab8', init: initEstimateTab },
    { tabId: 'tab9', init: initContractTab },
    { tabId: 'tab10', init: initExtrasTab },
    { tabId: 'tab11', init: initCrewTab },
    { tabId: 'tab12', init: initChangesTab },
    { tabId: 'tab13', init: initSignOffTab },
    { tabId: 'tab14', init: initNotesTab },
    { tabId: 'tab15', init: initAdminTab },
    { tabId: 'tab16', init: initCatalogTab },
    { tabId: 'tab17', init: initMappingTab }
];

const DEFAULT_CATALOG = [
    { sku: 'CL-048', name: 'Chain Link Panel 48in', price: 74.95, stock: 42 },
    { sku: 'WD-006', name: 'Pressure Treated 6ft Privacy Panel', price: 129.99, stock: 18 },
    { sku: 'VN-060', name: 'Vinyl Privacy Panel 60in', price: 158.5, stock: 24 },
    { sku: 'GT-SGL', name: 'Single Swing Gate Kit', price: 289.0, stock: 11 },
    { sku: 'GT-DBL', name: 'Double Drive Gate Kit', price: 549.0, stock: 7 },
    { sku: 'POST-9', name: 'Galvanized Line Post 9ft', price: 34.25, stock: 120 }
];

const appState = {
    currentProject: {
        id: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        status: 'draft',
        customer: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            province: '',
            postal: ''
        },
        propertySize: '',
        permit: {
            number: '',
            status: 'pending'
        },
        utilities: [],
        layout: {
            strokes: []
        }
    },
    currentEstimate: {
        fenceType: '',
        height: '',
        color: '',
        materialGrade: 'standard',
        linearFeet: 0,
        numberOfPosts: 0,
        numberOfGates: 0,
        gateWidth: 0,
        materials: 0,
        labor: 0,
        equipment: 0,
        permits: 0,
        extras: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
        priceLocked: false,
        paymentStatus: 'pending'
    },
    currentUser: {
        name: 'Estimator',
        role: 'Sales',
        authenticated: true
    },
    activeTab: 'tab1',
    extras: [],
    crew: [],
    changeOrders: [],
    notes: [],
    signOff: {
        completionDate: '',
        checklist: []
    },
    drawings: [],
    catalog: DEFAULT_CATALOG.slice(),
    autosaveEnabled: true,
    lastSavedAt: ''
};

let autoSaveHandle = null;
let isDrawing = false;
let drawingContext = null;
let currentStroke = [];

function $(selector, scope) {
    return (scope || document).querySelector(selector);
}

function $all(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
}

function safeNumber(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function deepMerge(target, source) {
    Object.keys(source || {}).forEach((key) => {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (Array.isArray(sourceValue)) {
            target[key] = sourceValue.slice();
            return;
        }

        if (sourceValue && typeof sourceValue === 'object') {
            target[key] = deepMerge(targetValue && typeof targetValue === 'object' ? targetValue : {}, sourceValue);
            return;
        }

        target[key] = sourceValue;
    });

    return target;
}

function initializeApp() {
    ensureUiShell();
    loadFromStorage();
    bindGlobalEventListeners();
    initializeTabModules();
    restoreFormState();
    renderAll();
    switchTab(appState.activeTab || 'tab1');
    startAutoSave();
}

document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', saveToStorage);

autoExposePublicApi();

function autoExposePublicApi() {
    const publicApi = {
        switchTab,
        showModal,
        hideModal,
        showToast,
        showLoading,
        hideLoading,
        formatCurrency,
        formatDate,
        loadFromStorage,
        saveToStorage,
        logout,
        showHome,
        saveProject,
        saveSpecs,
        startDrawing,
        clearCanvas,
        saveDrawing,
        uploadDrawing,
        savePermits,
        saveUtilities,
        generatePDF,
        lockPrice,
        signContract,
        addExtra,
        addCrewMember,
        addChangeOrder,
        signOffProject,
        addNote
    };

    Object.keys(publicApi).forEach((key) => {
        window[key] = publicApi[key];
    });
}

function ensureUiShell() {
    ensureToastContainer();
    ensureLoadingOverlay();
}

function ensureToastContainer() {
    if ($('#toastContainer')) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
}

function ensureLoadingOverlay() {
    if ($('#loadingOverlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = [
        '<div class="loading-card" role="status" aria-live="polite">',
        '  <div class="spinner" aria-hidden="true"></div>',
        '  <p>Loading estimator data…</p>',
        '</div>'
    ].join('');
    document.body.appendChild(overlay);
}

function bindGlobalEventListeners() {
    bindTabButtons();
    bindFormListeners();
    bindModalListeners();
    bindKeyboardShortcuts();
    bindCatalogSearch();
}

function bindTabButtons() {
    $all('.tab-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
}

function bindFormListeners() {
    $all('form').forEach((form) => {
        form.addEventListener('change', handleFormMutation);
        form.addEventListener('input', handleFormMutation, { passive: true });
    });

    $all('input, select, textarea').forEach((field) => {
        field.addEventListener('change', persistVisibleState);
    });
}

function bindModalListeners() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.matches('[data-modal-open]')) {
            showModal(target.getAttribute('data-modal-open'));
        }

        if (target.matches('[data-modal-close]')) {
            hideModal(target.getAttribute('data-modal-close') || target.closest('.modal')?.id);
        }

        if (target.classList.contains('modal')) {
            hideModal(target.id);
        }
    });
}

function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            $all('.modal.is-open').forEach((modal) => hideModal(modal.id));
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            saveToStorage();
            showToast('Estimate saved.', 'success');
        }
    });
}

function bindCatalogSearch() {
    const search = $('#productSearch');
    if (!search) {
        return;
    }

    search.addEventListener('input', () => {
        renderCatalog(search.value.trim());
    });
}

function handleFormMutation() {
    persistVisibleState();
    recalculateEstimate();
    renderContractSummary();
    updateAdminSummary();
}

function persistVisibleState() {
    hydrateStateFromForms();
    appState.currentProject.updatedAt = new Date().toISOString();
}

function hydrateStateFromForms() {
    appState.currentProject.customer.name = valueOf('#customerName');
    appState.currentProject.customer.email = valueOf('#customerEmail');
    appState.currentProject.customer.phone = valueOf('#customerPhone');
    appState.currentProject.customer.address = valueOf('#customerAddress');
    appState.currentProject.customer.city = valueOf('#customerCity');
    appState.currentProject.customer.province = valueOf('#customerProvince');
    appState.currentProject.customer.postal = valueOf('#customerPostal');
    appState.currentProject.propertySize = valueOf('#propertySize');
    appState.currentProject.createdAt = valueOf('#projectDate') || appState.currentProject.createdAt || new Date().toISOString();
    appState.currentProject.name = appState.currentProject.customer.name || 'Untitled Project';

    appState.currentEstimate.fenceType = valueOf('#fenceType');
    appState.currentEstimate.height = valueOf('#fenceHeight');
    appState.currentEstimate.color = valueOf('#fenceColor');
    appState.currentEstimate.materialGrade = valueOf('#materialGrade') || 'standard';
    appState.currentEstimate.linearFeet = safeNumber(valueOf('#linearFeet'));
    appState.currentEstimate.numberOfPosts = safeNumber(valueOf('#numberOfPosts'));
    appState.currentEstimate.numberOfGates = safeNumber(valueOf('#numberOfGates'));
    appState.currentEstimate.gateWidth = safeNumber(valueOf('#gateWidth'));

    appState.currentProject.permit.number = valueOf('#permitNumber');
    appState.currentProject.permit.status = valueOf('#permitStatus') || 'pending';
    appState.currentProject.utilities = $all('input[name="utility"]:checked').map((checkbox) => checkbox.value);

    appState.signOff.completionDate = valueOf('#completionDate');
    appState.signOff.checklist = $all('input[name="inspection"]:checked').map((checkbox) => checkbox.parentElement?.textContent?.trim() || checkbox.value);

    appState.currentProject.status = inferProjectStatus();
}

function restoreFormState() {
    setValue('#customerName', appState.currentProject.customer.name);
    setValue('#customerEmail', appState.currentProject.customer.email);
    setValue('#customerPhone', appState.currentProject.customer.phone);
    setValue('#projectDate', normalizeDateInput(appState.currentProject.createdAt) || normalizeDateInput(new Date()));
    setValue('#customerAddress', appState.currentProject.customer.address);
    setValue('#customerCity', appState.currentProject.customer.city);
    setValue('#customerProvince', appState.currentProject.customer.province);
    setValue('#customerPostal', appState.currentProject.customer.postal);
    setValue('#propertySize', appState.currentProject.propertySize);

    setValue('#fenceType', appState.currentEstimate.fenceType);
    setValue('#fenceHeight', appState.currentEstimate.height);
    setValue('#fenceColor', appState.currentEstimate.color);
    setValue('#materialGrade', appState.currentEstimate.materialGrade);
    setValue('#linearFeet', appState.currentEstimate.linearFeet || '');
    setValue('#numberOfPosts', appState.currentEstimate.numberOfPosts || '');
    setValue('#numberOfGates', appState.currentEstimate.numberOfGates || 0);
    setValue('#gateWidth', appState.currentEstimate.gateWidth || 0);

    setValue('#permitNumber', appState.currentProject.permit.number);
    setValue('#permitStatus', appState.currentProject.permit.status || 'pending');
    setValue('#completionDate', normalizeDateInput(appState.signOff.completionDate));

    $all('input[name="utility"]').forEach((checkbox) => {
        checkbox.checked = appState.currentProject.utilities.includes(checkbox.value);
    });

    const checkedInspections = new Set(appState.signOff.checklist);
    $all('input[name="inspection"]').forEach((checkbox) => {
        const labelText = checkbox.parentElement?.textContent?.trim() || checkbox.value;
        checkbox.checked = checkedInspections.has(labelText);
    });
}

function valueOf(selector) {
    const element = $(selector);
    return element ? element.value.trim() : '';
}

function setValue(selector, value) {
    const element = $(selector);
    if (!element) {
        return;
    }

    element.value = value ?? '';
}

function inferProjectStatus() {
    if (appState.signOff.checklist.length >= 3 && appState.signOff.completionDate) {
        return 'completed';
    }

    if (appState.currentEstimate.total > 0 || appState.extras.length || appState.crew.length) {
        return 'active';
    }

    return 'draft';
}

function initializeTabModules() {
    TAB_MODULES.forEach((moduleConfig) => {
        try {
            moduleConfig.init();
        } catch (error) {
            console.error(`Failed to initialize ${moduleConfig.tabId}`, error);
        }
    });
}

function initProjectTab() {
    if (!appState.currentProject.id) {
        appState.currentProject.id = `EST-${Date.now()}`;
    }
}

function initSpecsTab() {
    recalculateEstimate();
}

function initLayoutTab() {
    const canvas = $('#layoutCanvas');
    if (!canvas) {
        return;
    }

    drawingContext = canvas.getContext('2d');
    redrawLayoutCanvas();
    canvas.addEventListener('mousedown', beginDrawing);
    canvas.addEventListener('mousemove', drawStroke);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseleave', endDrawing);
    canvas.addEventListener('touchstart', beginDrawing, { passive: false });
    canvas.addEventListener('touchmove', drawStroke, { passive: false });
    canvas.addEventListener('touchend', endDrawing);
}

function initInstallTab() {}
function initDrawingsTab() {}
function initPermitsTab() {}
function initUtilitiesTab() {}
function initEstimateTab() { renderEstimate(); }
function initContractTab() { renderContractSummary(); }
function initExtrasTab() { renderExtras(); }
function initCrewTab() { renderCrew(); }
function initChangesTab() { renderChangeOrders(); }
function initSignOffTab() {}
function initNotesTab() { renderNotes(); }
function initAdminTab() { updateAdminSummary(); }
function initCatalogTab() { renderCatalog(); }
function initMappingTab() { renderMapPlaceholder(); }

function renderAll() {
    recalculateEstimate();
    renderEstimate();
    renderContractSummary();
    renderExtras();
    renderCrew();
    renderChangeOrders();
    renderNotes();
    renderCatalog();
    updateAdminSummary();
    redrawLayoutCanvas();
}

function switchTab(tabId) {
    if (!TAB_IDS.includes(tabId)) {
        return;
    }

    $all('.tab-content').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    $all('.tab-btn').forEach((button) => {
        const isActive = button.dataset.tab === tabId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });

    appState.activeTab = tabId;
    saveToStorage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
}

function showToast(message, type) {
    const container = $('#toastContainer');
    if (!container) {
        return;
    }

    const variant = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    const iconMap = { success: '✓', error: '!', warning: '!', info: 'i' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${variant}`;
    toast.innerHTML = [
        `<div class="toast__icon" aria-hidden="true">${iconMap[variant]}</div>`,
        `<div class="toast__message">${message}</div>`,
        '<button class="toast__close" type="button" aria-label="Dismiss notification">×</button>'
    ].join('');

    toast.querySelector('.toast__close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, 4200);
}

function showLoading() {
    $('#loadingOverlay')?.classList.add('is-visible');
}

function hideLoading() {
    $('#loadingOverlay')?.classList.remove('is-visible');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number.isFinite(Number(amount)) ? Number(amount) : 0);
}

function formatDate(date) {
    const dateObject = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(dateObject.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(dateObject);
}

function normalizeDateInput(value) {
    if (!value) {
        return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toISOString().slice(0, 10);
}

function loadFromStorage() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }

        const storedState = JSON.parse(raw);
        deepMerge(appState, storedState);
    } catch (error) {
        console.error('Unable to load state from storage.', error);
        showToast('Saved data could not be restored.', 'warning');
    }
}

function saveToStorage() {
    try {
        hydrateStateFromForms();
        recalculateEstimate();
        appState.lastSavedAt = new Date().toISOString();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (error) {
        console.error('Unable to save state to storage.', error);
        showToast('Unable to save data locally.', 'error');
    }
}

function startAutoSave() {
    if (autoSaveHandle) {
        window.clearInterval(autoSaveHandle);
    }

    autoSaveHandle = window.setInterval(() => {
        if (!appState.autosaveEnabled) {
            return;
        }

        saveToStorage();
    }, AUTO_SAVE_INTERVAL);
}

function logout() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Unable to clear local storage.', error);
    }

    if (autoSaveHandle) {
        window.clearInterval(autoSaveHandle);
    }

    showToast('You have been logged out.', 'info');
    const loginUrl = document.body?.dataset?.loginUrl || 'login.html';
    window.setTimeout(() => {
        window.location.assign(loginUrl);
    }, 300);
}

function showHome() {
    switchTab('tab1');
}

function recalculateEstimate() {
    const rateMap = {
        chainlink: 15,
        wood: 28,
        vinyl: 36,
        wroughtiron: 58,
        aluminum: 42
    };

    const gradeMultiplier = {
        standard: 1,
        premium: 1.18,
        commercial: 1.32
    };

    const estimate = appState.currentEstimate;
    const linearFeet = safeNumber(estimate.linearFeet);
    const posts = Math.max(safeNumber(estimate.numberOfPosts), linearFeet ? Math.ceil(linearFeet / 8) : 0);
    const gates = safeNumber(estimate.numberOfGates);
    const gateWidth = safeNumber(estimate.gateWidth);
    const materialRate = (rateMap[estimate.fenceType] || 20) * (gradeMultiplier[estimate.materialGrade] || 1);

    estimate.materials = linearFeet * materialRate + posts * 18;
    estimate.labor = linearFeet * 12.5 + gates * 85;
    estimate.equipment = linearFeet * 2.25 + gates * Math.max(gateWidth, 3) * 18;
    estimate.permits = appState.currentProject.permit.number ? 125 : 0;
    estimate.extras = appState.extras.reduce((sum, item) => sum + safeNumber(item.cost), 0) + appState.changeOrders.reduce((sum, item) => sum + safeNumber(item.cost), 0);
    estimate.subtotal = estimate.materials + estimate.labor + estimate.equipment + estimate.permits + estimate.extras;
    estimate.tax = estimate.subtotal * 0.13;
    estimate.total = estimate.subtotal + estimate.tax;
}

function renderEstimate() {
    setText('#estimateMaterials', formatCurrency(appState.currentEstimate.materials));
    setText('#estimateLabor', formatCurrency(appState.currentEstimate.labor));
    setText('#estimateEquipment', formatCurrency(appState.currentEstimate.equipment));
    setText('#estimatePermits', formatCurrency(appState.currentEstimate.permits));
    setText('#estimateExtras', formatCurrency(appState.currentEstimate.extras));
    setText('#estimateSubtotal', formatCurrency(appState.currentEstimate.subtotal));
    setText('#estimateTax', formatCurrency(appState.currentEstimate.tax));
    setText('#estimateTotal', formatCurrency(appState.currentEstimate.total));
}

function renderContractSummary() {
    const customer = appState.currentProject.customer.name || '---';
    setText('#contractCustomer', customer);
    setText('#contractPrice', formatCurrency(appState.currentEstimate.total));
}

function renderExtras() {
    const tbody = $('#extrasTableBody');
    if (!tbody) {
        return;
    }

    if (!appState.extras.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-subtle">No extras added yet.</td></tr>';
        return;
    }

    tbody.innerHTML = appState.extras.map((item, index) => {
        return [
            '<tr>',
            `  <td>${escapeHtml(item.name)}</td>`,
            `  <td>${formatCurrency(item.cost)}</td>`,
            `  <td><button type="button" class="btn btn-ghost" data-remove-extra="${index}">Remove</button></td>`,
            '</tr>'
        ].join('');
    }).join('');

    $all('[data-remove-extra]', tbody).forEach((button) => {
        button.addEventListener('click', () => {
            const index = Number.parseInt(button.getAttribute('data-remove-extra'), 10);
            appState.extras.splice(index, 1);
            recalculateEstimate();
            renderExtras();
            renderEstimate();
            updateAdminSummary();
            saveToStorage();
        });
    });
}

function renderCrew() {
    const tbody = $('#crewTableBody');
    if (!tbody) {
        return;
    }

    if (!appState.crew.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-subtle">No crew assigned.</td></tr>';
        return;
    }

    tbody.innerHTML = appState.crew.map((member, index) => {
        return [
            '<tr>',
            `  <td>${escapeHtml(member.name)}</td>`,
            `  <td>${escapeHtml(member.role)}</td>`,
            `  <td><button type="button" class="btn btn-ghost" data-remove-crew="${index}">Remove</button></td>`,
            '</tr>'
        ].join('');
    }).join('');

    $all('[data-remove-crew]', tbody).forEach((button) => {
        button.addEventListener('click', () => {
            const index = Number.parseInt(button.getAttribute('data-remove-crew'), 10);
            appState.crew.splice(index, 1);
            renderCrew();
            updateAdminSummary();
            saveToStorage();
        });
    });
}

function renderChangeOrders() {
    const container = $('#changeOrdersList');
    if (!container) {
        return;
    }

    if (!appState.changeOrders.length) {
        container.innerHTML = '<div class="change-order-item text-subtle">No change orders created.</div>';
        return;
    }

    container.className = 'change-orders-list';
    container.innerHTML = appState.changeOrders.map((changeOrder) => {
        return [
            '<article class="change-order-item">',
            '  <div class="change-order-item__header">',
            `    <strong>${escapeHtml(changeOrder.description)}</strong>`,
            `    <span>${formatCurrency(changeOrder.cost)}</span>`,
            '  </div>',
            `  <div class="timestamp">${formatDate(changeOrder.createdAt)}</div>`,
            '</article>'
        ].join('');
    }).join('');
}

function renderNotes() {
    const container = $('#notesList');
    if (!container) {
        return;
    }

    if (!appState.notes.length) {
        container.innerHTML = '<div class="note-item text-subtle">No project notes yet.</div>';
        return;
    }

    container.className = 'notes-list';
    container.innerHTML = appState.notes.map((note) => {
        return [
            '<article class="note-item">',
            '  <div class="note-item__header">',
            `    <strong>${escapeHtml(note.author)}</strong>`,
            `    <span class="timestamp">${formatDate(note.createdAt)}</span>`,
            '  </div>',
            `  <p>${escapeHtml(note.content)}</p>`,
            '</article>'
        ].join('');
    }).join('');
}

function renderCatalog(searchTerm) {
    const tbody = $('#productTableBody');
    if (!tbody) {
        return;
    }

    const term = (searchTerm || '').toLowerCase();
    const results = appState.catalog.filter((item) => {
        return !term || item.sku.toLowerCase().includes(term) || item.name.toLowerCase().includes(term);
    });

    if (!results.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-subtle">No products found.</td></tr>';
        return;
    }

    tbody.innerHTML = results.map((item) => {
        return [
            '<tr>',
            `  <td>${escapeHtml(item.sku)}</td>`,
            `  <td>${escapeHtml(item.name)}</td>`,
            `  <td>${formatCurrency(item.price)}</td>`,
            `  <td>${item.stock}</td>`,
            '</tr>'
        ].join('');
    }).join('');
}

function updateAdminSummary() {
    setText('#totalProjects', appState.currentProject.id ? '1' : '0');
    setText('#totalRevenue', formatCurrency(appState.currentEstimate.total));
}

function renderMapPlaceholder() {
    const container = $('#mapContainer');
    if (!container || container.dataset.enhanced === 'true') {
        return;
    }

    container.dataset.enhanced = 'true';
    container.classList.add('card');
    container.innerHTML = [
        '<div class="flex items-center justify-center h-full text-center p-5">',
        '  <div>',
        '    <h3 class="mb-3">Project Mapping</h3>',
        '    <p>Interactive mapping can be connected here for lot lines, gate locations, and obstacle markers.</p>',
        '  </div>',
        '</div>'
    ].join('');
}

function setText(selector, value) {
    const element = $(selector);
    if (element) {
        element.textContent = value;
    }
}

function saveProject(event) {
    if (event) {
        event.preventDefault();
    }

    persistVisibleState();
    saveToStorage();
    showToast('Project information saved.', 'success');
}

function saveSpecs(event) {
    if (event) {
        event.preventDefault();
    }

    persistVisibleState();
    recalculateEstimate();
    renderEstimate();
    renderContractSummary();
    saveToStorage();
    showToast('Fence specifications updated.', 'success');
}

function savePermits(event) {
    if (event) {
        event.preventDefault();
    }

    persistVisibleState();
    recalculateEstimate();
    renderEstimate();
    saveToStorage();
    showToast('Permit details saved.', 'success');
}

function saveUtilities(event) {
    if (event) {
        event.preventDefault();
    }

    persistVisibleState();
    saveToStorage();
    showToast('Utility locate checklist saved.', 'success');
}

function addExtra(event) {
    if (event) {
        event.preventDefault();
    }

    const name = valueOf('#extraItem');
    const cost = safeNumber(valueOf('#extraCost'));
    if (!name) {
        showToast('Enter an extra item name.', 'warning');
        return;
    }

    appState.extras.push({ name, cost, createdAt: new Date().toISOString() });
    setValue('#extraItem', '');
    setValue('#extraCost', '');
    recalculateEstimate();
    renderExtras();
    renderEstimate();
    renderContractSummary();
    updateAdminSummary();
    saveToStorage();
    showToast('Extra item added.', 'success');
}

function addCrewMember(event) {
    if (event) {
        event.preventDefault();
    }

    const name = valueOf('#crewName');
    const role = valueOf('#crewRole') || 'Laborer';
    if (!name) {
        showToast('Enter a crew member name.', 'warning');
        return;
    }

    appState.crew.push({ name, role, createdAt: new Date().toISOString() });
    setValue('#crewName', '');
    renderCrew();
    updateAdminSummary();
    saveToStorage();
    showToast('Crew member assigned.', 'success');
}

function addChangeOrder(event) {
    if (event) {
        event.preventDefault();
    }

    const description = valueOf('#changeDescription');
    const cost = safeNumber(valueOf('#changeCost'));
    if (!description) {
        showToast('Add a change order description.', 'warning');
        return;
    }

    appState.changeOrders.push({ description, cost, createdAt: new Date().toISOString() });
    setValue('#changeDescription', '');
    setValue('#changeCost', '');
    recalculateEstimate();
    renderChangeOrders();
    renderEstimate();
    renderContractSummary();
    saveToStorage();
    showToast('Change order created.', 'success');
}

function addNote(event) {
    if (event) {
        event.preventDefault();
    }

    const content = valueOf('#noteContent');
    if (!content) {
        showToast('Enter a note before saving.', 'warning');
        return;
    }

    appState.notes.unshift({
        content,
        author: appState.currentUser.name || 'Estimator',
        createdAt: new Date().toISOString()
    });
    setValue('#noteContent', '');
    renderNotes();
    saveToStorage();
    showToast('Note added to project.', 'success');
}

function signOffProject(event) {
    if (event) {
        event.preventDefault();
    }

    persistVisibleState();
    appState.currentProject.status = inferProjectStatus();
    saveToStorage();
    showToast('Project sign-off saved.', 'success');
}

function generatePDF() {
    showToast('Opening print dialog for estimate PDF export.', 'info');
    window.print();
}

function lockPrice() {
    appState.currentEstimate.priceLocked = !appState.currentEstimate.priceLocked;
    saveToStorage();
    showToast(appState.currentEstimate.priceLocked ? 'Estimate price locked.' : 'Estimate price unlocked.', 'info');
}

function signContract() {
    appState.currentProject.status = 'active';
    saveToStorage();
    showToast('Contract marked as signed.', 'success');
}

function uploadDrawing(event) {
    if (event) {
        event.preventDefault();
    }

    const input = $('#drawingFile');
    const file = input?.files?.[0];
    if (!file) {
        showToast('Choose a drawing file to upload.', 'warning');
        return;
    }

    appState.drawings.push({ name: file.name, size: file.size, uploadedAt: new Date().toISOString() });
    if (input) {
        input.value = '';
    }
    saveToStorage();
    showToast(`Drawing uploaded: ${file.name}`, 'success');
}

function startDrawing() {
    showToast('Draw directly on the layout canvas.', 'info');
}

function clearCanvas() {
    appState.currentProject.layout.strokes = [];
    redrawLayoutCanvas();
    saveToStorage();
    showToast('Layout canvas cleared.', 'info');
}

function saveDrawing() {
    saveToStorage();
    showToast('Layout drawing saved.', 'success');
}

function beginDrawing(event) {
    const canvas = $('#layoutCanvas');
    if (!canvas || !drawingContext) {
        return;
    }

    event.preventDefault();
    isDrawing = true;
    currentStroke = [];
    const point = getCanvasPoint(event, canvas);
    currentStroke.push(point);
}

function drawStroke(event) {
    const canvas = $('#layoutCanvas');
    if (!isDrawing || !canvas || !drawingContext) {
        return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event, canvas);
    currentStroke.push(point);
    redrawLayoutCanvas();
    drawStrokePath(currentStroke, true);
}

function endDrawing() {
    if (!isDrawing) {
        return;
    }

    isDrawing = false;
    if (currentStroke.length > 1) {
        appState.currentProject.layout.strokes.push(currentStroke.slice());
        saveToStorage();
    }
    currentStroke = [];
    redrawLayoutCanvas();
}

function getCanvasPoint(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top
    };
}

function redrawLayoutCanvas() {
    const canvas = $('#layoutCanvas');
    if (!canvas || !drawingContext) {
        return;
    }

    drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    drawingContext.fillStyle = '#ffffff';
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    drawingContext.strokeStyle = '#d8e1ec';
    drawingContext.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += 20) {
        drawingContext.beginPath();
        drawingContext.moveTo(x, 0);
        drawingContext.lineTo(x, canvas.height);
        drawingContext.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 20) {
        drawingContext.beginPath();
        drawingContext.moveTo(0, y);
        drawingContext.lineTo(canvas.width, y);
        drawingContext.stroke();
    }

    appState.currentProject.layout.strokes.forEach((stroke) => drawStrokePath(stroke, false));
}

function drawStrokePath(points, preview) {
    if (!drawingContext || !points.length) {
        return;
    }

    drawingContext.beginPath();
    drawingContext.strokeStyle = preview ? '#FF6B35' : '#0FA89F';
    drawingContext.lineWidth = 3;
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    drawingContext.moveTo(points[0].x, points[0].y);

    points.slice(1).forEach((point) => {
        drawingContext.lineTo(point.x, point.y);
    });

    drawingContext.stroke();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
