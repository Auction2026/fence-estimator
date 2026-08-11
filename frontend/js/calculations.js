const DEFAULT_WASTE_BY_TYPE = {
  chainlink: 0.05,
  woodPrivacy: 0.1,
  vinyl: 0.07,
  wroughtIron: 0.04,
  barbedWire: 0.06,
};

const DEFAULT_PRODUCTION_RATES = {
  chainlink: 0.18,
  woodPrivacy: 0.28,
  vinyl: 0.24,
  wroughtIron: 0.22,
  barbedWire: 0.12,
};

const DEFAULT_MARKUP_SETTINGS = {
  overheadPercent: 0.12,
  profitPercent: 0.2,
  taxPercent: 0.13,
  laborRate: 58,
  crewSize: 2,
  terrainFactor: 1,
  soilFactor: 1,
  accessFactor: 1,
};

export const INVENTORY_DB = [
  { sku: '387', name: "Chain Link 5' Black Mesh", category: 'chainlink', unit: 'ft', cost: 5.03, supplier: 'Master Halco', stock: 2400 },
  { sku: '388', name: "Chain Link 4' Galvanized Mesh", category: 'chainlink', unit: 'ft', cost: 4.62, supplier: 'Master Halco', stock: 2800 },
  { sku: '389', name: "Chain Link 6' Black Mesh", category: 'chainlink', unit: 'ft', cost: 5.94, supplier: 'Master Halco', stock: 2200 },
  { sku: '390', name: "Chain Link 8' Galvanized Mesh", category: 'chainlink', unit: 'ft', cost: 7.88, supplier: 'Master Halco', stock: 900 },
  { sku: '956', name: 'Top Rail 1.25" Black', category: 'chainlink', unit: 'ea', cost: 21.07, supplier: 'Master Halco', stock: 420 },
  { sku: '957', name: 'Top Rail 1.25" Galvanized', category: 'chainlink', unit: 'ea', cost: 18.95, supplier: 'Master Halco', stock: 500 },
  { sku: '927', name: "Tension Bar 5' Black", category: 'chainlink', unit: 'ea', cost: 5.65, supplier: 'Master Halco', stock: 360 },
  { sku: '928', name: "Tension Bar 6' Black", category: 'chainlink', unit: 'ea', cost: 6.24, supplier: 'Master Halco', stock: 300 },
  { sku: '900', name: 'Tension Band 1.875" Black', category: 'chainlink', unit: 'ea', cost: 1.58, supplier: 'Master Halco', stock: 1400 },
  { sku: '901', name: 'Brace Band 1.875" Black', category: 'chainlink', unit: 'ea', cost: 1.72, supplier: 'Master Halco', stock: 950 },
  { sku: '1009', name: 'Line Post 1.875" Black', category: 'chainlink', unit: 'ea', cost: 33.72, supplier: 'Master Halco', stock: 260 },
  { sku: '1010', name: 'Terminal Post 2.375" Black', category: 'chainlink', unit: 'ea', cost: 48.15, supplier: 'Master Halco', stock: 180 },
  { sku: '1011', name: 'Top Rail Sleeve', category: 'chainlink', unit: 'ea', cost: 2.18, supplier: 'Master Halco', stock: 450 },
  { sku: '1012', name: 'Rail End Black', category: 'chainlink', unit: 'ea', cost: 3.12, supplier: 'Master Halco', stock: 500 },
  { sku: '1013', name: 'Loop Cap Black', category: 'chainlink', unit: 'ea', cost: 2.84, supplier: 'Master Halco', stock: 350 },
  { sku: '1014', name: 'Post Cap Dome Black', category: 'chainlink', unit: 'ea', cost: 2.46, supplier: 'Master Halco', stock: 360 },
  { sku: '1015', name: 'Concrete 80 lb Bag', category: 'general', unit: 'ea', cost: 8.5, supplier: 'BuildHub', stock: 900 },
  { sku: '1016', name: 'Hog Ring Bag', category: 'chainlink', unit: 'ea', cost: 13.25, supplier: 'Master Halco', stock: 180 },
  { sku: '1017', name: 'Tension Wire 7 Gauge', category: 'chainlink', unit: 'ft', cost: 0.82, supplier: 'Master Halco', stock: 4500 },
  { sku: '1018', name: "Residential Swing Gate 4'", category: 'gates', unit: 'ea', cost: 215, supplier: 'Ameristar', stock: 32 },
  { sku: '1019', name: "Commercial Gate Frame 12'", category: 'gates', unit: 'ea', cost: 875, supplier: 'Ameristar', stock: 8 },
  { sku: '1100', name: 'Pressure Treated 4x4x8 Post', category: 'wood', unit: 'ea', cost: 24.5, supplier: 'Canadian Fence', stock: 210 },
  { sku: '1101', name: 'Pressure Treated 2x4x8 Rail', category: 'wood', unit: 'ea', cost: 9.72, supplier: 'Canadian Fence', stock: 680 },
  { sku: '1102', name: 'Pressure Treated 1x6 Privacy Board', category: 'wood', unit: 'ea', cost: 7.15, supplier: 'Canadian Fence', stock: 2400 },
  { sku: '1103', name: 'Cedar 1x6 Privacy Board', category: 'wood', unit: 'ea', cost: 9.85, supplier: 'Canadian Fence', stock: 1600 },
  { sku: '1104', name: 'Galvanized Deck Screw Box', category: 'wood', unit: 'ea', cost: 42, supplier: 'BuildHub', stock: 94 },
  { sku: '1105', name: 'Post Mix Fast Setting', category: 'wood', unit: 'ea', cost: 9.25, supplier: 'BuildHub', stock: 620 },
  { sku: '1106', name: 'Wood Gate Hardware Kit', category: 'gates', unit: 'ea', cost: 58.4, supplier: 'Canadian Fence', stock: 75 },
  { sku: '1107', name: '3-Rail Wood Cap Board', category: 'wood', unit: 'ea', cost: 12.8, supplier: 'Canadian Fence', stock: 280 },
  { sku: '1108', name: 'Wood Stain Gallon', category: 'wood', unit: 'ea', cost: 46.35, supplier: 'BuildHub', stock: 68 },
  { sku: '1200', name: 'Vinyl Post 5x5x108 White', category: 'vinyl', unit: 'ea', cost: 88, supplier: 'Homeland Vinyl', stock: 165 },
  { sku: '1201', name: 'Vinyl Rail 2x6x95 White', category: 'vinyl', unit: 'ea', cost: 38.75, supplier: 'Homeland Vinyl', stock: 460 },
  { sku: '1202', name: 'Vinyl Privacy Panel 6x8 White', category: 'vinyl', unit: 'ea', cost: 168.4, supplier: 'Homeland Vinyl', stock: 180 },
  { sku: '1203', name: 'Vinyl Privacy Panel 5x8 White', category: 'vinyl', unit: 'ea', cost: 155.9, supplier: 'Homeland Vinyl', stock: 160 },
  { sku: '1204', name: 'Vinyl Post Cap Gothic', category: 'vinyl', unit: 'ea', cost: 7.6, supplier: 'Homeland Vinyl', stock: 500 },
  { sku: '1205', name: 'Vinyl Bracket Kit', category: 'vinyl', unit: 'ea', cost: 12.85, supplier: 'Homeland Vinyl', stock: 300 },
  { sku: '1206', name: "Vinyl Gate Kit 4'", category: 'gates', unit: 'ea', cost: 425, supplier: 'Homeland Vinyl', stock: 20 },
  { sku: '1207', name: 'Aluminum Insert 95"', category: 'vinyl', unit: 'ea', cost: 18.55, supplier: 'Homeland Vinyl', stock: 310 },
  { sku: '1208', name: 'Vinyl Cement Tube', category: 'vinyl', unit: 'ea', cost: 14.35, supplier: 'Homeland Vinyl', stock: 110 },
  { sku: '1300', name: "Ornamental Panel 6x8 Black", category: 'wroughtiron', unit: 'ea', cost: 214.7, supplier: 'Cloutier Direct', stock: 95 },
  { sku: '1301', name: 'Ornamental Post 2.5x2.5x96', category: 'wroughtiron', unit: 'ea', cost: 72.6, supplier: 'Cloutier Direct', stock: 130 },
  { sku: '1302', name: 'Ornamental Bracket Set', category: 'wroughtiron', unit: 'ea', cost: 10.8, supplier: 'Cloutier Direct', stock: 320 },
  { sku: '1303', name: "Ornamental Gate 4'", category: 'gates', unit: 'ea', cost: 685, supplier: 'Cloutier Direct', stock: 14 },
  { sku: '1304', name: 'Touch-up Powder Paint', category: 'wroughtiron', unit: 'ea', cost: 19.45, supplier: 'Cloutier Direct', stock: 45 },
  { sku: '1305', name: 'Weld Tab Kit', category: 'wroughtiron', unit: 'ea', cost: 24.75, supplier: 'Cloutier Direct', stock: 70 },
  { sku: '1306', name: 'Mounting Anchor Pack', category: 'wroughtiron', unit: 'ea', cost: 31.25, supplier: 'Cloutier Direct', stock: 80 },
  { sku: '1400', name: 'Barbed Wire 4-Point 12.5 Gauge', category: 'barbedwire', unit: 'ft', cost: 0.48, supplier: 'Prairie Ag', stock: 12000 },
  { sku: '1401', name: "T-Post 6.5'", category: 'barbedwire', unit: 'ea', cost: 9.4, supplier: 'Prairie Ag', stock: 640 },
  { sku: '1402', name: 'Wood H-Brace Kit', category: 'barbedwire', unit: 'ea', cost: 48.85, supplier: 'Prairie Ag', stock: 90 },
  { sku: '1403', name: 'Staple Pack 1.75"', category: 'barbedwire', unit: 'ea', cost: 16.6, supplier: 'Prairie Ag', stock: 140 },
  { sku: '1404', name: 'Barbed Wire Gate Kit', category: 'gates', unit: 'ea', cost: 126, supplier: 'Prairie Ag', stock: 24 },
  { sku: '1405', name: 'High Tensile Brace Wire', category: 'barbedwire', unit: 'ft', cost: 0.34, supplier: 'Prairie Ag', stock: 6000 },
  { sku: '1500', name: 'Safety Cap Pack', category: 'hardware', unit: 'ea', cost: 12.9, supplier: 'BuildHub', stock: 150 },
  { sku: '1501', name: 'Saw Blade Consumable', category: 'hardware', unit: 'ea', cost: 18.35, supplier: 'BuildHub', stock: 90 },
  { sku: '1502', name: 'Marking Paint Can', category: 'hardware', unit: 'ea', cost: 8.4, supplier: 'BuildHub', stock: 120 },
  { sku: '1503', name: 'Permit Administration Bundle', category: 'service', unit: 'ea', cost: 65, supplier: 'Office', stock: 999 },
  { sku: '1504', name: 'Utility Locate Coordination', category: 'service', unit: 'ea', cost: 45, supplier: 'Office', stock: 999 },
  { sku: '1505', name: 'Disposal Haul-off Charge', category: 'service', unit: 'ea', cost: 145, supplier: 'Fleet', stock: 999 },
  { sku: '1506', name: 'Mini Skid Steer Day Rate', category: 'equipment', unit: 'ea', cost: 265, supplier: 'Fleet', stock: 16 },
  { sku: '1507', name: 'Core Drill Day Rate', category: 'equipment', unit: 'ea', cost: 180, supplier: 'Fleet', stock: 8 },
  { sku: '1508', name: 'Gate Operator Prep Kit', category: 'hardware', unit: 'ea', cost: 118, supplier: 'Chamberlain Group', stock: 18 },
  { sku: '1509', name: 'Solar Warning Sign Set', category: 'hardware', unit: 'ea', cost: 24, supplier: 'Prairie Ag', stock: 45 },
];

