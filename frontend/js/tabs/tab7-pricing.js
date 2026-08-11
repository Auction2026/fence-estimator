(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'pricing' };
    const fieldMap = {
        markup: { id: 'pricing-markup', label: 'Markup (%)', required: false, type: 'number' },
        overhead: { id: 'pricing-overhead', label: 'Overhead (%)', required: false, type: 'number' },
        discount: { id: 'pricing-discount', label: 'Discount (%)', required: false, type: 'number' },
        taxRate: { id: 'pricing-tax-rate', label: 'Sales Tax (%)', required: false, type: 'number' },
        permitCost: { id: 'pricing-permit-cost', label: 'Permit Cost', required: false, type: 'number' },
        utilityCost: { id: 'pricing-utility-cost', label: 'Utility Locate Cost', required: false, type: 'number' },
        contingency: { id: 'pricing-contingency', label: 'Contingency', required: false, type: 'number' },
        freight: { id: 'pricing-freight', label: 'Freight', required: false, type: 'number' },
        disposal: { id: 'pricing-disposal', label: 'Disposal', required: false, type: 'number' },
        subcontractor: { id: 'pricing-subcontractor', label: 'Subcontractor Allowance', required: false, type: 'number' },
        depositPercent: { id: 'pricing-deposit-percent', label: 'Deposit Required (%)', required: false, type: 'number' },
        validThrough: { id: 'pricing-valid-through', label: 'Price Valid Through', required: false, type: 'text' },
        assumptions: { id: 'pricing-assumptions', label: 'Pricing Assumptions', required: false, type: 'text' }
    };

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('pricing-markup')) document.getElementById('pricing-markup').value = data.markup ?? ''; 
        if (document.getElementById('pricing-overhead')) document.getElementById('pricing-overhead').value = data.overhead ?? ''; 
        if (document.getElementById('pricing-discount')) document.getElementById('pricing-discount').value = data.discount ?? ''; 
        if (document.getElementById('pricing-tax-rate')) document.getElementById('pricing-tax-rate').value = data.taxRate ?? ''; 
        if (document.getElementById('pricing-permit-cost')) document.getElementById('pricing-permit-cost').value = data.permitCost ?? ''; 
        if (document.getElementById('pricing-utility-cost')) document.getElementById('pricing-utility-cost').value = data.utilityCost ?? ''; 
        if (document.getElementById('pricing-contingency')) document.getElementById('pricing-contingency').value = data.contingency ?? ''; 
        if (document.getElementById('pricing-freight')) document.getElementById('pricing-freight').value = data.freight ?? ''; 
        if (document.getElementById('pricing-disposal')) document.getElementById('pricing-disposal').value = data.disposal ?? ''; 
        if (document.getElementById('pricing-subcontractor')) document.getElementById('pricing-subcontractor').value = data.subcontractor ?? ''; 
        if (document.getElementById('pricing-deposit-percent')) document.getElementById('pricing-deposit-percent').value = data.depositPercent ?? ''; 
        if (document.getElementById('pricing-valid-through')) document.getElementById('pricing-valid-through').value = data.validThrough ?? ''; 
        if (document.getElementById('pricing-assumptions')) document.getElementById('pricing-assumptions').value = data.assumptions ?? ''; 
        document.getElementById('pricing-direct-cost').textContent = FenceDepot.UI.formatCurrency(data.directCost || 0);
        document.getElementById('pricing-tax-value').textContent = FenceDepot.UI.formatCurrency(data.tax || 0);
        document.getElementById('pricing-total-value').textContent = FenceDepot.UI.formatCurrency(data.total || 0);
    };

    module.save = function save() {
        const data = {
            markup: document.getElementById('pricing-markup')?.value ?? '',
            overhead: document.getElementById('pricing-overhead')?.value ?? '',
            discount: document.getElementById('pricing-discount')?.value ?? '',
            taxRate: document.getElementById('pricing-tax-rate')?.value ?? '',
            permitCost: document.getElementById('pricing-permit-cost')?.value ?? '',
            utilityCost: document.getElementById('pricing-utility-cost')?.value ?? '',
            contingency: document.getElementById('pricing-contingency')?.value ?? '',
            freight: document.getElementById('pricing-freight')?.value ?? '',
            disposal: document.getElementById('pricing-disposal')?.value ?? '',
            subcontractor: document.getElementById('pricing-subcontractor')?.value ?? '',
            depositPercent: document.getElementById('pricing-deposit-percent')?.value ?? '',
            validThrough: document.getElementById('pricing-valid-through')?.value ?? '',
            assumptions: document.getElementById('pricing-assumptions')?.value ?? ''
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

    FenceDepot.PricingTab = module;
})();
