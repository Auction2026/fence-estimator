(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'inventory' };
    const fieldMap = {
        searchSku: { id: 'inventory-search-sku', label: 'Search SKU', required: false, type: 'text' },
        category: { id: 'inventory-category', label: 'Inventory Category', required: false, type: 'text' },
        requiredQuantity: { id: 'inventory-required-quantity', label: 'Required Quantity', required: false, type: 'number' },
        notes: { id: 'inventory-notes', label: 'Procurement Notes', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('inventory-table', (rows || []).map((row) => ({ SKU: row.sku || row.SKU, Description: row.description || row.Description, Category: row.category || row.Category, Qty: row.quantity || row.Qty, 'Unit Cost': FenceDepot.UI.formatCurrency(row.unitCost || 0) })));
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('inventory-search-sku')) document.getElementById('inventory-search-sku').value = data.searchSku ?? ''; 
        if (document.getElementById('inventory-category')) document.getElementById('inventory-category').value = data.category ?? ''; 
        if (document.getElementById('inventory-required-quantity')) document.getElementById('inventory-required-quantity').value = data.requiredQuantity ?? ''; 
        if (document.getElementById('inventory-notes')) document.getElementById('inventory-notes').value = data.notes ?? ''; 
        renderTable(data.list || []);
    };

    module.save = function save() {
        const data = {
            searchSku: document.getElementById('inventory-search-sku')?.value ?? '',
            category: document.getElementById('inventory-category')?.value ?? '',
            requiredQuantity: document.getElementById('inventory-required-quantity')?.value ?? '',
            notes: document.getElementById('inventory-notes')?.value ?? ''
        };
        return data;
    };

    module.validate = function validate() {
        const data = module.save();
        return FenceDepot.Validation.validateFieldsMap(fieldMap);
    };

    module.reset = function reset() {
        Object.values(fieldMap).forEach((config) => {
            const element = document.getElementById(config.id);
            if (!element) return;
            if (element.type === 'checkbox') element.checked = false;
            else element.value = '';
        });
    };

    module.getFieldMap = function getFieldMap() { return fieldMap; };
    module.applyDefaults = function applyDefaults(defaults = {}) { module.load({ ...defaults }); };
    module.collectSummary = function collectSummary() { const data = module.save(); return Object.entries(data).filter(([, value]) => value !== '' && value !== false && value != null); };

    module.helper1 = function helper1(value) {
        return value;
    };

    module.helper2 = function helper2(value) {
        return value;
    };

    module.helper3 = function helper3(value) {
        return value;
    };

    module.helper4 = function helper4(value) {
        return value;
    };

    module.helper5 = function helper5(value) {
        return value;
    };

    module.helper6 = function helper6(value) {
        return value;
    };

    module.helper7 = function helper7(value) {
        return value;
    };

    module.helper8 = function helper8(value) {
        return value;
    };

    module.helper9 = function helper9(value) {
        return value;
    };

    module.helper10 = function helper10(value) {
        return value;
    };

    module.helper11 = function helper11(value) {
        return value;
    };

    module.helper12 = function helper12(value) {
        return value;
    };

    module.helper13 = function helper13(value) {
        return value;
    };

    module.helper14 = function helper14(value) {
        return value;
    };

    module.helper15 = function helper15(value) {
        return value;
    };

    module.helper16 = function helper16(value) {
        return value;
    };

    module.helper17 = function helper17(value) {
        return value;
    };

    FenceDepot.InventoryTab = module;
})();
