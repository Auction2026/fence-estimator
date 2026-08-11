(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'survey' };
    const fieldMap = {
        linearFeet: { id: 'survey-linear-feet', label: 'Linear Feet Measured', required: true, type: 'number' },
        cornerPosts: { id: 'survey-corner-posts', label: 'Corner Posts', required: false, type: 'number' },
        linePosts: { id: 'survey-line-posts', label: 'Line Posts', required: false, type: 'number' },
        terminalPosts: { id: 'survey-terminal-posts', label: 'Terminal Posts', required: false, type: 'number' },
        terrainType: { id: 'survey-terrain-type', label: 'Terrain Type', required: false, type: 'text' },
        soilCondition: { id: 'survey-soil-condition', label: 'Soil Condition', required: false, type: 'text' },
        utilityStatus: { id: 'survey-utility-status', label: 'Utility Locate Status', required: false, type: 'text' },
        boundaryVerified: { id: 'survey-boundary-verified', label: 'Property Line Verified', required: false, type: 'text' },
        gradeChange: { id: 'survey-grade-change', label: 'Grade Change (ft)', required: false, type: 'number' },
        obstaclesCount: { id: 'survey-obstacles-count', label: 'Obstacles Count', required: false, type: 'number' },
        treeRemoval: { id: 'survey-tree-removal', label: 'Tree Removal Allowance', required: false, type: 'number' },
        concreteRemoval: { id: 'survey-concrete-removal', label: 'Concrete Removal Allowance', required: false, type: 'number' },
        findings: { id: 'survey-findings', label: 'Survey Findings', required: false, type: 'text' },
        safetyNotes: { id: 'survey-safety-notes', label: 'Safety Notes', required: false, type: 'text' }
    };

    module.init = function init() {
        document.querySelectorAll('[id^=survey-],[id^=specs-],[id^=materials-],[id^=labor-],[id^=equipment-]').forEach((element) => element.addEventListener('input', () => FenceDepot.recalculateEstimate?.()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('survey-linear-feet')) document.getElementById('survey-linear-feet').value = data.linearFeet ?? ''; 
        if (document.getElementById('survey-corner-posts')) document.getElementById('survey-corner-posts').value = data.cornerPosts ?? ''; 
        if (document.getElementById('survey-line-posts')) document.getElementById('survey-line-posts').value = data.linePosts ?? ''; 
        if (document.getElementById('survey-terminal-posts')) document.getElementById('survey-terminal-posts').value = data.terminalPosts ?? ''; 
        if (document.getElementById('survey-terrain-type')) document.getElementById('survey-terrain-type').value = data.terrainType ?? ''; 
        if (document.getElementById('survey-soil-condition')) document.getElementById('survey-soil-condition').value = data.soilCondition ?? ''; 
        if (document.getElementById('survey-utility-status')) document.getElementById('survey-utility-status').value = data.utilityStatus ?? ''; 
        if (document.getElementById('survey-boundary-verified')) document.getElementById('survey-boundary-verified').value = data.boundaryVerified ?? ''; 
        if (document.getElementById('survey-grade-change')) document.getElementById('survey-grade-change').value = data.gradeChange ?? ''; 
        if (document.getElementById('survey-obstacles-count')) document.getElementById('survey-obstacles-count').value = data.obstaclesCount ?? ''; 
        if (document.getElementById('survey-tree-removal')) document.getElementById('survey-tree-removal').value = data.treeRemoval ?? ''; 
        if (document.getElementById('survey-concrete-removal')) document.getElementById('survey-concrete-removal').value = data.concreteRemoval ?? ''; 
        if (document.getElementById('survey-findings')) document.getElementById('survey-findings').value = data.findings ?? ''; 
        if (document.getElementById('survey-safety-notes')) document.getElementById('survey-safety-notes').value = data.safetyNotes ?? ''; 
    };

    module.save = function save() {
        const data = {
            linearFeet: document.getElementById('survey-linear-feet')?.value ?? '',
            cornerPosts: document.getElementById('survey-corner-posts')?.value ?? '',
            linePosts: document.getElementById('survey-line-posts')?.value ?? '',
            terminalPosts: document.getElementById('survey-terminal-posts')?.value ?? '',
            terrainType: document.getElementById('survey-terrain-type')?.value ?? '',
            soilCondition: document.getElementById('survey-soil-condition')?.value ?? '',
            utilityStatus: document.getElementById('survey-utility-status')?.value ?? '',
            boundaryVerified: document.getElementById('survey-boundary-verified')?.value ?? '',
            gradeChange: document.getElementById('survey-grade-change')?.value ?? '',
            obstaclesCount: document.getElementById('survey-obstacles-count')?.value ?? '',
            treeRemoval: document.getElementById('survey-tree-removal')?.value ?? '',
            concreteRemoval: document.getElementById('survey-concrete-removal')?.value ?? '',
            findings: document.getElementById('survey-findings')?.value ?? '',
            safetyNotes: document.getElementById('survey-safety-notes')?.value ?? ''
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

    FenceDepot.SurveyTab = module;
})();
