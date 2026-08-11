(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const Calculations = {};
    const MATERIAL_COSTS = { fabricPerFoot: 4.85, linePost: 28, terminalPost: 42, topRailPerFoot: 2.2, concreteBag: 8.75, gateFrame: 185, hogRing: 0.18, tensionBand: 1.25, braceBand: 1.85, capFitting: 3.1, tensionBar: 14 };
    Calculations.calculateMaterials = function calculateMaterials(specs = {}) { const linearFeet = Number(specs.linearFeet || 0); const height = Number(specs.height || 48); const gateCount = Number(specs.numberGates || 0); const linePosts = Math.max(0, Math.ceil(linearFeet / 10) - 1); const terminalPosts = Math.max(2, Math.ceil(linearFeet / 100) + gateCount * 2); const topRailFeet = linearFeet * 1.04; const concreteBags = Math.ceil((linePosts * 1.5) + (terminalPosts * 2.25)); const tensionBars = terminalPosts + gateCount * 2; const tensionBands = terminalPosts * Math.max(4, Math.round(height / 12)); const braceBands = terminalPosts * 2; const hogRings = Math.ceil(linearFeet * 2.4); const capsFittings = linePosts + terminalPosts + gateCount * 4; const privacyFactor = Number(specs.privacySlats || 0) > 0 ? (1 + Number(specs.privacySlats || 0) / 100 * 0.35) : 1; const wasteFactor = 1 + (Number(specs.wasteFactor || 8) / 100); const items = [['Fabric', linearFeet * wasteFactor, 'ft', MATERIAL_COSTS.fabricPerFoot * (height / 48) * privacyFactor], ['Top Rail', topRailFeet * wasteFactor, 'ft', MATERIAL_COSTS.topRailPerFoot], ['Line Posts', linePosts, 'ea', MATERIAL_COSTS.linePost], ['Terminal Posts', terminalPosts, 'ea', MATERIAL_COSTS.terminalPost], ['Concrete Bags', concreteBags, 'bag', MATERIAL_COSTS.concreteBag], ['Gate Frames', gateCount, 'ea', MATERIAL_COSTS.gateFrame], ['Tension Bars', tensionBars, 'ea', MATERIAL_COSTS.tensionBar], ['Tension Bands', tensionBands, 'ea', MATERIAL_COSTS.tensionBand], ['Brace Bands', braceBands, 'ea', MATERIAL_COSTS.braceBand], ['Hog Rings', hogRings, 'ea', MATERIAL_COSTS.hogRing], ['Caps / Fittings', capsFittings, 'ea', MATERIAL_COSTS.capFitting]]; const breakdown = items.map(([item, quantity, unit, unitCost]) => ({ item, quantity: Math.round(quantity * 100) / 100, unit, unitCost: Math.round(unitCost * 100) / 100, extended: Math.round(quantity * unitCost * 100) / 100 })); const total = breakdown.reduce((sum, item) => sum + item.extended, 0); return { breakdown, totals: { materialCost: Math.round(total * 100) / 100, linePosts, terminalPosts, concreteBags, fabricRolls: Math.ceil(linearFeet / 50) } }; };
    Calculations.calculateLabor = function calculateLabor(specs = {}, hours = {}) { const linearFeet = Number(specs.linearFeet || 0); const baseHours = Math.max(linearFeet * 0.08, Number(hours.estimatedHours || hours.baseHours || 0)); const accessMultiplier = ({ easy: 1, moderate: 1.15, difficult: 1.35 })[hours.accessDifficulty || 'easy']; const skillMultiplier = ({ standard: 1, experienced: 0.95, specialty: 1.2 })[hours.skillMix || 'standard']; const travelHours = Number(hours.travelHours || 0); const mobilizationHours = Number(hours.mobilizations || 1) * 1.5; const adjustedHours = (baseHours * accessMultiplier * skillMultiplier) + travelHours + mobilizationHours; const hourlyRate = Number(hours.hourlyRate || 65); const foremanHours = Number(hours.foremanHours || Math.max(adjustedHours * 0.2, 2)); const foremanRate = Number(hours.foremanRate || 85); const overtimeHours = Number(hours.overtimeHours || 0); const overtimeRate = Number(hours.overtimeRate || hourlyRate * 1.5); const fieldLaborCost = adjustedHours * hourlyRate; const foremanCost = foremanHours * foremanRate; const overtimeCost = overtimeHours * overtimeRate; const perDiem = Number(hours.perDiem || 0) * Math.max(1, Math.ceil(adjustedHours / 8)); const total = fieldLaborCost + foremanCost + overtimeCost + perDiem; return { breakdown: [{ task: 'Fence installation crew', hours: adjustedHours.toFixed(2), rate: hourlyRate.toFixed(2), cost: fieldLaborCost.toFixed(2) }, { task: 'Foreman / supervision', hours: foremanHours.toFixed(2), rate: foremanRate.toFixed(2), cost: foremanCost.toFixed(2) }, { task: 'Overtime allowance', hours: overtimeHours.toFixed(2), rate: overtimeRate.toFixed(2), cost: overtimeCost.toFixed(2) }, { task: 'Per diem / travel', hours: '-', rate: '-', cost: perDiem.toFixed(2) }], totals: { laborHours: Math.round((adjustedHours + foremanHours + overtimeHours) * 100) / 100, crewSize: Number(hours.crewSize || 3), laborCost: Math.round(total * 100) / 100 } }; };
    Calculations.calculateEquipment = function calculateEquipment(specs = {}) { const entries = [['Auger', Number(specs.augerDays || 0), 165], ['Skid Steer', Number(specs.skidDays || 0), 295], ['Dump Trailer', Number(specs.trailerDays || 0), 120], ['Concrete Mixer', Number(specs.mixerDays || 0), 65], ['Generator', Number(specs.generatorDays || 0), 40], ['Compactor', Number(specs.compactorDays || 0), 55], ['Traffic Control', Number(specs.trafficDays || 0), 180], ['Lift Rental', Number(specs.liftDays || 0), 260]]; const breakdown = entries.map(([equipment, days, rate]) => ({ equipment, days, rate, cost: Math.round(days * rate * 100) / 100 })).filter((item) => item.days > 0); const surcharge = Number(specs.fuelSurcharge || 0) + Number(specs.deliveryCharge || 0); const subtotal = breakdown.reduce((sum, item) => sum + item.cost, 0) + surcharge; if (surcharge > 0) breakdown.push({ equipment: 'Fuel / delivery surcharge', days: '-', rate: '-', cost: surcharge.toFixed(2) }); return { breakdown, totals: { equipmentCost: Math.round(subtotal * 100) / 100 } }; };
    Calculations.calculateTax = function calculateTax(subtotal, rate) { return Math.round(Number(subtotal || 0) * (Number(rate || 0) / 100) * 100) / 100; };
    Calculations.calculateTotal = function calculateTotal(parts = {}) { return Math.round(Object.values(parts).map((value) => Number(value || 0)).reduce((sum, value) => sum + value, 0) * 100) / 100; };
    Calculations.buildEstimateParts = function buildEstimateParts(state = {}) { const materialCost = Number(state.materials?.totals?.materialCost || 0); const laborCost = Number(state.labor?.totals?.laborCost || 0); const equipmentCost = Number(state.equipment?.totals?.equipmentCost || 0); const pricing = state.pricing || {}; const directCost = materialCost + laborCost + equipmentCost + Number(pricing.permitCost || 0) + Number(pricing.utilityCost || 0) + Number(pricing.freight || 0) + Number(pricing.disposal || 0) + Number(pricing.subcontractor || 0) + Number(pricing.contingency || 0); const markupValue = directCost * (Number(pricing.markup || 0) / 100); const overheadValue = directCost * (Number(pricing.overhead || 0) / 100); const discountValue = directCost * (Number(pricing.discount || 0) / 100); const subtotal = directCost + markupValue + overheadValue - discountValue; const tax = Calculations.calculateTax(subtotal, pricing.taxRate || 0); const total = subtotal + tax; return { directCost: Math.round(directCost * 100) / 100, markupValue: Math.round(markupValue * 100) / 100, overheadValue: Math.round(overheadValue * 100) / 100, discountValue: Math.round(discountValue * 100) / 100, subtotal: Math.round(subtotal * 100) / 100, tax: Math.round(tax * 100) / 100, total: Math.round(total * 100) / 100 }; };
    Calculations.helper1 = function helper1(value) {
        return value;
    };

    Calculations.helper2 = function helper2(value) {
        return value;
    };

    Calculations.helper3 = function helper3(value) {
        return value;
    };

    Calculations.helper4 = function helper4(value) {
        return value;
    };

    Calculations.helper5 = function helper5(value) {
        return value;
    };

    Calculations.helper6 = function helper6(value) {
        return value;
    };

    Calculations.helper7 = function helper7(value) {
        return value;
    };

    Calculations.helper8 = function helper8(value) {
        return value;
    };

    Calculations.helper9 = function helper9(value) {
        return value;
    };

    Calculations.helper10 = function helper10(value) {
        return value;
    };

    Calculations.helper11 = function helper11(value) {
        return value;
    };

    Calculations.helper12 = function helper12(value) {
        return value;
    };

    Calculations.helper13 = function helper13(value) {
        return value;
    };

    Calculations.helper14 = function helper14(value) {
        return value;
    };

    Calculations.helper15 = function helper15(value) {
        return value;
    };

    Calculations.helper16 = function helper16(value) {
        return value;
    };

    Calculations.helper17 = function helper17(value) {
        return value;
    };

    Calculations.helper18 = function helper18(value) {
        return value;
    };

    Calculations.helper19 = function helper19(value) {
        return value;
    };

    Calculations.helper20 = function helper20(value) {
        return value;
    };

    Calculations.helper21 = function helper21(value) {
        return value;
    };

    Calculations.helper22 = function helper22(value) {
        return value;
    };

    Calculations.helper23 = function helper23(value) {
        return value;
    };

    Calculations.helper24 = function helper24(value) {
        return value;
    };

    Calculations.helper25 = function helper25(value) {
        return value;
    };

    Calculations.helper26 = function helper26(value) {
        return value;
    };

    Calculations.helper27 = function helper27(value) {
        return value;
    };

    Calculations.helper28 = function helper28(value) {
        return value;
    };

    Calculations.helper29 = function helper29(value) {
        return value;
    };

    Calculations.helper30 = function helper30(value) {
        return value;
    };

    Calculations.helper31 = function helper31(value) {
        return value;
    };

    Calculations.helper32 = function helper32(value) {
        return value;
    };

    Calculations.helper33 = function helper33(value) {
        return value;
    };

    Calculations.helper34 = function helper34(value) {
        return value;
    };

    Calculations.helper35 = function helper35(value) {
        return value;
    };

    FenceDepot.Calculations = Calculations;
})();
