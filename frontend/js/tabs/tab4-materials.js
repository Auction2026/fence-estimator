(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'materials' };
    const fieldMap = {
        fabricRolls: { id: 'materials-fabric-rolls', label: 'Fabric Rolls', required: false, type: 'number' },
        topRailFeet: { id: 'materials-top-rail-feet', label: 'Top Rail Length (ft)', required: false, type: 'number' },
        linePosts: { id: 'materials-line-posts', label: 'Line Posts', required: false, type: 'number' },
        terminalPosts: { id: 'materials-terminal-posts', label: 'Terminal Posts', required: false, type: 'number' },
        gateFrames: { id: 'materials-gate-frames', label: 'Gate Frames', required: false, type: 'number' },
        concreteBags: { id: 'materials-concrete-bags', label: 'Concrete Bags', required: false, type: 'number' },
        tensionBars: { id: 'materials-tension-bars', label: 'Tension Bars', required: false, type: 'number' },
        tensionBands: { id: 'materials-tension-bands', label: 'Tension Bands', required: false, type: 'number' },
        braceBands: { id: 'materials-brace-bands', label: 'Brace Bands', required: false, type: 'number' },
        hogRings: { id: 'materials-hog-rings', label: 'Hog Rings', required: false, type: 'number' },
        capsFittings: { id: 'materials-caps-fittings', label: 'Caps / Fittings', required: false, type: 'number' },
        wasteFactor: { id: 'materials-waste-factor', label: 'Waste Factor (%)', required: false, type: 'number' },
        packageNotes: { id: 'materials-package-notes', label: 'Material Package Notes', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('materials-table', (rows || []).map((row) => ({ Item: row.item, Quantity: row.quantity, Unit: row.unit, 'Unit Cost': FenceDepot.UI.formatCurrency(row.unitCost), Extended: FenceDepot.UI.formatCurrency(row.extended) })));
    }

    module.init = function init() {
        document.querySelectorAll('[id^=survey-],[id^=specs-],[id^=materials-],[id^=labor-],[id^=equipment-]').forEach((element) => element.addEventListener('input', () => FenceDepot.recalculateEstimate?.()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('materials-fabric-rolls')) document.getElementById('materials-fabric-rolls').value = data.fabricRolls ?? ''; 
        if (document.getElementById('materials-top-rail-feet')) document.getElementById('materials-top-rail-feet').value = data.topRailFeet ?? ''; 
        if (document.getElementById('materials-line-posts')) document.getElementById('materials-line-posts').value = data.linePosts ?? ''; 
        if (document.getElementById('materials-terminal-posts')) document.getElementById('materials-terminal-posts').value = data.terminalPosts ?? ''; 
        if (document.getElementById('materials-gate-frames')) document.getElementById('materials-gate-frames').value = data.gateFrames ?? ''; 
        if (document.getElementById('materials-concrete-bags')) document.getElementById('materials-concrete-bags').value = data.concreteBags ?? ''; 
        if (document.getElementById('materials-tension-bars')) document.getElementById('materials-tension-bars').value = data.tensionBars ?? ''; 
        if (document.getElementById('materials-tension-bands')) document.getElementById('materials-tension-bands').value = data.tensionBands ?? ''; 
        if (document.getElementById('materials-brace-bands')) document.getElementById('materials-brace-bands').value = data.braceBands ?? ''; 
        if (document.getElementById('materials-hog-rings')) document.getElementById('materials-hog-rings').value = data.hogRings ?? ''; 
        if (document.getElementById('materials-caps-fittings')) document.getElementById('materials-caps-fittings').value = data.capsFittings ?? ''; 
        if (document.getElementById('materials-waste-factor')) document.getElementById('materials-waste-factor').value = data.wasteFactor ?? ''; 
        if (document.getElementById('materials-package-notes')) document.getElementById('materials-package-notes').value = data.packageNotes ?? ''; 
        renderTable(data.breakdown || []);
    };

    module.save = function save() {
        const data = {
            fabricRolls: document.getElementById('materials-fabric-rolls')?.value ?? '',
            topRailFeet: document.getElementById('materials-top-rail-feet')?.value ?? '',
            linePosts: document.getElementById('materials-line-posts')?.value ?? '',
            terminalPosts: document.getElementById('materials-terminal-posts')?.value ?? '',
            gateFrames: document.getElementById('materials-gate-frames')?.value ?? '',
            concreteBags: document.getElementById('materials-concrete-bags')?.value ?? '',
            tensionBars: document.getElementById('materials-tension-bars')?.value ?? '',
            tensionBands: document.getElementById('materials-tension-bands')?.value ?? '',
            braceBands: document.getElementById('materials-brace-bands')?.value ?? '',
            hogRings: document.getElementById('materials-hog-rings')?.value ?? '',
            capsFittings: document.getElementById('materials-caps-fittings')?.value ?? '',
            wasteFactor: document.getElementById('materials-waste-factor')?.value ?? '',
            packageNotes: document.getElementById('materials-package-notes')?.value ?? ''
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

    FenceDepot.MaterialsTab = module;
})();
