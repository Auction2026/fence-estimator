(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'schedule' };
    const fieldMap = {
        startDate: { id: 'schedule-start-date', label: 'Desired Start Date', required: false, type: 'text' },
        completionDate: { id: 'schedule-completion-date', label: 'Desired Completion Date', required: false, type: 'text' },
        durationDays: { id: 'schedule-duration-days', label: 'Estimated Duration (days)', required: false, type: 'number' },
        crewNeeded: { id: 'schedule-crew-needed', label: 'Crew Needed', required: false, type: 'number' },
        leadTime: { id: 'schedule-lead-time', label: 'Lead Time (days)', required: false, type: 'number' },
        permitStatus: { id: 'schedule-permit-status', label: 'Permit Status', required: false, type: 'text' },
        materialAvailability: { id: 'schedule-material-availability', label: 'Material Availability', required: false, type: 'text' },
        notes: { id: 'schedule-notes', label: 'Scheduling Notes', required: false, type: 'text' }
    };

    function updateTimeline(data) {
        const timeline = document.getElementById('schedule-timeline');
        if (!timeline) return;
        const rows = [`Start: ${data.startDate || 'TBD'}`, `Lead Time: ${data.leadTime || 0} days`, `Crew Needed: ${data.crewNeeded || 1}`, `Completion: ${data.completionDate || 'TBD'}`];
        timeline.innerHTML = rows.map((row, index) => `<div><strong>${index + 1}.</strong><span>${row}</span></div>`).join('');
    }

    module.init = function init() {
    };

    module.load = function load(data = {}) {
        if (document.getElementById('schedule-start-date')) document.getElementById('schedule-start-date').value = data.startDate ?? ''; 
        if (document.getElementById('schedule-completion-date')) document.getElementById('schedule-completion-date').value = data.completionDate ?? ''; 
        if (document.getElementById('schedule-duration-days')) document.getElementById('schedule-duration-days').value = data.durationDays ?? ''; 
        if (document.getElementById('schedule-crew-needed')) document.getElementById('schedule-crew-needed').value = data.crewNeeded ?? ''; 
        if (document.getElementById('schedule-lead-time')) document.getElementById('schedule-lead-time').value = data.leadTime ?? ''; 
        if (document.getElementById('schedule-permit-status')) document.getElementById('schedule-permit-status').value = data.permitStatus ?? ''; 
        if (document.getElementById('schedule-material-availability')) document.getElementById('schedule-material-availability').value = data.materialAvailability ?? ''; 
        if (document.getElementById('schedule-notes')) document.getElementById('schedule-notes').value = data.notes ?? ''; 
        updateTimeline(data);
    };

    module.save = function save() {
        const data = {
            startDate: document.getElementById('schedule-start-date')?.value ?? '',
            completionDate: document.getElementById('schedule-completion-date')?.value ?? '',
            durationDays: document.getElementById('schedule-duration-days')?.value ?? '',
            crewNeeded: document.getElementById('schedule-crew-needed')?.value ?? '',
            leadTime: document.getElementById('schedule-lead-time')?.value ?? '',
            permitStatus: document.getElementById('schedule-permit-status')?.value ?? '',
            materialAvailability: document.getElementById('schedule-material-availability')?.value ?? '',
            notes: document.getElementById('schedule-notes')?.value ?? ''
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

    FenceDepot.ScheduleTab = module;
})();
