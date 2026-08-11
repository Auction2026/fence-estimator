(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'project' };
    const fieldMap = {
        customerName: { id: 'project-customer-name', label: 'Customer Name', required: true, type: 'text' },
        customerEmail: { id: 'project-customer-email', label: 'Customer Email', required: true, type: 'email' },
        customerPhone: { id: 'project-customer-phone', label: 'Customer Phone', required: true, type: 'phone' },
        projectId: { id: 'project-id', label: 'Project ID', required: false, type: 'text' },
        address: { id: 'project-address', label: 'Site Address', required: true, type: 'text' },
        city: { id: 'project-city', label: 'City', required: true, type: 'text' },
        province: { id: 'project-province', label: 'Province / State', required: true, type: 'text' },
        postalCode: { id: 'project-postal-code', label: 'Postal / ZIP Code', required: true, type: 'text' },
        propertySize: { id: 'project-property-size', label: 'Property Size', required: false, type: 'text' },
        leadSource: { id: 'project-lead-source', label: 'Lead Source', required: false, type: 'text' },
        contactDate: { id: 'project-contact-date', label: 'Preferred Contact Date', required: false, type: 'text' },
        contactTime: { id: 'project-contact-time', label: 'Preferred Contact Time', required: false, type: 'text' },
        projectNotes: { id: 'project-notes', label: 'Project Notes', required: false, type: 'text' },
        accessNotes: { id: 'project-access-notes', label: 'Access Instructions', required: false, type: 'text' }
    };

    module.init = function init() {
        document.getElementById('project-customer-name')?.addEventListener('input', () => { document.getElementById('snapshot-customer-name').textContent = document.getElementById('project-customer-name').value || 'Pending'; });
    };

    module.load = function load(data = {}) {
        if (document.getElementById('project-customer-name')) document.getElementById('project-customer-name').value = data.customerName ?? ''; 
        if (document.getElementById('project-customer-email')) document.getElementById('project-customer-email').value = data.customerEmail ?? ''; 
        if (document.getElementById('project-customer-phone')) document.getElementById('project-customer-phone').value = data.customerPhone ?? ''; 
        if (document.getElementById('project-id')) document.getElementById('project-id').value = data.projectId ?? ''; 
        if (document.getElementById('project-address')) document.getElementById('project-address').value = data.address ?? ''; 
        if (document.getElementById('project-city')) document.getElementById('project-city').value = data.city ?? ''; 
        if (document.getElementById('project-province')) document.getElementById('project-province').value = data.province ?? ''; 
        if (document.getElementById('project-postal-code')) document.getElementById('project-postal-code').value = data.postalCode ?? ''; 
        if (document.getElementById('project-property-size')) document.getElementById('project-property-size').value = data.propertySize ?? ''; 
        if (document.getElementById('project-lead-source')) document.getElementById('project-lead-source').value = data.leadSource ?? ''; 
        if (document.getElementById('project-contact-date')) document.getElementById('project-contact-date').value = data.contactDate ?? ''; 
        if (document.getElementById('project-contact-time')) document.getElementById('project-contact-time').value = data.contactTime ?? ''; 
        if (document.getElementById('project-notes')) document.getElementById('project-notes').value = data.projectNotes ?? ''; 
        if (document.getElementById('project-access-notes')) document.getElementById('project-access-notes').value = data.accessNotes ?? ''; 
    };

    module.save = function save() {
        const data = {
            customerName: document.getElementById('project-customer-name')?.value ?? '',
            customerEmail: document.getElementById('project-customer-email')?.value ?? '',
            customerPhone: document.getElementById('project-customer-phone')?.value ?? '',
            projectId: document.getElementById('project-id')?.value ?? '',
            address: document.getElementById('project-address')?.value ?? '',
            city: document.getElementById('project-city')?.value ?? '',
            province: document.getElementById('project-province')?.value ?? '',
            postalCode: document.getElementById('project-postal-code')?.value ?? '',
            propertySize: document.getElementById('project-property-size')?.value ?? '',
            leadSource: document.getElementById('project-lead-source')?.value ?? '',
            contactDate: document.getElementById('project-contact-date')?.value ?? '',
            contactTime: document.getElementById('project-contact-time')?.value ?? '',
            projectNotes: document.getElementById('project-notes')?.value ?? '',
            accessNotes: document.getElementById('project-access-notes')?.value ?? ''
        };
        return data;
    };

    module.validate = function validate() {
        const data = module.save();
        return FenceDepot.Validation.validateProject(data).valid;
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

    FenceDepot.ProjectTab = module;
})();
