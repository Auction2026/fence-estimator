/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Materials Calculation Engine
 * Calculates all required materials based on fence specs & footage
 */
'use strict';

// ============================================================
// MATERIAL PRICE DATABASE (Chain-Link focus; extend for other types)
// ============================================================
const MATERIAL_PRICES = {
  // Chain-Link Fabric (per roll – 50 ft)
  'CL-FABRIC-4-11-GAL':  { desc: 'Chain Link Fabric 4ft 11ga Galvanized',     unit: 'Roll/50ft', price: 42.50 },
  'CL-FABRIC-5-11-GAL':  { desc: 'Chain Link Fabric 5ft 11ga Galvanized',     unit: 'Roll/50ft', price: 48.75 },
  'CL-FABRIC-6-11-GAL':  { desc: 'Chain Link Fabric 6ft 11ga Galvanized',     unit: 'Roll/50ft', price: 56.00 },
  'CL-FABRIC-8-11-GAL':  { desc: 'Chain Link Fabric 8ft 11ga Galvanized',     unit: 'Roll/50ft', price: 72.00 },
  'CL-FABRIC-4-11-BLK':  { desc: 'Chain Link Fabric 4ft 11ga Black',          unit: 'Roll/50ft', price: 58.00 },
  'CL-FABRIC-6-11-BLK':  { desc: 'Chain Link Fabric 6ft 11ga Black',          unit: 'Roll/50ft', price: 78.50 },

  // Terminal Posts (per post)
  'POST-TERM-2.5-GAL':   { desc: 'Terminal Post 2-1/2" Galvanized',           unit: 'Each', price: 18.50 },
  'POST-TERM-3-GAL':     { desc: 'Terminal Post 3" Galvanized',               unit: 'Each', price: 24.00 },
  'POST-TERM-4-GAL':     { desc: 'Terminal Post 4" Galvanized',               unit: 'Each', price: 32.00 },
  'POST-TERM-2.5-BLK':   { desc: 'Terminal Post 2-1/2" Black',                unit: 'Each', price: 22.00 },
  'POST-TERM-3-BLK':     { desc: 'Terminal Post 3" Black',                    unit: 'Each', price: 28.50 },

  // Line Posts (per post)
  'POST-LINE-1.66-GAL':  { desc: 'Line Post 1-5/8" Galvanized',              unit: 'Each', price: 11.50 },
  'POST-LINE-2-GAL':     { desc: 'Line Post 2" Galvanized',                  unit: 'Each', price: 14.75 },
  'POST-LINE-2.5-GAL':   { desc: 'Line Post 2-1/2" Galvanized',              unit: 'Each', price: 18.00 },
  'POST-LINE-1.66-BLK':  { desc: 'Line Post 1-5/8" Black',                   unit: 'Each', price: 14.00 },

  // Top Rail (per 21ft stick)
  'RAIL-TOP-1.66-GAL':   { desc: 'Top Rail 1-5/8" Galvanized 21ft',          unit: 'Stick', price: 16.50 },
  'RAIL-TOP-2-GAL':      { desc: 'Top Rail 2" Galvanized 21ft',              unit: 'Stick', price: 21.00 },
  'RAIL-TOP-1.66-BLK':   { desc: 'Top Rail 1-5/8" Black 21ft',               unit: 'Stick', price: 20.00 },

  // Tension Wire (per 1000ft roll)
  'WIRE-TENSION-GAL':    { desc: 'Tension Wire Galvanized 12.5ga 1000ft',    unit: 'Roll',  price: 38.00 },
  'WIRE-TENSION-BLK':    { desc: 'Tension Wire Black 12.5ga 1000ft',         unit: 'Roll',  price: 45.00 },

  // Post Caps
  'CAP-LINE-GAL':        { desc: 'Line Post Cap Galvanized',                  unit: 'Each', price:  0.85 },
  'CAP-TERM-GAL':        { desc: 'Terminal Post Cap Galvanized',              unit: 'Each', price:  1.10 },

  // Tension Bands (per bag of 10)
  'BAND-TENSION-GAL':    { desc: 'Tension Band Galvanized (bag/10)',          unit: 'Bag',  price:  5.50 },
  'BAND-TENSION-BLK':    { desc: 'Tension Band Black (bag/10)',               unit: 'Bag',  price:  6.75 },

  // Brace Bands (per bag of 10)
  'BAND-BRACE-GAL':      { desc: 'Brace Band Galvanized (bag/10)',            unit: 'Bag',  price:  4.25 },

  // Rail Ends (per bag of 10)
  'RAIL-END-GAL':        { desc: 'Rail End Galvanized (bag/10)',              unit: 'Bag',  price:  6.00 },

  // Tie Wire (per bag of 100)
  'WIRE-TIE-GAL':        { desc: 'Tie Wire Galvanized (bag/100)',             unit: 'Bag',  price:  7.50 },
  'WIRE-TIE-BLK':        { desc: 'Tie Wire Black (bag/100)',                  unit: 'Bag',  price:  8.50 },

  // Concrete (80lb bag)
  'CONCRETE-80':         { desc: 'Concrete Mix 80lb Bag',                    unit: 'Bag',  price:  6.25 },

  // Barbed Wire (per roll 1320ft)
  'WIRE-BARBED':         { desc: 'Barbed Wire 12.5ga 1320ft Roll',           unit: 'Roll',  price: 48.00 },

  // Gates – Walk (4ft)
  'GATE-WALK-4-GAL':     { desc: 'Walk Gate 4ft Galvanized',                 unit: 'Each', price: 85.00 },
  'GATE-WALK-4-BLK':     { desc: 'Walk Gate 4ft Black',                      unit: 'Each', price: 110.00 },

  // Gate Hardware
  'GATE-HINGE-GAL':      { desc: 'Gate Hinge Set Galvanized',                unit: 'Set',  price: 14.00 },
  'GATE-LATCH-GAL':      { desc: 'Gate Latch Galvanized',                    unit: 'Each', price:  8.50 },
  'GATE-FORK-GAL':       { desc: 'Gate Fork Latch Galvanized',               unit: 'Each', price: 12.00 },
};

