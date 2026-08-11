(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'photos' };
    const fieldMap = {
        upload: { id: 'photos-upload', label: 'Photo File Input', required: false, type: 'text' },
        droneCount: { id: 'photos-drone-count', label: 'Drone Photos Count', required: false, type: 'number' },
        gateCount: { id: 'photos-gate-count', label: 'Gate Opening Photos', required: false, type: 'number' },
        obstacleCount: { id: 'photos-obstacle-count', label: 'Obstacle Photos', required: false, type: 'number' },
        notes: { id: 'photos-notes', label: 'Photo Captions / Notes', required: false, type: 'text' }
    };

    function normalizeFiles(files) {
        return Array.from(files || []).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    }

    module.init = function init() {
        document.getElementById('photos-upload')?.addEventListener('change', module.handleFiles);
    };

    module.load = function load(data = {}) {
        if (document.getElementById('photos-upload')) document.getElementById('photos-upload').value = data.upload ?? ''; 
        if (document.getElementById('photos-drone-count')) document.getElementById('photos-drone-count').value = data.droneCount ?? ''; 
        if (document.getElementById('photos-gate-count')) document.getElementById('photos-gate-count').value = data.gateCount ?? ''; 
        if (document.getElementById('photos-obstacle-count')) document.getElementById('photos-obstacle-count').value = data.obstacleCount ?? ''; 
        if (document.getElementById('photos-notes')) document.getElementById('photos-notes').value = data.notes ?? ''; 
        FenceDepot.UI.renderPhotoPreview(data.files || []);
    };

    module.save = function save() {
        const data = {
            upload: document.getElementById('photos-upload')?.value ?? '',
            droneCount: document.getElementById('photos-drone-count')?.value ?? '',
            gateCount: document.getElementById('photos-gate-count')?.value ?? '',
            obstacleCount: document.getElementById('photos-obstacle-count')?.value ?? '',
            notes: document.getElementById('photos-notes')?.value ?? ''
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

    module.handleFiles = function handleFiles(event) { const files = normalizeFiles(event.target.files); FenceDepot.appState.photos = FenceDepot.appState.photos || {}; FenceDepot.appState.photos.files = files; FenceDepot.UI.renderPhotoPreview(files); };

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

    FenceDepot.PhotosTab = module;
})();
