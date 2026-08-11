(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'labor' };
    const fieldMap = {
        crewSize: { id: 'labor-crew-size', label: 'Crew Size', required: false, type: 'number' },
        hours: { id: 'labor-hours', label: 'Estimated Hours', required: false, type: 'number' },
        hourlyRate: { id: 'labor-hourly-rate', label: 'Hourly Rate', required: false, type: 'number' },
        foremanHours: { id: 'labor-foreman-hours', label: 'Foreman Hours', required: false, type: 'number' },
        foremanRate: { id: 'labor-foreman-rate', label: 'Foreman Rate', required: false, type: 'number' },
        overtimeHours: { id: 'labor-overtime-hours', label: 'Overtime Hours', required: false, type: 'number' },
        overtimeRate: { id: 'labor-overtime-rate', label: 'Overtime Rate', required: false, type: 'number' },
        accessDifficulty: { id: 'labor-access-difficulty', label: 'Access Difficulty', required: false, type: 'text' },
        skillMix: { id: 'labor-skill-mix', label: 'Crew Skill Mix', required: false, type: 'text' },
        travelHours: { id: 'labor-travel-hours', label: 'Travel Hours', required: false, type: 'number' },
        mobilizations: { id: 'labor-mobilizations', label: 'Mobilizations', required: false, type: 'number' },
        perDiem: { id: 'labor-per-diem', label: 'Per Diem / Day', required: false, type: 'number' },
        scopeNotes: { id: 'labor-scope-notes', label: 'Labor Scope Notes', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('labor-table', (rows || []).map((row) => ({ Task: row.task, Hours: row.hours, Rate: row.rate === '-' ? '-' : FenceDepot.UI.formatCurrency(row.rate), Cost: FenceDepot.UI.formatCurrency(row.cost) })));
    }

    module.init = function init() {
        document.querySelectorAll('[id^=survey-],[id^=specs-],[id^=materials-],[id^=labor-],[id^=equipment-]').forEach((element) => element.addEventListener('input', () => FenceDepot.recalculateEstimate?.()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('labor-crew-size')) document.getElementById('labor-crew-size').value = data.crewSize ?? ''; 
        if (document.getElementById('labor-hours')) document.getElementById('labor-hours').value = data.hours ?? ''; 
        if (document.getElementById('labor-hourly-rate')) document.getElementById('labor-hourly-rate').value = data.hourlyRate ?? ''; 
        if (document.getElementById('labor-foreman-hours')) document.getElementById('labor-foreman-hours').value = data.foremanHours ?? ''; 
        if (document.getElementById('labor-foreman-rate')) document.getElementById('labor-foreman-rate').value = data.foremanRate ?? ''; 
        if (document.getElementById('labor-overtime-hours')) document.getElementById('labor-overtime-hours').value = data.overtimeHours ?? ''; 
        if (document.getElementById('labor-overtime-rate')) document.getElementById('labor-overtime-rate').value = data.overtimeRate ?? ''; 
        if (document.getElementById('labor-access-difficulty')) document.getElementById('labor-access-difficulty').value = data.accessDifficulty ?? ''; 
        if (document.getElementById('labor-skill-mix')) document.getElementById('labor-skill-mix').value = data.skillMix ?? ''; 
        if (document.getElementById('labor-travel-hours')) document.getElementById('labor-travel-hours').value = data.travelHours ?? ''; 
        if (document.getElementById('labor-mobilizations')) document.getElementById('labor-mobilizations').value = data.mobilizations ?? ''; 
        if (document.getElementById('labor-per-diem')) document.getElementById('labor-per-diem').value = data.perDiem ?? ''; 
        if (document.getElementById('labor-scope-notes')) document.getElementById('labor-scope-notes').value = data.scopeNotes ?? ''; 
        renderTable(data.breakdown || []);
    };

    module.save = function save() {
        const data = {
            crewSize: document.getElementById('labor-crew-size')?.value ?? '',
            hours: document.getElementById('labor-hours')?.value ?? '',
            hourlyRate: document.getElementById('labor-hourly-rate')?.value ?? '',
            foremanHours: document.getElementById('labor-foreman-hours')?.value ?? '',
            foremanRate: document.getElementById('labor-foreman-rate')?.value ?? '',
            overtimeHours: document.getElementById('labor-overtime-hours')?.value ?? '',
            overtimeRate: document.getElementById('labor-overtime-rate')?.value ?? '',
            accessDifficulty: document.getElementById('labor-access-difficulty')?.value ?? '',
            skillMix: document.getElementById('labor-skill-mix')?.value ?? '',
            travelHours: document.getElementById('labor-travel-hours')?.value ?? '',
            mobilizations: document.getElementById('labor-mobilizations')?.value ?? '',
            perDiem: document.getElementById('labor-per-diem')?.value ?? '',
            scopeNotes: document.getElementById('labor-scope-notes')?.value ?? ''
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

    FenceDepot.LaborTab = module;
})();
