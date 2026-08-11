(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'signoff' };
    const fieldMap = {
        companyRep: { id: 'signoff-company-rep', label: 'Company Representative', required: false, type: 'text' },
        completionDate: { id: 'signoff-completion-date', label: 'Completion Date', required: false, type: 'text' },
        warrantyStart: { id: 'signoff-warranty-start', label: 'Warranty Start Date', required: false, type: 'text' },
        maintenanceDate: { id: 'signoff-maintenance-date', label: 'Next Maintenance Date', required: false, type: 'text' },
        outstandingItems: { id: 'signoff-outstanding-items', label: 'Outstanding Items', required: false, type: 'text' },
        customerComments: { id: 'signoff-customer-comments', label: 'Customer Comments', required: false, type: 'text' },
        inspectionPassed: { id: 'signoff-inspection-passed', label: 'Fence inspection passed', required: false, type: 'checkbox' },
        customerWalkthrough: { id: 'signoff-customer-walkthrough', label: 'Customer walkthrough completed', required: false, type: 'checkbox' },
        warrantyExplained: { id: 'signoff-warranty-explained', label: 'Warranty explained to customer', required: false, type: 'checkbox' },
        followUpNeeded: { id: 'signoff-follow-up-needed', label: 'Follow-up visit required', required: false, type: 'checkbox' },
        customerSigned: { id: 'signoff-customer-signed', label: 'Customer signature captured', required: false, type: 'checkbox' },
        companySigned: { id: 'signoff-company-signed', label: 'Company representative signed', required: false, type: 'checkbox' }
    };

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('signoff-company-rep')) document.getElementById('signoff-company-rep').value = data.companyRep ?? ''; 
        if (document.getElementById('signoff-completion-date')) document.getElementById('signoff-completion-date').value = data.completionDate ?? ''; 
        if (document.getElementById('signoff-warranty-start')) document.getElementById('signoff-warranty-start').value = data.warrantyStart ?? ''; 
        if (document.getElementById('signoff-maintenance-date')) document.getElementById('signoff-maintenance-date').value = data.maintenanceDate ?? ''; 
        if (document.getElementById('signoff-outstanding-items')) document.getElementById('signoff-outstanding-items').value = data.outstandingItems ?? ''; 
        if (document.getElementById('signoff-customer-comments')) document.getElementById('signoff-customer-comments').value = data.customerComments ?? ''; 
        if (document.getElementById('signoff-inspection-passed')) document.getElementById('signoff-inspection-passed').checked = Boolean(data.inspectionPassed);
        if (document.getElementById('signoff-customer-walkthrough')) document.getElementById('signoff-customer-walkthrough').checked = Boolean(data.customerWalkthrough);
        if (document.getElementById('signoff-warranty-explained')) document.getElementById('signoff-warranty-explained').checked = Boolean(data.warrantyExplained);
        if (document.getElementById('signoff-follow-up-needed')) document.getElementById('signoff-follow-up-needed').checked = Boolean(data.followUpNeeded);
        if (document.getElementById('signoff-customer-signed')) document.getElementById('signoff-customer-signed').checked = Boolean(data.customerSigned);
        if (document.getElementById('signoff-company-signed')) document.getElementById('signoff-company-signed').checked = Boolean(data.companySigned);
    };

    module.save = function save() {
        const data = {
            companyRep: document.getElementById('signoff-company-rep')?.value ?? '',
            completionDate: document.getElementById('signoff-completion-date')?.value ?? '',
            warrantyStart: document.getElementById('signoff-warranty-start')?.value ?? '',
            maintenanceDate: document.getElementById('signoff-maintenance-date')?.value ?? '',
            outstandingItems: document.getElementById('signoff-outstanding-items')?.value ?? '',
            customerComments: document.getElementById('signoff-customer-comments')?.value ?? '',
            inspectionPassed: document.getElementById('signoff-inspection-passed')?.checked || false,
            customerWalkthrough: document.getElementById('signoff-customer-walkthrough')?.checked || false,
            warrantyExplained: document.getElementById('signoff-warranty-explained')?.checked || false,
            followUpNeeded: document.getElementById('signoff-follow-up-needed')?.checked || false,
            customerSigned: document.getElementById('signoff-customer-signed')?.checked || false,
            companySigned: document.getElementById('signoff-company-signed')?.checked || false
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

    FenceDepot.SignOffTab = module;
})();
