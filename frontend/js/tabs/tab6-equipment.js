(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const module = { stateKey: 'equipment' };
    const fieldMap = {
        augerDays: { id: 'equipment-auger-days', label: 'Auger Days', required: false, type: 'number' },
        skidDays: { id: 'equipment-skid-days', label: 'Skid Steer Days', required: false, type: 'number' },
        trailerDays: { id: 'equipment-trailer-days', label: 'Dump Trailer Days', required: false, type: 'number' },
        mixerDays: { id: 'equipment-mixer-days', label: 'Concrete Mixer Days', required: false, type: 'number' },
        generatorDays: { id: 'equipment-generator-days', label: 'Generator Days', required: false, type: 'number' },
        compactorDays: { id: 'equipment-compactor-days', label: 'Compactor Days', required: false, type: 'number' },
        fuelSurcharge: { id: 'equipment-fuel-surcharge', label: 'Fuel Surcharge', required: false, type: 'number' },
        deliveryCharge: { id: 'equipment-delivery-charge', label: 'Delivery Charge', required: false, type: 'number' },
        groundConditions: { id: 'equipment-ground-conditions', label: 'Ground Conditions', required: false, type: 'text' },
        spoilsHandling: { id: 'equipment-spoils-handling', label: 'Spoils Handling', required: false, type: 'text' },
        trafficDays: { id: 'equipment-traffic-days', label: 'Traffic Control Days', required: false, type: 'number' },
        liftDays: { id: 'equipment-lift-days', label: 'Lift Rental Days', required: false, type: 'number' },
        logistics: { id: 'equipment-logistics', label: 'Equipment Logistics', required: false, type: 'text' }
    };

    function renderTable(rows) {
        FenceDepot.UI.updateTable('equipment-table', (rows || []).map((row) => ({ Equipment: row.equipment, Days: row.days, Rate: row.rate === '-' ? '-' : FenceDepot.UI.formatCurrency(row.rate), Cost: FenceDepot.UI.formatCurrency(row.cost) })));
    }

    module.init = function init() {
        document.querySelectorAll('[id^=survey-],[id^=specs-],[id^=materials-],[id^=labor-],[id^=equipment-]').forEach((element) => element.addEventListener('input', () => FenceDepot.recalculateEstimate?.()));
    };

    module.load = function load(data = {}) {
        if (document.getElementById('equipment-auger-days')) document.getElementById('equipment-auger-days').value = data.augerDays ?? ''; 
        if (document.getElementById('equipment-skid-days')) document.getElementById('equipment-skid-days').value = data.skidDays ?? ''; 
        if (document.getElementById('equipment-trailer-days')) document.getElementById('equipment-trailer-days').value = data.trailerDays ?? ''; 
        if (document.getElementById('equipment-mixer-days')) document.getElementById('equipment-mixer-days').value = data.mixerDays ?? ''; 
        if (document.getElementById('equipment-generator-days')) document.getElementById('equipment-generator-days').value = data.generatorDays ?? ''; 
        if (document.getElementById('equipment-compactor-days')) document.getElementById('equipment-compactor-days').value = data.compactorDays ?? ''; 
        if (document.getElementById('equipment-fuel-surcharge')) document.getElementById('equipment-fuel-surcharge').value = data.fuelSurcharge ?? ''; 
        if (document.getElementById('equipment-delivery-charge')) document.getElementById('equipment-delivery-charge').value = data.deliveryCharge ?? ''; 
        if (document.getElementById('equipment-ground-conditions')) document.getElementById('equipment-ground-conditions').value = data.groundConditions ?? ''; 
        if (document.getElementById('equipment-spoils-handling')) document.getElementById('equipment-spoils-handling').value = data.spoilsHandling ?? ''; 
        if (document.getElementById('equipment-traffic-days')) document.getElementById('equipment-traffic-days').value = data.trafficDays ?? ''; 
        if (document.getElementById('equipment-lift-days')) document.getElementById('equipment-lift-days').value = data.liftDays ?? ''; 
        if (document.getElementById('equipment-logistics')) document.getElementById('equipment-logistics').value = data.logistics ?? ''; 
        renderTable(data.breakdown || []);
    };

    module.save = function save() {
        const data = {
            augerDays: document.getElementById('equipment-auger-days')?.value ?? '',
            skidDays: document.getElementById('equipment-skid-days')?.value ?? '',
            trailerDays: document.getElementById('equipment-trailer-days')?.value ?? '',
            mixerDays: document.getElementById('equipment-mixer-days')?.value ?? '',
            generatorDays: document.getElementById('equipment-generator-days')?.value ?? '',
            compactorDays: document.getElementById('equipment-compactor-days')?.value ?? '',
            fuelSurcharge: document.getElementById('equipment-fuel-surcharge')?.value ?? '',
            deliveryCharge: document.getElementById('equipment-delivery-charge')?.value ?? '',
            groundConditions: document.getElementById('equipment-ground-conditions')?.value ?? '',
            spoilsHandling: document.getElementById('equipment-spoils-handling')?.value ?? '',
            trafficDays: document.getElementById('equipment-traffic-days')?.value ?? '',
            liftDays: document.getElementById('equipment-lift-days')?.value ?? '',
            logistics: document.getElementById('equipment-logistics')?.value ?? ''
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

    FenceDepot.EquipmentTab = module;
})();