export const INVENTORY_INDEX = INVENTORY_DB.reduce((index, item) => {
  index[item.sku] = item;
  return index;
}, {});

export function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function roundQuantity(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round((Number(value) || 0) * factor) / factor;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function lookupSku(sku) {
  return INVENTORY_INDEX[String(sku)] || null;
}

export function getMaterialCostBySku(sku) {
  return lookupSku(sku)?.cost || 0;
}

export function lineItem({ sku, label, quantity, unit, unitCost, category, notes = '' }) {
  const resolved = sku ? lookupSku(sku) : null;
  const normalizedQuantity = roundQuantity(quantity, 3);
  const normalizedUnitCost = roundCurrency(unitCost ?? resolved?.cost ?? 0);

  return {
    sku: sku || resolved?.sku || '',
    label: label || resolved?.name || 'Custom Line Item',
    category: category || resolved?.category || 'custom',
    unit: unit || resolved?.unit || 'ea',
    supplier: resolved?.supplier || null,
    quantity: normalizedQuantity,
    unitCost: normalizedUnitCost,
    extendedCost: roundCurrency(normalizedQuantity * normalizedUnitCost),
    notes,
  };
}

export function summarizeLineItems(items) {
  return items.reduce((summary, item) => {
    summary[item.category] = roundCurrency((summary[item.category] || 0) + item.extendedCost);
    summary.total = roundCurrency(summary.total + item.extendedCost);
    return summary;
  }, { total: 0 });
}

export function deriveProjectMetrics(config = {}) {
  const linearFeet = Math.max(toNumber(config.linearFeet), 0);
  const postSpacing = Math.max(toNumber(config.postSpacing, 8), 4);
  const gates = Array.isArray(config.gates) ? config.gates : [];
  const totalGateWidth = gates.reduce((sum, gate) => sum + toNumber(gate.width, 0) * toNumber(gate.count, 1), 0);
  const adjustedFenceRun = Math.max(linearFeet - totalGateWidth, 0);
  const sections = Math.max(Math.ceil(adjustedFenceRun / postSpacing), 1);
  const corners = Math.max(toNumber(config.corners, 4), 0);
  const ends = Math.max(toNumber(config.ends, 2), 0);
  const terminalPosts = corners + ends + (gates.length * 2);
  const linePosts = Math.max(sections - 1, 0);
  const posts = terminalPosts + linePosts;
  const concreteBags = Math.ceil(posts * clamp(toNumber(config.concretePerPost, 2.75), 1.5, 6));

  return { linearFeet, postSpacing, gates, totalGateWidth, adjustedFenceRun, sections, corners, ends, terminalPosts, linePosts, posts, concreteBags };
}

export function estimateWaste(type, overridePercent) {
  if (Number.isFinite(Number(overridePercent))) {
    return Math.max(Number(overridePercent), 0);
  }
  return DEFAULT_WASTE_BY_TYPE[type] ?? 0.08;
}

export function applyWaste(quantity, percent) {
  return roundQuantity(quantity * (1 + percent), 3);
}

export function buildGateItems(fenceType, gates = []) {
  return (Array.isArray(gates) ? gates : []).flatMap((gate) => {
    const width = toNumber(gate.width, 4);
    const count = Math.max(toNumber(gate.count, 1), 1);
    const swing = gate.swing ?? 'single';
    const notes = `${width}' ${swing} gate`;

    if (fenceType === 'chainlink') return [lineItem({ sku: width >= 10 ? '1019' : '1018', quantity: count, category: 'gates', notes })];
    if (fenceType === 'woodPrivacy') return [lineItem({ sku: '1106', quantity: count, category: 'gates', notes })];
    if (fenceType === 'vinyl') return [lineItem({ sku: '1206', quantity: count, category: 'gates', notes })];
    if (fenceType === 'wroughtIron') return [lineItem({ sku: '1303', quantity: count, category: 'gates', notes })];
    return [lineItem({ sku: '1404', quantity: count, category: 'gates', notes })];
  });
}

export function calculateChainLink(config = {}) {
  const metrics = deriveProjectMetrics(config);
  const height = toNumber(config.height, 5);
  const waste = estimateWaste('chainlink', config.wastePercent);
  const meshSku = height >= 8 ? '390' : height >= 6 ? '389' : height >= 5 ? '387' : '388';
  const tensionBarSku = height >= 6 ? '928' : '927';
  const meshFeet = applyWaste(metrics.adjustedFenceRun, waste);
  const topRailPieces = Math.ceil(metrics.adjustedFenceRun / 21);
  const topRailSleeves = Math.max(topRailPieces - 1, 0);
  const tensionBandCount = metrics.terminalPosts * Math.max(Math.round(height / 1.5), 3);
  const braceBandCount = metrics.terminalPosts * 2;
  const railEndCount = metrics.terminalPosts * 2;
  const hogRingBags = Math.max(1, Math.ceil(metrics.adjustedFenceRun / 100));

  const lineItems = [
    lineItem({ sku: meshSku, quantity: meshFeet, category: 'mesh' }),
    lineItem({ sku: height >= 5 ? '956' : '957', quantity: topRailPieces, category: 'rail' }),
    lineItem({ sku: tensionBarSku, quantity: metrics.terminalPosts, category: 'hardware' }),
    lineItem({ sku: '900', quantity: tensionBandCount, category: 'hardware' }),
    lineItem({ sku: '901', quantity: braceBandCount, category: 'hardware' }),
    lineItem({ sku: '1009', quantity: metrics.linePosts, category: 'posts' }),
    lineItem({ sku: '1010', quantity: metrics.terminalPosts, category: 'posts' }),
    lineItem({ sku: '1011', quantity: topRailSleeves, category: 'hardware' }),
    lineItem({ sku: '1012', quantity: railEndCount, category: 'hardware' }),
    lineItem({ sku: '1013', quantity: metrics.linePosts, category: 'hardware' }),
    lineItem({ sku: '1014', quantity: metrics.terminalPosts, category: 'hardware' }),
    lineItem({ sku: '1015', quantity: metrics.concreteBags, category: 'concrete' }),
    lineItem({ sku: '1016', quantity: hogRingBags, category: 'hardware' }),
    lineItem({ sku: '1017', quantity: applyWaste(metrics.adjustedFenceRun, 0.02), category: 'wire' }),
    ...buildGateItems('chainlink', metrics.gates),
  ];

  return { type: 'chainlink', metrics, wastePercent: waste, lineItems, totals: summarizeLineItems(lineItems) };
}

export function calculateWoodPrivacy(config = {}) {
  const metrics = deriveProjectMetrics({ ...config, postSpacing: toNumber(config.postSpacing, 8) || 8 });
  const height = toNumber(config.height, 6);
  const waste = estimateWaste('woodPrivacy', config.wastePercent);
  const boardCoverage = clamp(toNumber(config.boardCoverage, 0.46), 0.3, 0.75);
  const boards = Math.ceil(applyWaste(metrics.adjustedFenceRun / boardCoverage, waste));
  const railsPerSection = height >= 7 ? 4 : 3;
  const railPieces = Math.ceil((metrics.sections * railsPerSection * metrics.postSpacing) / 8 * (1 + waste));
  const capBoards = config.capBoard ? Math.ceil(metrics.adjustedFenceRun / 8 * (1 + waste)) : 0;
  const screwBoxes = Math.max(1, Math.ceil(metrics.adjustedFenceRun / 90));
  const stainGallons = config.stain ? Math.max(1, Math.ceil(metrics.adjustedFenceRun / 45)) : 0;

  const lineItems = [
    lineItem({ sku: '1100', quantity: metrics.posts, category: 'posts' }),
    lineItem({ sku: '1101', quantity: railPieces, category: 'rails' }),
    lineItem({ sku: config.material === 'cedar' ? '1103' : '1102', quantity: boards, category: 'boards' }),
    lineItem({ sku: '1104', quantity: screwBoxes, category: 'hardware' }),
    lineItem({ sku: '1105', quantity: Math.ceil(metrics.posts * 2.25), category: 'concrete' }),
    ...buildGateItems('woodPrivacy', metrics.gates),
  ];
  if (capBoards) lineItems.push(lineItem({ sku: '1107', quantity: capBoards, category: 'trim' }));
  if (stainGallons) lineItems.push(lineItem({ sku: '1108', quantity: stainGallons, category: 'finish' }));

  return { type: 'woodPrivacy', metrics, wastePercent: waste, lineItems, totals: summarizeLineItems(lineItems) };
}

export function calculateVinyl(config = {}) {
  const metrics = deriveProjectMetrics({ ...config, postSpacing: toNumber(config.postSpacing, 8) || 8 });
  const height = toNumber(config.height, 6);
  const waste = estimateWaste('vinyl', config.wastePercent);
  const lineItems = [
    lineItem({ sku: '1200', quantity: metrics.sections + 1 + metrics.gates.length * 2, category: 'posts' }),
    lineItem({ sku: '1201', quantity: Math.ceil(metrics.sections * 2 * (1 + waste)), category: 'rails' }),
    lineItem({ sku: height >= 6 ? '1202' : '1203', quantity: Math.ceil(metrics.sections * (1 + waste)), category: 'panels' }),
    lineItem({ sku: '1204', quantity: metrics.sections + 1, category: 'caps' }),
    lineItem({ sku: '1205', quantity: metrics.sections * 2, category: 'hardware' }),
    lineItem({ sku: '1208', quantity: Math.max(1, Math.ceil(metrics.sections / 4)), category: 'hardware' }),
    lineItem({ sku: '1015', quantity: Math.ceil((metrics.sections + 1) * 2.5), category: 'concrete' }),
    ...buildGateItems('vinyl', metrics.gates),
  ];
  if (height >= 6) lineItems.push(lineItem({ sku: '1207', quantity: Math.ceil(metrics.sections * 2), category: 'reinforcement' }));
  return { type: 'vinyl', metrics, wastePercent: waste, lineItems, totals: summarizeLineItems(lineItems) };
}

export function calculateWroughtIron(config = {}) {
  const metrics = deriveProjectMetrics({ ...config, postSpacing: toNumber(config.postSpacing, 8) || 8 });
  const waste = estimateWaste('wroughtIron', config.wastePercent);
  const lineItems = [
    lineItem({ sku: '1300', quantity: Math.ceil(metrics.sections * (1 + waste)), category: 'panels' }),
    lineItem({ sku: '1301', quantity: metrics.sections + 1 + metrics.gates.length * 2, category: 'posts' }),
    lineItem({ sku: '1302', quantity: metrics.sections * 2, category: 'hardware' }),
    lineItem({ sku: '1306', quantity: Math.max(1, Math.ceil((metrics.sections + 1) / 4)), category: 'anchors' }),
    lineItem({ sku: '1304', quantity: Math.max(1, Math.ceil(metrics.adjustedFenceRun / 200)), category: 'finish' }),
    lineItem({ sku: '1015', quantity: Math.ceil((metrics.sections + 1) * 2.4), category: 'concrete' }),
    ...buildGateItems('wroughtIron', metrics.gates),
  ];
  if (config.weldTabs) lineItems.push(lineItem({ sku: '1305', quantity: Math.ceil(metrics.sections / 2), category: 'hardware' }));
  return { type: 'wroughtIron', metrics, wastePercent: waste, lineItems, totals: summarizeLineItems(lineItems) };
}

export function calculateBarbedWire(config = {}) {
  const metrics = deriveProjectMetrics({ ...config, postSpacing: toNumber(config.postSpacing, 12) || 12 });
  const strands = clamp(toNumber(config.strands, 5), 3, 8);
  const waste = estimateWaste('barbedWire', config.wastePercent);
  const lineItems = [
    lineItem({ sku: '1400', quantity: applyWaste(metrics.adjustedFenceRun * strands, waste), category: 'wire' }),
    lineItem({ sku: '1401', quantity: Math.max(Math.ceil(metrics.adjustedFenceRun / metrics.postSpacing), 1) + 1, category: 'posts' }),
    lineItem({ sku: '1402', quantity: Math.max(2, metrics.terminalPosts), category: 'braces' }),
    lineItem({ sku: '1403', quantity: Math.max(1, Math.ceil(metrics.adjustedFenceRun / 300)), category: 'hardware' }),
    lineItem({ sku: '1405', quantity: applyWaste(Math.max(2, metrics.terminalPosts) * 12, 0.04), category: 'wire' }),
    ...buildGateItems('barbedWire', metrics.gates),
  ];
  if (config.warningSigns) lineItems.push(lineItem({ sku: '1509', quantity: Math.max(1, Math.ceil(metrics.adjustedFenceRun / 400)), category: 'safety' }));
  return { type: 'barbedWire', metrics, wastePercent: waste, lineItems, totals: summarizeLineItems(lineItems) };
}

export function calculateFenceMaterials(config = {}) {
  switch (config.fenceType || config.type || 'chainlink') {
    case 'chainlink': return calculateChainLink(config);
    case 'wood':
    case 'woodPrivacy': return calculateWoodPrivacy(config);
    case 'vinyl': return calculateVinyl(config);
    case 'ornamental':
    case 'wroughtIron':
    case 'wroughtiron': return calculateWroughtIron(config);
    case 'barbedWire':
    case 'barbedwire': return calculateBarbedWire(config);
    default: return calculateChainLink(config);
  }
}

export function calculateLabor(config = {}, materials = null, settings = {}) {
  const estimate = materials || calculateFenceMaterials(config);
  const productionRate = DEFAULT_PRODUCTION_RATES[estimate.type] ?? 0.2;
  const baseHours = estimate.metrics.linearFeet * productionRate;
  const terrainFactor = clamp(toNumber(config.terrainFactor ?? settings.terrainFactor, 1), 0.7, 2.5);
  const soilFactor = clamp(toNumber(config.soilFactor ?? settings.soilFactor, 1), 0.8, 2.5);
  const accessFactor = clamp(toNumber(config.accessFactor ?? settings.accessFactor, 1), 0.8, 1.75);
  const removalFactor = config.removalRequired ? 1.18 : 1;
  const gateFactor = 1 + (estimate.metrics.gates.length * 0.07);
  const crewSize = Math.max(toNumber(config.crewSize ?? settings.crewSize, 2), 1);
  const crewEfficiency = crewSize === 1 ? 1.12 : crewSize === 2 ? 1 : crewSize === 3 ? 0.9 : 0.82;
  const adjustedHours = roundQuantity(baseHours * terrainFactor * soilFactor * accessFactor * removalFactor * gateFactor * crewEfficiency, 2);
  const laborRate = roundCurrency(toNumber(config.laborRate ?? settings.laborRate, DEFAULT_MARKUP_SETTINGS.laborRate));
  return {
    productionRate,
    baseHours: roundQuantity(baseHours, 2),
    adjustedHours,
    crewSize,
    laborRate,
    laborCost: roundCurrency(adjustedHours * laborRate),
    modifiers: { terrainFactor, soilFactor, accessFactor, removalFactor, gateFactor, crewEfficiency },
  };
}

export function calculateEquipment(config = {}, materials = null) {
  const estimate = materials || calculateFenceMaterials(config);
  const items = [];
  if (config.removalRequired) items.push(lineItem({ sku: '1505', quantity: 1, category: 'equipment' }));
  if (estimate.metrics.linearFeet >= 180 || config.useSkidSteer) items.push(lineItem({ sku: '1506', quantity: Math.max(1, Math.ceil(estimate.metrics.linearFeet / 220)), category: 'equipment' }));
  if (config.coreDrillRequired) items.push(lineItem({ sku: '1507', quantity: Math.max(1, Math.ceil(estimate.metrics.posts / 18)), category: 'equipment' }));
  if (config.gateOperatorPrep) items.push(lineItem({ sku: '1508', quantity: 1, category: 'equipment' }));
  if (config.layoutConsumables !== false) items.push(lineItem({ sku: '1502', quantity: Math.max(1, Math.ceil(estimate.metrics.linearFeet / 250)), category: 'consumables' }));
  if (config.safetyCaps) items.push(lineItem({ sku: '1500', quantity: Math.max(1, Math.ceil(estimate.metrics.posts / 20)), category: 'consumables' }));
  return { lineItems: items, totals: summarizeLineItems(items) };
}

export function calculateServices(config = {}) {
  const items = [];
  if (config.permitRequired) items.push(lineItem({ sku: '1503', quantity: 1, category: 'services' }));
  if (config.locatesRequired) items.push(lineItem({ sku: '1504', quantity: 1, category: 'services' }));
  return { lineItems: items, totals: summarizeLineItems(items) };
}

export function calculatePricing(materialEstimate, laborEstimate, equipmentEstimate, serviceEstimate, overrides = {}) {
  const settings = { ...DEFAULT_MARKUP_SETTINGS, ...overrides };
  const materialsSubtotal = materialEstimate?.totals?.total || 0;
  const equipmentSubtotal = equipmentEstimate?.totals?.total || 0;
  const servicesSubtotal = serviceEstimate?.totals?.total || 0;
  const laborSubtotal = laborEstimate?.laborCost || 0;
  const directCost = roundCurrency(materialsSubtotal + laborSubtotal + equipmentSubtotal + servicesSubtotal);
  const overhead = roundCurrency(directCost * toNumber(settings.overheadPercent, DEFAULT_MARKUP_SETTINGS.overheadPercent));
  const profit = roundCurrency((directCost + overhead) * toNumber(settings.profitPercent, DEFAULT_MARKUP_SETTINGS.profitPercent));
  const discount = roundCurrency(toNumber(settings.discountAmount, 0));
  const subtotal = roundCurrency(directCost + overhead + profit - discount);
  const tax = roundCurrency(subtotal * toNumber(settings.taxPercent, DEFAULT_MARKUP_SETTINGS.taxPercent));
  const total = roundCurrency(subtotal + tax);
  return {
    directCost,
    materialsSubtotal: roundCurrency(materialsSubtotal),
    laborSubtotal: roundCurrency(laborSubtotal),
    equipmentSubtotal: roundCurrency(equipmentSubtotal),
    servicesSubtotal: roundCurrency(servicesSubtotal),
    overhead,
    profit,
    discount,
    subtotal,
    tax,
    total,
    marginPercent: subtotal > 0 ? roundQuantity((profit / subtotal) * 100, 2) : 0,
    pricePerFoot: materialEstimate?.metrics?.linearFeet ? roundCurrency(total / materialEstimate.metrics.linearFeet) : 0,
  };
}

export function calculateEstimateBundle(config = {}, settings = {}) {
  const normalizedSettings = { ...DEFAULT_MARKUP_SETTINGS, ...settings };
  const materials = calculateFenceMaterials(config);
  const labor = calculateLabor(config, materials, normalizedSettings);
  const equipment = calculateEquipment(config, materials);
  const services = calculateServices(config);
  const pricing = calculatePricing(materials, labor, equipment, services, normalizedSettings);
  return { materials, labor, equipment, services, pricing, generatedAt: new Date().toISOString() };
}

export function describeEstimate(config = {}, result = calculateEstimateBundle(config)) {
  const { materials, labor, pricing } = result;
  return {
    fenceType: materials.type,
    linearFeet: materials.metrics.linearFeet,
    gates: materials.metrics.gates.length,
    posts: materials.metrics.posts,
    laborHours: labor.adjustedHours,
    total: pricing.total,
    pricePerFoot: pricing.pricePerFoot,
  };
}

export function searchInventory(term = '', filters = {}) {
  const normalized = term.trim().toLowerCase();
  return INVENTORY_DB.filter((item) => {
    const matchesTerm = !normalized || [item.sku, item.name, item.category, item.supplier].some((value) => String(value).toLowerCase().includes(normalized));
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesSupplier = !filters.supplier || item.supplier === filters.supplier;
    const matchesStock = !filters.lowStockOnly || item.stock <= toNumber(filters.lowStockThreshold, 50);
    return matchesTerm && matchesCategory && matchesSupplier && matchesStock;
  });
}

export function buildInventorySnapshot() {
  return {
    totalSkus: INVENTORY_DB.length,
    lowStockItems: INVENTORY_DB.filter((item) => item.stock <= 50).length,
    totalValue: roundCurrency(INVENTORY_DB.reduce((sum, item) => sum + (item.cost * item.stock), 0)),
    categories: [...new Set(INVENTORY_DB.map((item) => item.category))],
  };
}

export function normalizeFenceType(value = '') {
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'wood') return 'woodPrivacy';
  if (normalized === 'wroughtiron' || normalized === 'ornamental') return 'wroughtIron';
  if (normalized === 'barbedwire') return 'barbedWire';
  return normalized || 'chainlink';
}

if (typeof window !== 'undefined') {
  window.INVENTORY_DB = INVENTORY_DB;
}
