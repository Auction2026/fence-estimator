(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'contract' };
    const fieldMap = {
        number: { id: 'contract-number', label: 'Contract Number', required: false, type: 'text' },
        estimateNumber: { id: 'contract-estimate-number', label: 'Estimate Number', required: false, type: 'text' },
        depositAmount: { id: 'contract-deposit-amount', label: 'Deposit Amount', required: false, type: 'number' },
        timeline: { id: 'contract-timeline', label: 'Timeline', required: false, type: 'text' },
        warranty: { id: 'contract-warranty', label: 'Warranty', required: false, type: 'text' },
        scopeOfWork: { id: 'contract-scope-of-work', label: 'Scope of Work', required: false, type: 'text' },
        terms: { id: 'contract-terms', label: 'Terms and Conditions', required: false, type: 'text' },
        changeClause: { id: 'contract-change-clause', label: 'Change Order Clause', required: false, type: 'text' },
        customerApproved: { id: 'contract-customer-approved', label: 'Customer approved contract scope', required: false, type: 'checkbox' },
        pricingLocked: { id: 'contract-pricing-locked', label: 'Pricing is locked after contract issuance', required: false, type: 'checkbox' }
    };

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('contract-number')) document.getElementById('contract-number').value = data.number ?? ''; 
        if (document.getElementById('contract-estimate-number')) document.getElementById('contract-estimate-number').value = data.estimateNumber ?? ''; 
        if (document.getElementById('contract-deposit-amount')) document.getElementById('contract-deposit-amount').value = data.depositAmount ?? ''; 
        if (document.getElementById('contract-timeline')) document.getElementById('contract-timeline').value = data.timeline ?? ''; 
        if (document.getElementById('contract-warranty')) document.getElementById('contract-warranty').value = data.warranty ?? ''; 
        if (document.getElementById('contract-scope-of-work')) document.getElementById('contract-scope-of-work').value = data.scopeOfWork ?? ''; 
        if (document.getElementById('contract-terms')) document.getElementById('contract-terms').value = data.terms ?? ''; 
        if (document.getElementById('contract-change-clause')) document.getElementById('contract-change-clause').value = data.changeClause ?? ''; 
        if (document.getElementById('contract-customer-approved')) document.getElementById('contract-customer-approved').checked = Boolean(data.customerApproved);
        if (document.getElementById('contract-pricing-locked')) document.getElementById('contract-pricing-locked').checked = Boolean(data.pricingLocked);
    };

    module.save = function save() {
        const data = {
            number: document.getElementById('contract-number')?.value ?? '',
            estimateNumber: document.getElementById('contract-estimate-number')?.value ?? '',
            depositAmount: document.getElementById('contract-deposit-amount')?.value ?? '',
            timeline: document.getElementById('contract-timeline')?.value ?? '',
            warranty: document.getElementById('contract-warranty')?.value ?? '',
            scopeOfWork: document.getElementById('contract-scope-of-work')?.value ?? '',
            terms: document.getElementById('contract-terms')?.value ?? '',
            changeClause: document.getElementById('contract-change-clause')?.value ?? '',
            customerApproved: document.getElementById('contract-customer-approved')?.checked || false,
            pricingLocked: document.getElementById('contract-pricing-locked')?.checked || false
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

    FenceDepot.ContractTab = module;
})();
