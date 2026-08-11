(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'notes' };
    const fieldMap = {
        title: { id: 'notes-title', label: 'Note Title', required: false, type: 'text' },
        category: { id: 'notes-category', label: 'Category', required: false, type: 'text' },
        content: { id: 'notes-content', label: 'Note Content', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('notes-table', (rows || []).map((row) => ({ Title: row.title || row.Title, Category: row.category || row.Category, Usage: row.usageCount || 0, 'Last Used': row.lastUsed || '—' })));
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('notes-title')) document.getElementById('notes-title').value = data.title ?? ''; 
        if (document.getElementById('notes-category')) document.getElementById('notes-category').value = data.category ?? ''; 
        if (document.getElementById('notes-content')) document.getElementById('notes-content').value = data.content ?? ''; 
        renderTable(data.list || FenceDepot.Storage.loadCollection('notes') || []);
    };

    module.save = function save() {
        const data = {
            title: document.getElementById('notes-title')?.value ?? '',
            category: document.getElementById('notes-category')?.value ?? '',
            content: document.getElementById('notes-content')?.value ?? ''
        };
        data.noteId = data.noteId || `NOTE-${Date.now()}`;
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

    FenceDepot.NotesTab = module;
})();
