(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'map' };
    const fieldMap = {
        latitude: { id: 'map-latitude', label: 'Latitude', required: false, type: 'number' },
        longitude: { id: 'map-longitude', label: 'Longitude', required: false, type: 'number' },
        zoom: { id: 'map-zoom', label: 'Zoom', required: false, type: 'number' },
        notes: { id: 'map-notes', label: 'Mapping Notes', required: false, type: 'text' }
    };

    module.init = function init() {
        ['map-latitude','map-longitude','map-zoom'].forEach((id) => document.getElementById(id)?.addEventListener('input', () => FenceDepot.MappingTool?.loadMapFromInputs()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('map-latitude')) document.getElementById('map-latitude').value = data.latitude ?? ''; 
        if (document.getElementById('map-longitude')) document.getElementById('map-longitude').value = data.longitude ?? ''; 
        if (document.getElementById('map-zoom')) document.getElementById('map-zoom').value = data.zoom ?? ''; 
        if (document.getElementById('map-notes')) document.getElementById('map-notes').value = data.notes ?? ''; 
        FenceDepot.MappingTool?.loadMapFromInputs();
        if (data.drawingPoints) FenceDepot.DrawingTool?.loadPoints(data.drawingPoints);
    };

    module.save = function save() {
        const data = {
            latitude: document.getElementById('map-latitude')?.value ?? '',
            longitude: document.getElementById('map-longitude')?.value ?? '',
            zoom: document.getElementById('map-zoom')?.value ?? '',
            notes: document.getElementById('map-notes')?.value ?? ''
        };
        data.drawingPoints = FenceDepot.DrawingTool?.exportPoints?.() || [];
        data.drawingLength = FenceDepot.DrawingTool?.length?.() || 0;
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

    FenceDepot.MappingTab = module;
})();
