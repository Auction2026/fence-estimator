(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'changeOrders' };
    const fieldMap = {
        contractNumber: { id: 'change-contract-number', label: 'Contract Number', required: false, type: 'text' },
        orderNumber: { id: 'change-order-number', label: 'Change Order Number', required: false, type: 'text' },
        materialCost: { id: 'change-material-cost', label: 'Material Cost Change', required: false, type: 'number' },
        laborCost: { id: 'change-labor-cost', label: 'Labor Cost Change', required: false, type: 'number' },
        newTotal: { id: 'change-new-total', label: 'New Total', required: false, type: 'number' },
        timelineChange: { id: 'change-timeline-change', label: 'Timeline Change', required: false, type: 'text' },
        approvalStatus: { id: 'change-approval-status', label: 'Approval Status', required: false, type: 'text' },
        description: { id: 'change-description', label: 'Change Description', required: false, type: 'text' },
        reason: { id: 'change-reason', label: 'Reason for Change', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('change-orders-table', (rows || []).map((row) => ({ No: row.changeOrderNumber || row.No, Description: row.description || row.Description, Status: row.status || row.approvalStatus || row.Status, 'New Total': FenceDepot.UI.formatCurrency(row.newTotal || 0) })));
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('change-contract-number')) document.getElementById('change-contract-number').value = data.contractNumber ?? ''; 
        if (document.getElementById('change-order-number')) document.getElementById('change-order-number').value = data.orderNumber ?? ''; 
        if (document.getElementById('change-material-cost')) document.getElementById('change-material-cost').value = data.materialCost ?? ''; 
        if (document.getElementById('change-labor-cost')) document.getElementById('change-labor-cost').value = data.laborCost ?? ''; 
        if (document.getElementById('change-new-total')) document.getElementById('change-new-total').value = data.newTotal ?? ''; 
        if (document.getElementById('change-timeline-change')) document.getElementById('change-timeline-change').value = data.timelineChange ?? ''; 
        if (document.getElementById('change-approval-status')) document.getElementById('change-approval-status').value = data.approvalStatus ?? ''; 
        if (document.getElementById('change-description')) document.getElementById('change-description').value = data.description ?? ''; 
        if (document.getElementById('change-reason')) document.getElementById('change-reason').value = data.reason ?? ''; 
        renderTable(data.list || FenceDepot.Storage.loadCollection('changeOrders') || []);
    };

    module.save = function save() {
        const data = {
            contractNumber: document.getElementById('change-contract-number')?.value ?? '',
            orderNumber: document.getElementById('change-order-number')?.value ?? '',
            materialCost: document.getElementById('change-material-cost')?.value ?? '',
            laborCost: document.getElementById('change-labor-cost')?.value ?? '',
            newTotal: document.getElementById('change-new-total')?.value ?? '',
            timelineChange: document.getElementById('change-timeline-change')?.value ?? '',
            approvalStatus: document.getElementById('change-approval-status')?.value ?? '',
            description: document.getElementById('change-description')?.value ?? '',
            reason: document.getElementById('change-reason')?.value ?? ''
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

    FenceDepot.ChangeOrdersTab = module;
})();
