(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'summary' };
    const fieldMap = {
        estimateNumber: { id: 'summary-estimate-number', label: 'Estimate Number', required: false, type: 'text' },
        preparedBy: { id: 'summary-prepared-by', label: 'Prepared By', required: false, type: 'text' },
        preparedDate: { id: 'summary-prepared-date', label: 'Prepared Date', required: false, type: 'text' },
        estimateStatus: { id: 'summary-estimate-status', label: 'Estimate Status', required: false, type: 'text' },
        executiveSummary: { id: 'summary-executive-summary', label: 'Executive Summary', required: false, type: 'text' },
        exclusions: { id: 'summary-exclusions', label: 'Exclusions', required: false, type: 'text' }
    };

    function renderTable(data) {
        FenceDepot.UI.updateTable('estimate-summary-table', [
            { Category: 'Materials', Amount: FenceDepot.UI.formatCurrency(FenceDepot.appState?.materials?.totals?.materialCost || 0), Notes: 'Calculated package' },
            { Category: 'Labor', Amount: FenceDepot.UI.formatCurrency(FenceDepot.appState?.labor?.totals?.laborCost || 0), Notes: 'Crew and supervision' },
            { Category: 'Equipment', Amount: FenceDepot.UI.formatCurrency(FenceDepot.appState?.equipment?.totals?.equipmentCost || 0), Notes: 'Rental and mobilization' },
            { Category: 'Subtotal', Amount: FenceDepot.UI.formatCurrency(data.subtotal || FenceDepot.appState?.pricing?.subtotal || 0), Notes: 'Before tax' },
            { Category: 'Tax', Amount: FenceDepot.UI.formatCurrency(data.tax || FenceDepot.appState?.pricing?.tax || 0), Notes: 'Based on pricing tab' },
            { Category: 'Total', Amount: FenceDepot.UI.formatCurrency(data.total || FenceDepot.appState?.pricing?.total || 0), Notes: 'Sell price' }
        ]);
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('summary-estimate-number')) document.getElementById('summary-estimate-number').value = data.estimateNumber ?? ''; 
        if (document.getElementById('summary-prepared-by')) document.getElementById('summary-prepared-by').value = data.preparedBy ?? ''; 
        if (document.getElementById('summary-prepared-date')) document.getElementById('summary-prepared-date').value = data.preparedDate ?? ''; 
        if (document.getElementById('summary-estimate-status')) document.getElementById('summary-estimate-status').value = data.estimateStatus ?? ''; 
        if (document.getElementById('summary-executive-summary')) document.getElementById('summary-executive-summary').value = data.executiveSummary ?? ''; 
        if (document.getElementById('summary-exclusions')) document.getElementById('summary-exclusions').value = data.exclusions ?? ''; 
        renderTable(data);
    };

    module.save = function save() {
        const data = {
            estimateNumber: document.getElementById('summary-estimate-number')?.value ?? '',
            preparedBy: document.getElementById('summary-prepared-by')?.value ?? '',
            preparedDate: document.getElementById('summary-prepared-date')?.value ?? '',
            estimateStatus: document.getElementById('summary-estimate-status')?.value ?? '',
            executiveSummary: document.getElementById('summary-executive-summary')?.value ?? '',
            exclusions: document.getElementById('summary-exclusions')?.value ?? ''
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

    FenceDepot.SummaryTab = module;
})();
