(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'reports' };
    const fieldMap = {
        type: { id: 'reports-type', label: 'Report Type', required: false, type: 'text' },
        format: { id: 'reports-format', label: 'Format', required: false, type: 'text' },
        recipientEmail: { id: 'reports-recipient-email', label: 'Recipient Email', required: false, type: 'email' },
        notes: { id: 'reports-notes', label: 'Distribution Notes', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('reports-table', (rows || []).map((row) => ({ Report: row.type || row.Report, Format: row.format || row.Format, Recipient: row.recipientEmail || '—', Status: row.status || 'Generated' })));
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('reports-type')) document.getElementById('reports-type').value = data.type ?? ''; 
        if (document.getElementById('reports-format')) document.getElementById('reports-format').value = data.format ?? ''; 
        if (document.getElementById('reports-recipient-email')) document.getElementById('reports-recipient-email').value = data.recipientEmail ?? ''; 
        if (document.getElementById('reports-notes')) document.getElementById('reports-notes').value = data.notes ?? ''; 
        renderTable(data.history || []);
    };

    module.save = function save() {
        const data = {
            type: document.getElementById('reports-type')?.value ?? '',
            format: document.getElementById('reports-format')?.value ?? '',
            recipientEmail: document.getElementById('reports-recipient-email')?.value ?? '',
            notes: document.getElementById('reports-notes')?.value ?? ''
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

    FenceDepot.ReportsTab = module;
})();
