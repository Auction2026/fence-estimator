// Fence Estimator Calculations Engine
'use strict';

const Calculator = {
  RATES: { laborPerHour: 75, equipmentPerDay: 250, concretePerBag: 8.50, contingencyPercent: 0.10, taxRate: 0.08 },
  MATERIAL_PRICES: {
    chainLink: { mesh: { '4ft': 1.20, '5ft': 1.45, '6ft': 1.75, '8ft': 2.20 }, topRail: 0.85, linePost: { '4ft': 18, '5ft': 22, '6ft': 28, '8ft': 35 }, terminalPost: { '4ft': 32, '5ft': 38, '6ft': 45, '8ft': 58 }, tension: 0.15, fittings: 0.35 },
    wood: { boards: { '4ft': 2.80, '5ft': 3.20, '6ft': 3.80, '8ft': 4.80 }, posts: { '4ft': 12, '5ft': 15, '6ft': 18, '8ft': 22 }, rails: 1.20, screws: 0.25, stain: 0.60 },
    vinyl: { panels: { '4ft': 8.50, '5ft': 10.20, '6ft': 12.80, '8ft': 16.50 }, posts: { '4ft': 28, '5ft': 32, '6ft': 38, '8ft': 48 }, caps: 4.50, hardware: 0.80 },
    wroughtIron: { panels: { '4ft': 22, '5ft': 26, '6ft': 32, '8ft': 42 }, posts: { '4ft': 45, '5ft': 55, '6ft': 68, '8ft': 85 }, hardware: 2.50, paint: 0.90 }
  },
  gatePricing: { Swing: 185, 'Double Swing': 420, Sliding: 980, Cantilever: 1850, None: 0 },
  normalizeFenceKey(fenceType) { return { 'Chain Link': 'chainLink', 'Wood': 'wood', 'Vinyl': 'vinyl', 'Wrought Iron': 'wroughtIron' }[fenceType] || 'chainLink'; },
  calculateMaterials(fenceType, height, linearFeet, numPosts, numGates, cornerPosts = 4, gateType = 'Swing') {
    const key = this.normalizeFenceKey(fenceType);
    const prices = this.MATERIAL_PRICES[key];
    const footage = Number(linearFeet) || 0;
    const posts = Number(numPosts) || 0;
    const terminals = Math.max(Number(cornerPosts) || 0, 2);
    const lines = Math.max(posts - terminals, 0);
    const gates = Number(numGates) || 0;
    const items = [];
    let total = 0;
    const pushItem = (item, qty, unitCost) => { const cleanQty = Number(qty) || 0; const cleanUnitCost = Number(unitCost) || 0; const lineTotal = cleanQty * cleanUnitCost; total += lineTotal; items.push({ item, qty: Number(cleanQty.toFixed(2)), unitCost: cleanUnitCost, total: Number(lineTotal.toFixed(2)) }); };
    if (key === 'chainLink') { pushItem(`${height} chain link mesh`, footage, prices.mesh[height]); pushItem('Top rail', footage, prices.topRail); pushItem('Line posts', lines, prices.linePost[height]); pushItem('Terminal posts', terminals, prices.terminalPost[height]); pushItem('Tension wire / bars', footage, prices.tension); pushItem('Fittings and ties', footage, prices.fittings); }
    else if (key === 'wood') { pushItem(`${height} wood boards`, footage, prices.boards[height]); pushItem('Wood posts', posts, prices.posts[height]); pushItem('Rails', footage, prices.rails); pushItem('Fasteners', footage, prices.screws); pushItem('Stain or sealer', footage, prices.stain); }
    else if (key === 'vinyl') { pushItem(`${height} vinyl panels`, footage, prices.panels[height]); pushItem('Vinyl posts', posts, prices.posts[height]); pushItem('Post caps', posts, prices.caps); pushItem('Hardware and brackets', footage, prices.hardware); }
    else if (key === 'wroughtIron') { pushItem(`${height} iron panels`, footage, prices.panels[height]); pushItem('Iron posts', posts, prices.posts[height]); pushItem('Hardware', footage, prices.hardware); pushItem('Touch-up paint / coating', footage, prices.paint); }
    if (gates > 0) pushItem(`${gateType} gates`, gates, this.gatePricing[gateType] || this.gatePricing.Swing);
    return { items, total: Number(total.toFixed(2)) };
  },
  calculateLabor(linearFeet, fenceType, numPosts, numGates) {
    const footage = Number(linearFeet) || 0; const posts = Number(numPosts) || 0; const gates = Number(numGates) || 0;
    const baseHoursPerFoot = { 'Chain Link': 0.18, 'Wood': 0.24, 'Vinyl': 0.22, 'Wrought Iron': 0.30 }[fenceType] || 0.2;
    const postHours = posts * 0.45; const gateHours = gates * 2.5; const layoutHours = Math.max(4, footage * 0.03); const totalHours = Number((footage * baseHoursPerFoot + postHours + gateHours + layoutHours).toFixed(2));
    return { items: [ { item: 'Layout and measurements', hours: Number(layoutHours.toFixed(2)), rate: this.RATES.laborPerHour, total: Number((layoutHours * this.RATES.laborPerHour).toFixed(2)) }, { item: 'Fence installation labor', hours: Number((footage * baseHoursPerFoot).toFixed(2)), rate: this.RATES.laborPerHour, total: Number((footage * baseHoursPerFoot * this.RATES.laborPerHour).toFixed(2)) }, { item: 'Post setting labor', hours: Number(postHours.toFixed(2)), rate: this.RATES.laborPerHour, total: Number((postHours * this.RATES.laborPerHour).toFixed(2)) }, { item: 'Gate installation labor', hours: Number(gateHours.toFixed(2)), rate: this.RATES.laborPerHour, total: Number((gateHours * this.RATES.laborPerHour).toFixed(2)) } ], totalHours, total: Number((totalHours * this.RATES.laborPerHour).toFixed(2)) };
  },
  calculateEquipment(linearFeet) {
    const footage = Number(linearFeet) || 0; const days = Math.max(1, Math.ceil(footage / 180));
    const items = [ { item: 'Auger / skid steer day rate', qty: days, unitCost: this.RATES.equipmentPerDay, total: Number((days * this.RATES.equipmentPerDay).toFixed(2)) }, { item: 'Layout and compact tools', qty: 1, unitCost: 85, total: 85 } ];
    const total = items.reduce((sum, item) => sum + item.total, 0); return { items, total: Number(total.toFixed(2)) };
  },
  calculateConcrete(numPosts) { const posts = Number(numPosts) || 0; const bags = Math.max(0, Math.ceil(posts * 1.5)); return { bags, unitCost: this.RATES.concretePerBag, total: Number((bags * this.RATES.concretePerBag).toFixed(2)) }; },
  calculateTotal(materials, labor, equipment, concrete, permits, extras) {
    const materialsTotal = materials && materials.total ? Number(materials.total) : 0; const laborTotal = labor && labor.total ? Number(labor.total) : 0; const equipmentTotal = equipment && equipment.total ? Number(equipment.total) : 0; const concreteTotal = concrete && concrete.total ? Number(concrete.total) : 0; const permitTotal = Number(permits) || 0; const extraTotal = Number(extras) || 0;
    const subtotalBeforeContingency = materialsTotal + laborTotal + equipmentTotal + concreteTotal + permitTotal + extraTotal; const contingency = Number((subtotalBeforeContingency * this.RATES.contingencyPercent).toFixed(2)); const subtotal = Number((subtotalBeforeContingency + contingency).toFixed(2)); const tax = Number((subtotal * this.RATES.taxRate).toFixed(2)); const total = Number((subtotal + tax).toFixed(2));
    return { materials: materialsTotal, labor: laborTotal, equipment: equipmentTotal, concrete: concreteTotal, permits: permitTotal, extras: extraTotal, contingency, subtotal, tax, total };
  },
  formatCurrency(amount) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0); },
  generateBreakdown(specs) {
    const normalizedSpecs = Object.assign({ fenceType: 'Chain Link', height: '6ft', linearFeet: 0, numPosts: 0, gateCount: 0, cornerPosts: 4, gateType: 'Swing', permitCost: 0, extrasTotal: 0 }, specs || {});
    const materials = this.calculateMaterials(normalizedSpecs.fenceType, normalizedSpecs.height, normalizedSpecs.linearFeet, normalizedSpecs.numPosts, normalizedSpecs.gateCount, normalizedSpecs.cornerPosts, normalizedSpecs.gateType);
    const labor = this.calculateLabor(normalizedSpecs.linearFeet, normalizedSpecs.fenceType, normalizedSpecs.numPosts, normalizedSpecs.gateCount);
    const equipment = this.calculateEquipment(normalizedSpecs.linearFeet);
    const concrete = this.calculateConcrete(normalizedSpecs.numPosts);
    const totals = this.calculateTotal(materials, labor, equipment, concrete, normalizedSpecs.permitCost, normalizedSpecs.extrasTotal);
    return { generatedAt: new Date().toISOString(), specs: normalizedSpecs, materials, labor, equipment, concrete, totals, total: totals.total, scopeOfWork: `${normalizedSpecs.fenceType} fence installation with ${normalizedSpecs.gateCount} gate(s), all required materials, layout, labor, and standard equipment.` };
  }
};
window.Calculator = Calculator;

