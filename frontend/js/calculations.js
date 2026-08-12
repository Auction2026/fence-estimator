/**
 * FENCE DEPOT ESTIMATOR - Materials Calculation Engine
 * calculations.js
 *
 * Supports:
 *   - Chain-link (galvanized, vinyl-coated, black)
 *   - Wood (cedar, pressure-treated)
 *   - Steel post (tubular, split-rail look)
 *   - Aluminum ornamental
 *   - Vinyl PVC
 *
 * All quantities include industry-standard waste percentages.
 * Prices are pulled from INVENTORY_DB (defined in index.html).
 */

'use strict';

const Calculations = (() => {

  // ============================================================
  // CONSTANTS
  // ============================================================
  const WASTE = {
    mesh:       0.05,   // 5% mesh waste
    post:       0.10,   // 10% post spacing rounding
    hardware:   0.05,   // 5% extra hardware
    rail:       0.08,   // 8% rail waste
    picket:     0.10,   // 10% picket waste
  };

  const POST_SPACING = {
    'chain-link': 10,   // feet on-center
    'wood':        8,
    'aluminum':    6,
    'vinyl':       8,
  };

  // ============================================================
  // INVENTORY LOOKUP HELPERS
  // ============================================================

  /**
   * Find an inventory item by PLU code.
   * INVENTORY_DB is defined in the main HTML file / storage module.
   */
  function invByPlu(plu) {
    const db = (typeof INVENTORY_DB !== 'undefined') ? INVENTORY_DB : [];
    return db.find(i => i.plu === plu) || null;
  }

  /**
   * Find a mesh roll that matches height and gauge.
   * Returns { item, qty, unitPrice, totalPrice }
   */
  function findMesh(heightFt, footage, gauge = '11.5') {
    const db = (typeof INVENTORY_DB !== 'undefined') ? INVENTORY_DB : [];
    const candidates = db.filter(i =>
      i.dept === 'Chain Link Fabric' &&
      String(i.height || '').includes(String(heightFt))
    );
    const item = candidates[0] || null;
    if (!item) return null;

    const rollFt  = 50;                           // standard 50 ft roll
    const needed  = footage * (1 + WASTE.mesh);
    const rolls   = Math.ceil(needed / rollFt);
    return {
      plu:        item.plu,
      description: item.description,
      qty:        rolls,
      unit:       'Roll',
      unitPrice:  item.price || 0,
      totalPrice: rolls * (item.price || 0),
    };
  }

  /**
   * Find tension wire (top + bottom + mid if height >= 6).
   */
  function findTensionWire(heightFt, footage) {
    const db = (typeof INVENTORY_DB !== 'undefined') ? INVENTORY_DB : [];
    const item = db.find(i =>
      (i.dept === 'Chain Link Accessories' || i.dept === 'Commercial Fitting') &&
      /tension wire/i.test(i.description)
    );
    const runs = heightFt >= 6 ? 3 : 2;          // top, bottom (+ mid for 6'+)
    const spoolFt = 1000;
    const needed  = footage * runs * (1 + WASTE.hardware);
    const spools  = Math.ceil(needed / spoolFt);
    return {
      plu:        item ? item.plu : 'TW-GENERIC',
      description: 'Tension Wire',
      qty:        spools,
      unit:       '1000 ft Spool',
      unitPrice:  item ? item.price : 0,
      totalPrice: spools * (item ? item.price : 0),
    };
  }

  /**
   * Find brace bands / tie wires for the given footage.
   */
  function findBraceBand(footage) {
    const db = (typeof INVENTORY_DB !== 'undefined') ? INVENTORY_DB : [];
    const item = db.find(i => /brace band/i.test(i.description || ''));
    const qty  = Math.ceil(footage / 10 * (1 + WASTE.hardware));
    return {
      plu:        item ? item.plu : 'BB-GENERIC',
      description: 'Brace Band',
      qty,
      unit:       'Each',
      unitPrice:  item ? item.price : 0,
      totalPrice: qty * (item ? item.price : 0),
    };
  }

  // ============================================================
  // CHAIN-LINK CALCULATION
  // ============================================================
  function calcChainLink(state) {
    const { footage, heightFt, gates = [] } = state;
    const items = [];

    // ── Mesh fabric ─────────────────────────────────────────
    const mesh = findMesh(heightFt, footage);
    if (mesh) items.push({ ...mesh, category: 'Fabric' });

    // ── Line posts ──────────────────────────────────────────
    const spacing  = POST_SPACING['chain-link'];
    const linePosts = Math.ceil((footage / spacing) - 1);
    const linePostItem = invByPlu('LP-2IN-GALV') || {};
    items.push({
      plu:        linePostItem.plu || 'LP-GENERIC',
      description: `Line Post ${heightFt}\'`,
      category:   'Posts',
      qty:        linePosts,
      unit:       'Each',
      unitPrice:  linePostItem.price || 0,
      totalPrice: linePosts * (linePostItem.price || 0),
    });

    // ── Terminal (corner/end) posts ─────────────────────────
    const termPosts = 2 + (gates.length * 2);         // ends + gate posts
    items.push({
      plu:        'TP-GENERIC',
      description: `Terminal/Corner Post ${heightFt}\'`,
      category:   'Posts',
      qty:        termPosts,
      unit:       'Each',
      unitPrice:  0,
      totalPrice: 0,
    });

    // ── Top rail ────────────────────────────────────────────
    const railFt = 21;                               // standard 21 ft rail
    const rails  = Math.ceil(footage * (1 + WASTE.rail) / railFt);
    items.push({
      plu:        'RAIL-TOP-GALV',
      description: 'Top Rail — Galvanized 21 ft',
      category:   'Rail',
      qty:        rails,
      unit:       'Each (21 ft)',
      unitPrice:  0,
      totalPrice: 0,
    });

    // ── Tension wire ────────────────────────────────────────
    const tw = findTensionWire(heightFt, footage);
    if (tw) items.push({ ...tw, category: 'Hardware' });

    // ── Brace bands ─────────────────────────────────────────
    const bb = findBraceBand(footage);
    if (bb) items.push({ ...bb, category: 'Hardware' });

    // ── Gate hardware ────────────────────────────────────────
    gates.forEach((gate, idx) => {
      items.push({
        plu:        `GATE-${gate.width}W`,
        description: `Gate — ${gate.width}ft wide, ${heightFt}ft tall`,
        category:   'Gates',
        qty:        1,
        unit:       'Each',
        unitPrice:  0,
        totalPrice: 0,
      });
    });

    // ── Concrete (post footings) ─────────────────────────────
    const totalPosts = linePosts + termPosts;
    const bagsConcrete = Math.ceil(totalPosts * 1.5);  // ~1.5 bags per post
    items.push({
      plu:        'CONCRETE-60LB',
      description: 'Concrete Mix — 60 lb bag',
      category:   'Concrete',
      qty:        bagsConcrete,
      unit:       '60 lb Bag',
      unitPrice:  0,
      totalPrice: 0,
    });

    return items;
  }

  // ============================================================
  // WOOD FENCE CALCULATION
  // ============================================================
  function calcWood(state) {
    const { footage, heightFt, picketStyle = 'dog-ear', boardWidth = 6 } = state;
    const items = [];

    // Posts
    const spacing  = POST_SPACING['wood'];
    const posts    = Math.ceil(footage / spacing) + 1;
    items.push({
      plu:        'POST-4X4-8',
      description: '4×4 Pressure-Treated Post — 8 ft',
      category:   'Posts',
      qty:        posts,
      unit:       'Each',
      unitPrice:  0,
      totalPrice: 0,
    });

    // Rails (2 rails per 6 ft fence, 3 for 8 ft)
    const railsPerBay = heightFt >= 7 ? 3 : 2;
    const bays        = Math.ceil(footage / spacing);
    const rails       = bays * railsPerBay;
    items.push({
      plu:        'RAIL-2X4-8',
      description: '2×4 Pressure-Treated Rail — 8 ft',
      category:   'Rails',
      qty:        rails,
      unit:       'Each',
      unitPrice:  0,
      totalPrice: 0,
    });

    // Pickets
    const picketW  = boardWidth / 12;              // convert inches → feet
    const pickets  = Math.ceil(footage / picketW * (1 + WASTE.picket));
    items.push({
      plu:        `PICKET-${boardWidth}IN`,
      description: `${boardWidth}" Cedar Dog-Ear Picket — 6 ft`,
      category:   'Pickets',
      qty:        pickets,
      unit:       'Each',
      unitPrice:  0,
      totalPrice: 0,
    });

    // Screws / fasteners
    const screw_boxes = Math.ceil(pickets / 50);
    items.push({
      plu:        'SCREWS-2IN-LB',
      description: '2" Exterior Deck Screws — 1 lb box',
      category:   'Hardware',
      qty:        screw_boxes,
      unit:       '1 lb Box',
      unitPrice:  0,
      totalPrice: 0,
    });

    // Concrete
    const concreteBags = Math.ceil(posts * 1.5);
    items.push({
      plu:        'CONCRETE-60LB',
      description: 'Concrete Mix — 60 lb bag',
      category:   'Concrete',
      qty:        concreteBags,
      unit:       '60 lb Bag',
      unitPrice:  0,
      totalPrice: 0,
    });

    return items;
  }

  // ============================================================
  // ALUMINUM ORNAMENTAL CALCULATION
  // ============================================================
  function calcAluminum(state) {
    const { footage, heightFt, style = 'flat-top' } = state;
    const items = [];

    const spacing = POST_SPACING['aluminum'];
    const posts   = Math.ceil(footage / spacing) + 1;

    items.push({
      plu:        'AL-POST-2X2',
      description: `Aluminum Post 2"×2" — ${heightFt}ft`,
      category:   'Posts',
      qty:        posts, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    const panels = Math.ceil(footage / spacing);
    items.push({
      plu:        `AL-PANEL-${heightFt}`,
      description: `Aluminum Panel — ${heightFt}ft × ${spacing}ft`,
      category:   'Panels',
      qty:        panels, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    // Post caps
    items.push({
      plu:        'AL-POST-CAP',
      description: 'Aluminum Post Cap',
      category:   'Hardware',
      qty:        posts, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    return items;
  }

  // ============================================================
  // VINYL / PVC CALCULATION
  // ============================================================
  function calcVinyl(state) {
    const { footage, heightFt, style = 'privacy' } = state;
    const items = [];

    const spacing = POST_SPACING['vinyl'];
    const posts   = Math.ceil(footage / spacing) + 1;

    items.push({
      plu:        'VIN-POST-4X4',
      description: `Vinyl Post 4"×4" — ${heightFt}ft`,
      category:   'Posts',
      qty:        posts, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    const panels = Math.ceil(footage / spacing);
    items.push({
      plu:        `VIN-PANEL-${heightFt}`,
      description: `Vinyl Privacy Panel — ${heightFt}ft × ${spacing}ft`,
      category:   'Panels',
      qty:        panels, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    items.push({
      plu:        'VIN-POST-CAP',
      description: 'Vinyl Post Cap',
      category:   'Hardware',
      qty:        posts, unit: 'Each', unitPrice: 0, totalPrice: 0,
    });

    return items;
  }

  // ============================================================
  // TOTALS SUMMARY
  // ============================================================
  function summarize(items, taxRate) {
    const rate     = (taxRate !== undefined && taxRate !== null) ? taxRate : (typeof AppConfig !== 'undefined' ? AppConfig.taxRate : 0.05);
    const subtotal = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    const tax      = subtotal * rate;
    const total    = subtotal + tax;
    return { subtotal, tax, total, taxRate: rate };
  }

  // ============================================================
  // MAIN ENTRY POINT
  // ============================================================
  /**
   * calculateMaterials(state) → { items, subtotal, tax, total }
   *
   * state = {
   *   fenceType: 'chain-link' | 'wood' | 'aluminum' | 'vinyl',
   *   footage:   Number,   // linear feet
   *   heightFt:  Number,
   *   color:     String,
   *   taxRate:   Number,   // optional, defaults to AppConfig.taxRate
   *   gates:     [{ width: Number }],
   * }
   */
  function calculateMaterials(state) {
    let items = [];
    switch (state.fenceType) {
      case 'chain-link': items = calcChainLink(state); break;
      case 'wood':       items = calcWood(state);       break;
      case 'aluminum':   items = calcAluminum(state);   break;
      case 'vinyl':      items = calcVinyl(state);      break;
      default:
        console.warn('Unknown fence type:', state.fenceType);
    }
    const totals = summarize(items, state.taxRate);
    return { items, ...totals };
  }

  // ============================================================
  // LABOUR ESTIMATE
  // ============================================================
  function calcLabour(footage, fenceType, crewSize = 2) {
    const ratePerFt = {
      'chain-link': 3.50,
      'wood':       5.00,
      'aluminum':   4.50,
      'vinyl':      4.00,
    };
    const rate   = ratePerFt[fenceType] || 4.00;
    const labour = footage * rate;
    return {
      footage,
      rate,
      labour,
      crewHours: Math.ceil((footage / 50) * 4),  // rough: 4h per 50 ft
    };
  }

  // Public API
  function init() { /* no async setup needed */ }

  return { init, calculateMaterials, calcLabour, invByPlu, findMesh, findTensionWire, findBraceBand, summarize };
})();

window.Calculations = Calculations;