// ============================================================
// MAIN CALCULATION FUNCTION
// ============================================================
function calculateMaterials() {
  const footage   = parseFloat(document.getElementById('total-footage')?.value || 0);
  const fenceType = document.getElementById('fence-type')?.value || 'chain-link';
  const height    = parseInt(document.getElementById('fence-height')?.value || 6, 10);
  const color     = document.getElementById('fence-color')?.value || 'galvanized';
  const postSpace = parseFloat(document.getElementById('post-spacing')?.value || 10);
  const gatesCount= parseInt(document.getElementById('gates-count')?.value || 0, 10);
  const barbedWire= document.getElementById('barbed-wire')?.value || 'none';
  const termPost  = document.getElementById('terminal-post')?.value || '2.5';
  const linePost  = document.getElementById('line-post')?.value || '1.66';
  const topRail   = document.getElementById('top-rail')?.value || '1.66';

  if (!footage) {
    alert('Please enter the total linear footage in Tab 3 – Layout first.');
    return;
  }

  const finish = color === 'galvanized' ? 'GAL' : 'BLK';
  const items  = [];

  if (fenceType === 'chain-link') {
    // Fabric rolls needed (50 ft per roll, add 10% waste)
    const rollsNeeded = Math.ceil((footage * 1.05) / 50);
    const fabricSku   = `CL-FABRIC-${height}-11-${finish}`;
    if (MATERIAL_PRICES[fabricSku]) {
      items.push({ sku: fabricSku, qty: rollsNeeded });
    } else {
      // fallback to 6ft galvanized
      items.push({ sku: 'CL-FABRIC-6-11-GAL', qty: rollsNeeded });
    }

    // Line posts (every postSpace feet)
    const linePosts = Math.ceil(footage / postSpace) - 1;
    const linePostSku = `POST-LINE-${linePost}-${finish}`;
    items.push({ sku: MATERIAL_PRICES[linePostSku] ? linePostSku : 'POST-LINE-1.66-GAL', qty: linePosts });

    // Terminal posts – corners + ends (estimate 4 corners + 2 ends)
    const termPostCount = 6;
    const termPostSku   = `POST-TERM-${termPost}-${finish}`;
    items.push({ sku: MATERIAL_PRICES[termPostSku] ? termPostSku : 'POST-TERM-2.5-GAL', qty: termPostCount });

    // Top rail (21 ft sticks)
    const railSticks = Math.ceil(footage / 21) + 1;
    const railSku    = `RAIL-TOP-${topRail}-${finish}`;
    items.push({ sku: MATERIAL_PRICES[railSku] ? railSku : 'RAIL-TOP-1.66-GAL', qty: railSticks });

    // Tension wire (1 run bottom + 1 run top mid for > 5ft)
    const tensionRuns  = height >= 5 ? 2 : 1;
    const tensionRolls = Math.ceil((footage * tensionRuns) / 1000) + 1;
    items.push({ sku: finish === 'BLK' ? 'WIRE-TENSION-BLK' : 'WIRE-TENSION-GAL', qty: tensionRolls });

    // Line post caps
    items.push({ sku: 'CAP-LINE-GAL', qty: linePosts });

    // Terminal post caps
    items.push({ sku: 'CAP-TERM-GAL', qty: termPostCount });

    // Tension bands (3 per terminal post × termPostCount ÷ 10 bags)
    const tensionBands = Math.ceil(termPostCount * 3 / 10);
    items.push({ sku: finish === 'BLK' ? 'BAND-TENSION-BLK' : 'BAND-TENSION-GAL', qty: tensionBands });

    // Brace bands (2 per line post ÷ 10 bags)
    const braceBands = Math.ceil(linePosts * 2 / 10);
    items.push({ sku: 'BAND-BRACE-GAL', qty: braceBands });

    // Rail ends (2 per terminal post ÷ 10 bags)
    const railEnds = Math.ceil(termPostCount * 2 / 10);
    items.push({ sku: 'RAIL-END-GAL', qty: railEnds });

    // Tie wire (every 12 inches on posts, ~4 per 10 ft section)
    const tieBags = Math.ceil(footage / 25);
    items.push({ sku: finish === 'BLK' ? 'WIRE-TIE-BLK' : 'WIRE-TIE-GAL', qty: tieBags });

    // Concrete (2 bags per post)
    const totalPosts = linePosts + termPostCount;
    const concreteBags = totalPosts * 2;
    items.push({ sku: 'CONCRETE-80', qty: concreteBags });

    // Barbed wire strands
    if (barbedWire !== 'none') {
      const strands = parseInt(barbedWire.split('-')[0], 10) || 1;
      const barbRolls = Math.ceil((footage * strands) / 1320) + 1;
      items.push({ sku: 'WIRE-BARBED', qty: barbRolls });
    }

    // Gates
    if (gatesCount > 0) {
      items.push({ sku: finish === 'BLK' ? 'GATE-WALK-4-BLK' : 'GATE-WALK-4-GAL', qty: gatesCount });
      items.push({ sku: 'GATE-HINGE-GAL', qty: gatesCount });
      items.push({ sku: 'GATE-LATCH-GAL', qty: gatesCount });
    }
  } else {
    // Placeholder for wood / vinyl / ornamental
    alert(`Material calculation for ${fenceType} fence is available. Please contact your supplier for pricing.`);
    return;
  }

  // Render to table
  renderMaterialsTable(items);
}