Calculator[`allowance_1`] = function allowance_1(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_2`] = function allowance_2(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_3`] = function allowance_3(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_4`] = function allowance_4(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_5`] = function allowance_5(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_6`] = function allowance_6(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_7`] = function allowance_7(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_8`] = function allowance_8(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_9`] = function allowance_9(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_10`] = function allowance_10(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_11`] = function allowance_11(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_12`] = function allowance_12(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_13`] = function allowance_13(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_14`] = function allowance_14(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_15`] = function allowance_15(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_16`] = function allowance_16(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_17`] = function allowance_17(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_18`] = function allowance_18(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_19`] = function allowance_19(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_20`] = function allowance_20(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_21`] = function allowance_21(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_22`] = function allowance_22(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_23`] = function allowance_23(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_24`] = function allowance_24(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_25`] = function allowance_25(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_26`] = function allowance_26(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_27`] = function allowance_27(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_28`] = function allowance_28(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_29`] = function allowance_29(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_30`] = function allowance_30(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_31`] = function allowance_31(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_32`] = function allowance_32(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_33`] = function allowance_33(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_34`] = function allowance_34(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_35`] = function allowance_35(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_36`] = function allowance_36(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_37`] = function allowance_37(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_38`] = function allowance_38(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_39`] = function allowance_39(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_40`] = function allowance_40(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_41`] = function allowance_41(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_42`] = function allowance_42(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_43`] = function allowance_43(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_44`] = function allowance_44(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_45`] = function allowance_45(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_46`] = function allowance_46(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_47`] = function allowance_47(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_48`] = function allowance_48(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_49`] = function allowance_49(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_50`] = function allowance_50(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_51`] = function allowance_51(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_52`] = function allowance_52(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_53`] = function allowance_53(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_54`] = function allowance_54(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_55`] = function allowance_55(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_56`] = function allowance_56(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_57`] = function allowance_57(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_58`] = function allowance_58(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_59`] = function allowance_59(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_60`] = function allowance_60(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_61`] = function allowance_61(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_62`] = function allowance_62(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_63`] = function allowance_63(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_64`] = function allowance_64(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_65`] = function allowance_65(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_66`] = function allowance_66(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_67`] = function allowance_67(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_68`] = function allowance_68(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_69`] = function allowance_69(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_70`] = function allowance_70(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_71`] = function allowance_71(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_72`] = function allowance_72(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_73`] = function allowance_73(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_74`] = function allowance_74(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_75`] = function allowance_75(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_76`] = function allowance_76(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_77`] = function allowance_77(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_78`] = function allowance_78(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_79`] = function allowance_79(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_80`] = function allowance_80(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_81`] = function allowance_81(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_82`] = function allowance_82(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_83`] = function allowance_83(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_84`] = function allowance_84(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_85`] = function allowance_85(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_86`] = function allowance_86(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_87`] = function allowance_87(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_88`] = function allowance_88(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_89`] = function allowance_89(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_90`] = function allowance_90(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_91`] = function allowance_91(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_92`] = function allowance_92(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_93`] = function allowance_93(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_94`] = function allowance_94(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_95`] = function allowance_95(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_96`] = function allowance_96(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_97`] = function allowance_97(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_98`] = function allowance_98(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_99`] = function allowance_99(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_100`] = function allowance_100(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_101`] = function allowance_101(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_102`] = function allowance_102(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_103`] = function allowance_103(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_104`] = function allowance_104(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_105`] = function allowance_105(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_106`] = function allowance_106(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_107`] = function allowance_107(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_108`] = function allowance_108(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_109`] = function allowance_109(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_110`] = function allowance_110(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_111`] = function allowance_111(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_112`] = function allowance_112(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_113`] = function allowance_113(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_114`] = function allowance_114(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_115`] = function allowance_115(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_116`] = function allowance_116(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_117`] = function allowance_117(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_118`] = function allowance_118(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_119`] = function allowance_119(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_120`] = function allowance_120(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_121`] = function allowance_121(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_122`] = function allowance_122(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_123`] = function allowance_123(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_124`] = function allowance_124(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_125`] = function allowance_125(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_126`] = function allowance_126(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_127`] = function allowance_127(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_128`] = function allowance_128(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_129`] = function allowance_129(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_130`] = function allowance_130(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_131`] = function allowance_131(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_132`] = function allowance_132(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_133`] = function allowance_133(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_134`] = function allowance_134(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_135`] = function allowance_135(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_136`] = function allowance_136(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_137`] = function allowance_137(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_138`] = function allowance_138(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_139`] = function allowance_139(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_140`] = function allowance_140(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_141`] = function allowance_141(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_142`] = function allowance_142(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_143`] = function allowance_143(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_144`] = function allowance_144(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_145`] = function allowance_145(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_146`] = function allowance_146(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_147`] = function allowance_147(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_148`] = function allowance_148(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_149`] = function allowance_149(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_150`] = function allowance_150(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_151`] = function allowance_151(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_152`] = function allowance_152(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_153`] = function allowance_153(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_154`] = function allowance_154(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_155`] = function allowance_155(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_156`] = function allowance_156(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_157`] = function allowance_157(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_158`] = function allowance_158(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_159`] = function allowance_159(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_160`] = function allowance_160(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_161`] = function allowance_161(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_162`] = function allowance_162(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_163`] = function allowance_163(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_164`] = function allowance_164(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_165`] = function allowance_165(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_166`] = function allowance_166(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_167`] = function allowance_167(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_168`] = function allowance_168(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_169`] = function allowance_169(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_170`] = function allowance_170(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_171`] = function allowance_171(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};

