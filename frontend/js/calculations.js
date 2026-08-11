/**
 * calculations.js – Estimation calculation engine for Fence Estimator Pro
 * All pricing formulas for material, labour, equipment, and totals
 */

const Calculations = (() => {

  // ── Base price tables (per linear foot by fence type) ─────────
  const MATERIAL_RATES = {
    'chain-link': { material: 8.50, labour: 5.00 },
    'wood':        { material: 14.00, labour: 7.50 },
    'vinyl':       { material: 18.00, labour: 6.00 },
    'wrought-iron':{ material: 28.00, labour: 9.00 },
    'aluminum':    { material: 22.00, labour: 7.00 },
    'split-rail':  { material: 9.00, labour: 4.00 },
    'farm-field':  { material: 5.00, labour: 3.50 },
    'welded-wire': { material: 6.00, labour: 4.00 }
  };

  // Height multipliers (base = 6ft)
  const HEIGHT_MULTIPLIERS = {
    3: 0.65, 4: 0.75, 5: 0.88, 6: 1.00,
    7: 1.15, 8: 1.30, 10: 1.55, 12: 1.80
  };

  // Soil difficulty multipliers for labour
  const SOIL_MULTIPLIERS = {
    'normal': 1.00,
    'clay':   1.20,
    'rocky':  1.50,
    'frozen': 1.75
  };

  // Installation type multipliers
  const INSTALL_MULTIPLIERS = {
    'residential': 1.00,
    'commercial':  1.15,
    'industrial':  1.30
  };

  // Default rates
  const TAX_RATE = 0.13;
  const LABOUR_RATE_PER_HOUR = 65;
  const EQUIPMENT_RATE_PER_DAY = 350;
  const CONCRETE_COST_PER_POST = 12.50;
  const POST_COST_BY_HEIGHT = {
    3: 8, 4: 10, 5: 14, 6: 18, 7: 22, 8: 26, 10: 35, 12: 45
  };
  const GATE_COST = {
    'none': 0,
    'walk-single': 185,
    'walk-double': 320,
    'drive-single': 450,
    'drive-double': 780,
    'cantilever': 1200
  };

  // ── Main calculation function ─────────────────────────────────
  function calculate(specs, adjustments = {}) {
    const {
      fenceType = 'chain-link',
      height = 6,
      linearFeet = 0,
      numberPosts = 0,
      numberGates = 0,
      gateType = 'none',
      barbedWire = false,
      privacySlats = false,
      tensionWire = false,
      soilType = 'normal',
      installationType = 'residential',
      postSpacing = 8
    } = specs;

    const {
      permitCost = 0,
      contingencyPct = 5,
      discount = 0,
      labourRateOverride = null
    } = adjustments;

    const lf = parseFloat(linearFeet) || 0;
    if (lf <= 0) return null;

    const h = parseInt(height) || 6;
    const rates = MATERIAL_RATES[fenceType] || MATERIAL_RATES['chain-link'];
    const heightMult = HEIGHT_MULTIPLIERS[h] || 1.0;
    const soilMult = SOIL_MULTIPLIERS[soilType] || 1.0;
    const installMult = INSTALL_MULTIPLIERS[installationType] || 1.0;
    const labourRate = labourRateOverride || LABOUR_RATE_PER_HOUR;

    // Number of posts (if not specified)
    const postsSpacing = parseInt(postSpacing) || 8;
    const calcPosts = numberPosts > 0 ? parseInt(numberPosts) : Math.ceil(lf / postsSpacing) + 1;
    const calcGates = parseInt(numberGates) || 0;

    // ── Material costs ────────────────────────────────────────
    const fenceMaterial = lf * rates.material * heightMult;
    const postMaterial = calcPosts * (POST_COST_BY_HEIGHT[h] || 18);
    const concreteCost = calcPosts * CONCRETE_COST_PER_POST;
    const gateCost = calcGates * (GATE_COST[gateType] || 0);

    // Addons
    const barbedWireCost = barbedWire ? lf * 1.80 : 0;
    const privacySlatsCost = privacySlats ? lf * 3.50 : 0;
    const tensionWireCost = tensionWire ? lf * 0.90 : 0;

    const totalMaterial = fenceMaterial + postMaterial + concreteCost + gateCost +
                          barbedWireCost + privacySlatsCost + tensionWireCost;

    // ── Labour costs ──────────────────────────────────────────
    const labourHoursPerLF = (rates.labour / labourRate) * soilMult * installMult;
    const totalLabourHours = lf * labourHoursPerLF + (calcPosts * 0.5);
    const labourCost = totalLabourHours * labourRate;

    // ── Equipment costs ───────────────────────────────────────
    const projectDays = Math.ceil(totalLabourHours / 8);
    const equipmentCost = Math.max(1, projectDays) * EQUIPMENT_RATE_PER_DAY;

    // ── Subtotal before adjustments ───────────────────────────
    const baseSubtotal = totalMaterial + labourCost + equipmentCost + parseFloat(permitCost || 0);

    // Contingency
    const contingencyAmt = baseSubtotal * (parseFloat(contingencyPct) / 100);

    // Subtotal after contingency
    const subtotalBeforeDiscount = baseSubtotal + contingencyAmt;

    // Discount
    const discountAmt = parseFloat(discount) || 0;
    const subtotal = Math.max(0, subtotalBeforeDiscount - discountAmt);

    // Tax
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // ── Line items for display ────────────────────────────────
    const lineItems = [
      { desc: `${fenceType.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} Fence Material`, qty: lf, unit: 'LF', unitCost: rates.material * heightMult, total: fenceMaterial },
      { desc: `Posts (${h}ft, ${calcPosts} posts)`, qty: calcPosts, unit: 'ea', unitCost: POST_COST_BY_HEIGHT[h] || 18, total: postMaterial },
      { desc: 'Concrete (post holes)', qty: calcPosts, unit: 'ea', unitCost: CONCRETE_COST_PER_POST, total: concreteCost }
    ];

    if (calcGates > 0 && gateType !== 'none') {
      lineItems.push({ desc: `${gateType.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} Gate(s)`, qty: calcGates, unit: 'ea', unitCost: GATE_COST[gateType] || 0, total: gateCost });
    }
    if (barbedWire) lineItems.push({ desc: 'Barbed Wire (3 strands)', qty: lf, unit: 'LF', unitCost: 1.80, total: barbedWireCost });
    if (privacySlats) lineItems.push({ desc: 'Privacy Slats', qty: lf, unit: 'LF', unitCost: 3.50, total: privacySlatsCost });
    if (tensionWire) lineItems.push({ desc: 'Bottom Tension Wire', qty: lf, unit: 'LF', unitCost: 0.90, total: tensionWireCost });

    lineItems.push(
      { desc: 'Labour (installation)', qty: totalLabourHours.toFixed(1), unit: 'hrs', unitCost: labourRate, total: labourCost },
      { desc: `Equipment Rental (${projectDays} day${projectDays !== 1 ? 's' : ''})`, qty: projectDays, unit: 'day', unitCost: EQUIPMENT_RATE_PER_DAY, total: equipmentCost }
    );

    if (parseFloat(permitCost) > 0) {
      lineItems.push({ desc: 'Permit Fees', qty: 1, unit: 'lump', unitCost: parseFloat(permitCost), total: parseFloat(permitCost) });
    }
    if (contingencyAmt > 0) {
      lineItems.push({ desc: `Contingency (${contingencyPct}%)`, qty: 1, unit: 'lump', unitCost: contingencyAmt, total: contingencyAmt });
    }
    if (discountAmt > 0) {
      lineItems.push({ desc: 'Discount', qty: 1, unit: 'lump', unitCost: -discountAmt, total: -discountAmt });
    }

    return {
      lineItems,
      materialCost: round2(totalMaterial),
      labourHours: round2(totalLabourHours),
      labourCost: round2(labourCost),
      equipmentCost: round2(equipmentCost),
      permitCost: round2(parseFloat(permitCost) || 0),
      contingency: round2(contingencyAmt),
      discount: round2(discountAmt),
      subtotal: round2(subtotal),
      tax: round2(tax),
      total: round2(total),
      calcPosts,
      projectDays
    };
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function formatCurrency(n) {
    return '$' + Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ── Change order recalculation ────────────────────────────────
  function applyChangeOrder(currentTotal, materialDelta, labourDelta) {
    const newSubtotal = (parseFloat(currentTotal) / (1 + TAX_RATE)) +
                        parseFloat(materialDelta || 0) +
                        parseFloat(labourDelta || 0);
    const newTax = newSubtotal * TAX_RATE;
    return round2(newSubtotal + newTax);
  }

  // ── Extras total ──────────────────────────────────────────────
  function calcExtrasTotal(extras) {
    return extras.reduce((sum, e) => sum + (parseFloat(e.qty) * parseFloat(e.unitPrice)), 0);
  }

  // ── Crew total ────────────────────────────────────────────────
  function calcCrewTotal(crew) {
    return crew.reduce((sum, m) => sum + (parseFloat(m.hours) * parseFloat(m.rate)), 0);
  }

  return {
    calculate,
    formatCurrency,
    applyChangeOrder,
    calcExtrasTotal,
    calcCrewTotal,
    TAX_RATE,
    LABOUR_RATE_PER_HOUR
  };
})();
