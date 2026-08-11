(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'specs' };
    const fieldMap = {
        fenceType: { id: 'specs-fence-type', label: 'Fence Type', required: true, type: 'text' },
        height: { id: 'specs-height', label: 'Fence Height (inches)', required: true, type: 'number' },
        color: { id: 'specs-color', label: 'Color', required: false, type: 'text' },
        meshGauge: { id: 'specs-mesh-gauge', label: 'Mesh Gauge', required: false, type: 'number' },
        postGauge: { id: 'specs-post-gauge', label: 'Post Gauge', required: false, type: 'number' },
        postDiameter: { id: 'specs-post-diameter', label: 'Post Diameter (inches)', required: false, type: 'number' },
        gateType: { id: 'specs-gate-type', label: 'Gate Type', required: false, type: 'text' },
        gateWidth: { id: 'specs-gate-width', label: 'Gate Width (feet)', required: false, type: 'number' },
        topRailSize: { id: 'specs-top-rail-size', label: 'Top Rail Size', required: false, type: 'text' },
        selvage: { id: 'specs-selvage', label: 'Fabric Selvage', required: false, type: 'text' },
        numberGates: { id: 'specs-number-gates', label: 'Number of Gates', required: false, type: 'number' },
        privacySlats: { id: 'specs-privacy-slats', label: 'Privacy Slat Coverage (%)', required: false, type: 'number' },
        specialRequirements: { id: 'specs-special-requirements', label: 'Special Requirements', required: false, type: 'text' },
        finishDetails: { id: 'specs-finish-details', label: 'Finish Details', required: false, type: 'text' }
    };

    module.init = function init() {
        document.querySelectorAll('[id^=survey-],[id^=specs-],[id^=materials-],[id^=labor-],[id^=equipment-]').forEach((element) => element.addEventListener('input', () => FenceDepot.recalculateEstimate?.()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('specs-fence-type')) document.getElementById('specs-fence-type').value = data.fenceType ?? ''; 
        if (document.getElementById('specs-height')) document.getElementById('specs-height').value = data.height ?? ''; 
        if (document.getElementById('specs-color')) document.getElementById('specs-color').value = data.color ?? ''; 
        if (document.getElementById('specs-mesh-gauge')) document.getElementById('specs-mesh-gauge').value = data.meshGauge ?? ''; 
        if (document.getElementById('specs-post-gauge')) document.getElementById('specs-post-gauge').value = data.postGauge ?? ''; 
        if (document.getElementById('specs-post-diameter')) document.getElementById('specs-post-diameter').value = data.postDiameter ?? ''; 
        if (document.getElementById('specs-gate-type')) document.getElementById('specs-gate-type').value = data.gateType ?? ''; 
        if (document.getElementById('specs-gate-width')) document.getElementById('specs-gate-width').value = data.gateWidth ?? ''; 
        if (document.getElementById('specs-top-rail-size')) document.getElementById('specs-top-rail-size').value = data.topRailSize ?? ''; 
        if (document.getElementById('specs-selvage')) document.getElementById('specs-selvage').value = data.selvage ?? ''; 
        if (document.getElementById('specs-number-gates')) document.getElementById('specs-number-gates').value = data.numberGates ?? ''; 
        if (document.getElementById('specs-privacy-slats')) document.getElementById('specs-privacy-slats').value = data.privacySlats ?? ''; 
        if (document.getElementById('specs-special-requirements')) document.getElementById('specs-special-requirements').value = data.specialRequirements ?? ''; 
        if (document.getElementById('specs-finish-details')) document.getElementById('specs-finish-details').value = data.finishDetails ?? ''; 
    };

    module.save = function save() {
        const data = {
            fenceType: document.getElementById('specs-fence-type')?.value ?? '',
            height: document.getElementById('specs-height')?.value ?? '',
            color: document.getElementById('specs-color')?.value ?? '',
            meshGauge: document.getElementById('specs-mesh-gauge')?.value ?? '',
            postGauge: document.getElementById('specs-post-gauge')?.value ?? '',
            postDiameter: document.getElementById('specs-post-diameter')?.value ?? '',
            gateType: document.getElementById('specs-gate-type')?.value ?? '',
            gateWidth: document.getElementById('specs-gate-width')?.value ?? '',
            topRailSize: document.getElementById('specs-top-rail-size')?.value ?? '',
            selvage: document.getElementById('specs-selvage')?.value ?? '',
            numberGates: document.getElementById('specs-number-gates')?.value ?? '',
            privacySlats: document.getElementById('specs-privacy-slats')?.value ?? '',
            specialRequirements: document.getElementById('specs-special-requirements')?.value ?? '',
            finishDetails: document.getElementById('specs-finish-details')?.value ?? ''
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

    FenceDepot.SpecsTab = module;
})();