Calculator[`allowance_172`] = function allowance_172(base) {
  const value = Number(base) || 0;
  return Number((value * 0.02).toFixed(2));
};

Calculator[`allowance_173`] = function allowance_173(base) {
  const value = Number(base) || 0;
  return Number((value * 0.03).toFixed(2));
};

Calculator[`allowance_174`] = function allowance_174(base) {
  const value = Number(base) || 0;
  return Number((value * 0.04).toFixed(2));
};

Calculator[`allowance_175`] = function allowance_175(base) {
  const value = Number(base) || 0;
  return Number((value * 0.05).toFixed(2));
};

Calculator[`allowance_176`] = function allowance_176(base) {
  const value = Number(base) || 0;
  return Number((value * 0.06).toFixed(2));
};

Calculator[`allowance_177`] = function allowance_177(base) {
  const value = Number(base) || 0;
  return Number((value * 0.07).toFixed(2));
};

Calculator[`allowance_178`] = function allowance_178(base) {
  const value = Number(base) || 0;
  return Number((value * 0.08).toFixed(2));
};

Calculator[`allowance_179`] = function allowance_179(base) {
  const value = Number(base) || 0;
  return Number((value * 0.09).toFixed(2));
};

Calculator[`allowance_180`] = function allowance_180(base) {
  const value = Number(base) || 0;
  return Number((value * 0.01).toFixed(2));
};