function renderMaterialsTable(items) {
  const tbody = document.getElementById('materials-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  let subtotal = 0;
  const rendered = [];

  items.forEach(item => {
    const price = MATERIAL_PRICES[item.sku];
    if (!price) return;
    const lineTotal = item.qty * price.price;
    subtotal += lineTotal;
    rendered.push({ sku: item.sku, qty: item.qty, price, lineTotal });
  });

  tbody.innerHTML = rendered.map(r => `
    <tr>
      <td>${r.sku}</td>
      <td>${r.price.desc}</td>
      <td>${r.price.unit}</td>
      <td>${r.qty}</td>
      <td>$${r.price.price.toFixed(2)}</td>
      <td>$${r.lineTotal.toFixed(2)}</td>
      <td><input type="number" value="${r.qty}" min="0" style="width:70px"
          onchange="overrideMaterialQty(this, '${r.sku}', ${r.price.price})" /></td>
    </tr>`).join('');

  const subEl = document.getElementById('materials-subtotal');
  if (subEl) subEl.textContent = '$' + subtotal.toFixed(2);

  // Store for summary
  AppState.materials = rendered;
  AppState.estimateSummary = AppState.estimateSummary || {};
  AppState.estimateSummary.materialsTotal = subtotal;

  // Update summary bar
  const bar = document.getElementById('materials-summary-bar');
  if (bar) bar.textContent = `Materials Subtotal: $${subtotal.toFixed(2)} | ${rendered.length} line items`;

  calcSummary();
  setStatus(`Materials calculated: $${subtotal.toFixed(2)}`);
}

function overrideMaterialQty(input, sku, unitPrice) {
  const newQty   = parseFloat(input.value || 0);
  const tr       = input.closest('tr');
  const totalCell = tr.querySelector('td:nth-child(6)');
  if (totalCell) totalCell.textContent = '$' + (newQty * unitPrice).toFixed(2);

  // Recalculate subtotal
  let total = 0;
  document.querySelectorAll('#materials-body tr').forEach(row => {
    const totalTd = row.querySelector('td:nth-child(6)');
    if (totalTd) total += parseFloat(totalTd.textContent.replace('$', '') || 0);
  });
  const subEl = document.getElementById('materials-subtotal');
  if (subEl) subEl.textContent = '$' + total.toFixed(2);
  AppState.estimateSummary.materialsTotal = total;
  calcSummary();
}
