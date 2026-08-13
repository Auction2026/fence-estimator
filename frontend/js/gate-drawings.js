/* ============================================================
   GATE SHOP DRAWING GENERATOR
   Parametric CAD-style gate drawings (SVG) you can modify:
   pick the gate style, change width/height, and the drawing plus
   the parts list redraw instantly. Parts lists come 100% from the
   owner's research (FENCE_MATERIAL_SPECIFICATIONS.md gate sections).
   ============================================================ */
const GATE_SPECS = {
  chainlink: {
    label: 'Chain Link Gate (CAN/CGSB-138.3-2019)',
    parts: [
      { item: 'Gate Frame (1\u00BC" tube)', qty: 1, unit: 'Set', desc: 'Pre-fabricated per CAN/CGSB' },
      { item: 'Gate Hinges (Heavy-duty)', qty: 2, unit: 'Each', desc: '2-3" adjustable gate hinges' },
      { item: 'Gate Latch (Gravity or manual)', qty: 1, unit: 'Each', desc: 'Locking mechanism' },
      { item: 'Gate Chain (Safety)', qty: 1, unit: 'Each', desc: 'To prevent full swing (CSA B95.1)' },
      { item: 'Gate Fabric (2" mesh, 9 GA)', qty: 1, unit: 'Gate', desc: 'Pre-wrapped or installed on-site' },
      { item: 'Gate Posts (1\u215E" OD \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: 'For gate frame mounting' }
    ]
  },
  vinyl: {
    label: 'Vinyl Gate (Homeland Vinyl Products)',
    parts: [
      { item: 'Gate Frame (Vinyl)', qty: 1, unit: 'Set', desc: 'Pre-fabricated (HVP-GATE-FRAME-4x5)' },
      { item: 'Gate Boards (5\u215D" \u00D7 60")', qty: 8, unit: 'Each', desc: 'Matching fence boards (HVP-BOARD-PRIVACY-60)' },
      { item: 'Gate Hinges (S/S Adjustable)', qty: 2, unit: 'Each', desc: 'Heavy-duty for PVC (HVP-HINGE-SS-ADJ)' },
      { item: 'Gate Latch Assembly', qty: 1, unit: 'Each', desc: 'Self-closing mechanism (HVP-LATCH-AUTO)' },
      { item: 'Gate Handle', qty: 1, unit: 'Each', desc: 'Stainless steel (HVP-HANDLE-SS)' },
      { item: 'Gate Posts (4" \u00D7 4" \u00D7 8\u2032)', qty: 2, unit: 'Each', desc: 'Reinforced for gate (HVP-4x4-8)' }
    ]
  },
  wood: {
    label: 'Wood Gate (CSA O141)',
    parts: [
      { item: 'Gate Frame (2\u00D76 PT wood)', qty: 4, unit: 'Pieces', desc: 'Top, bottom, sides' },
      { item: 'Gate Boards (1" \u00D7 5\u215D" \u00D7 60")', qty: 10, unit: 'Each', desc: 'Matching fence boards' },
      { item: 'Gate Hinges (Heavy-duty galv.)', qty: 2, unit: 'Each', desc: '3-4" adjustable hinges (CSA G40.8)' },
      { item: 'Gate Latch (Galvanized)', qty: 1, unit: 'Each', desc: 'Manual or self-closing (CSA G40.8)' },
      { item: 'Diagonal Bracing', qty: 1, unit: 'Set', desc: '2\u00D72 PT cross-bracing (optional)' },
      { item: 'Gate Posts (4\u00D74 or 6\u00D76 \u00D7 8\u2032 PT)', qty: 2, unit: 'Each', desc: 'Heavier for gate support' }
    ]
  },
  wroughtiron: {
    label: 'Wrought Iron Gate (Cloutier Direct)',
    parts: [
      { item: 'Gate Frame (Wrought iron)', qty: 1, unit: 'Set', desc: 'Pre-fabricated Cloutier style (CD-GATE-FRAME-4x4)' },
      { item: 'Gate Pickets (\u00BE" sq \u00D7 48")', qty: 8, unit: 'Each', desc: 'Matching fence design (CD-PICKET-SPEAR-48)' },
      { item: 'Gate Hinges (Heavy-duty, ornamental)', qty: 2, unit: 'Each', desc: 'Steel, 4-5" heavy-duty Cloutier (CD-HINGE-4-ORN)' },
      { item: 'Gate Latch (Decorative)', qty: 1, unit: 'Each', desc: 'Matching Cloutier style (CD-LATCH-ORN)' },
      { item: 'Gate Posts (2" sq \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: 'Reinforced for gate mounting (CD-POST-2-6.5)' }
    ]
  }
};

function drawGateShopDrawing() {
  const type = document.getElementById('gateType');
  const widthIn = document.getElementById('gateWidthFt');
  const heightIn = document.getElementById('gateHeightFt');
  const svgHost = document.getElementById('gateDrawingContainer');
  const partsHost = document.getElementById('gatePartsList');
  if (!type || !svgHost) return;

  const spec = GATE_SPECS[type.value];
  if (!spec) return;
  let W = parseFloat(widthIn && widthIn.value) || 4;
  let H = parseFloat(heightIn && heightIn.value) || 5;
  W = Math.min(Math.max(W, 2), 20);
  H = Math.min(Math.max(H, 3), 8);

  // Drawing scale: fit inside 640x420 with margins for dimension lines
  const margin = 80;
  const scale = Math.min((640 - margin * 2) / W, (420 - margin * 2) / H);
  const gw = W * scale, gh = H * scale;
  const x0 = (760 - gw) / 2, y0 = 60;
  const postW = 14;

  let inner = '';
  // Gate posts (left and right)
  inner += rect(x0 - postW - 6, y0 - 10, postW, gh + 40, '#5a6b7c');
  inner += rect(x0 + gw + 6, y0 - 10, postW, gh + 40, '#5a6b7c');
  // Gate outer frame
  inner += rect(x0, y0, gw, gh, 'none', '#1B2D4D', 4);

  // Style-specific infill
  if (type.value === 'chainlink') {
    let mesh = '';
    for (let dx = -gh; dx < gw + gh; dx += 14) {
      mesh += line(x0 + dx, y0, x0 + dx + gh, y0 + gh, '#8aa0b5', 1);
      mesh += line(x0 + dx + gh, y0, x0 + dx, y0 + gh, '#8aa0b5', 1);
    }
    inner += '<clipPath id="gateClip"><rect x="' + x0 + '" y="' + y0 + '" width="' + gw + '" height="' + gh + '"/></clipPath>';
    inner += '<g clip-path="url(#gateClip)">' + mesh + '</g>';
    inner += line(x0, y0 + gh / 2, x0 + gw, y0 + gh / 2, '#1B2D4D', 2); // mid brace
  } else if (type.value === 'vinyl' || type.value === 'wood') {
    const boardW = 5.625 / 12 * scale;
    for (let bx = x0 + 4; bx < x0 + gw - 4; bx += boardW + 2) {
      inner += rect(bx, y0 + 4, Math.min(boardW, x0 + gw - 4 - bx), gh - 8, type.value === 'vinyl' ? '#f4f6f8' : '#c9a36a', '#98a4b0', 1);
    }
    inner += line(x0, y0 + gh * 0.5, x0 + gw, y0 + gh * 0.5, '#1B2D4D', 3); // mid rail
    if (type.value === 'wood') inner += line(x0, y0 + gh, x0 + gw, y0, '#7a5a2f', 3); // diagonal brace
  } else if (type.value === 'wroughtiron') {
    const pk = 4 / 12 * scale * 1.2;
    for (let px = x0 + pk; px < x0 + gw - 4; px += pk * 2) {
      inner += line(px, y0 + 4, px, y0 + gh - 4, '#222', 3);
      inner += poly([[px - 4, y0 + 10], [px, y0 - 2], [px + 4, y0 + 10]], '#222'); // spear tip
    }
    inner += line(x0, y0 + gh * 0.15, x0 + gw, y0 + gh * 0.15, '#222', 3);
    inner += line(x0, y0 + gh * 0.85, x0 + gw, y0 + gh * 0.85, '#222', 3);
  }

  // Hinges (left side) and latch (right side)
  inner += rect(x0 - 8, y0 + gh * 0.15, 10, 16, '#333');
  inner += rect(x0 - 8, y0 + gh * 0.75, 10, 16, '#333');
  inner += rect(x0 + gw - 2, y0 + gh * 0.45, 12, 20, '#b3541e');

  // Dimension lines
  inner += dim(x0, y0 + gh + 34, x0 + gw, y0 + gh + 34, W + "'-0\" WIDE", false);
  inner += dim(x0 + gw + postW + 34, y0, x0 + gw + postW + 34, y0 + gh, H + "'-0\" HIGH", true);

  // Labels
  inner += text(x0 - postW - 2, y0 - 18, 'GATE POST', 11);
  inner += text(x0 + gw - 30, y0 - 18, 'GATE POST', 11);
  inner += text(x0 - 66, y0 + gh * 0.15 + 12, 'HINGE', 11);
  inner += text(x0 - 66, y0 + gh * 0.75 + 12, 'HINGE', 11);
  inner += text(x0 + gw + 16, y0 + gh * 0.45 - 6, 'LATCH', 11);

  const titleBlock =
    rect(20, 470, 720, 70, 'none', '#1B2D4D', 2) +
    line(20, 494, 740, 494, '#1B2D4D', 1) +
    text(30, 488, 'FENCE DEPOT — GATE SHOP DRAWING (modifiable working drawing)', 13, 'bold') +
    text(30, 514, 'STYLE: ' + spec.label, 12) +
    text(30, 532, 'SIZE: ' + W + "' W \u00D7 " + H + "' H   |   SCALE: NTS   |   DATE: " + new Date().toLocaleDateString() + '   |   DWG: GATE-' + type.value.toUpperCase() + '-' + W + 'x' + H, 12);

  svgHost.innerHTML = '<svg id="gateShopSvg" viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:820px;background:#fff;border:1px solid #ccc">' + inner + titleBlock + '</svg>';

  // Parts list
  if (partsHost) {
    partsHost.innerHTML = '';
    const h = document.createElement('h4');
    h.textContent = 'Gate Parts List — ' + spec.label;
    partsHost.appendChild(h);
    const table = document.createElement('table');
    table.className = 'data-table';
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    ['Item', 'Qty', 'Unit', 'Description'].forEach(t => { const th = document.createElement('th'); th.textContent = t; hr.appendChild(th); });
    thead.appendChild(hr); table.appendChild(thead);
    const tbody = document.createElement('tbody');
    spec.parts.forEach(p => {
      const tr = document.createElement('tr');
      [p.item, p.qty, p.unit, p.desc].forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    partsHost.appendChild(table);
  }

  // --- tiny SVG helpers ---
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rect(x, y, w, h, fill, stroke, sw) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 1) + '"' : '') + '/>';
  }
  function line(x1, y1, x2, y2, stroke, sw) {
    if (stroke === 'none') return '';
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + (sw || 1) + '"/>';
  }
  function poly(pts, fill) {
    return '<polygon points="' + pts.map(p => p.join(',')).join(' ') + '" fill="' + fill + '"/>';
  }
  function text(x, y, s, size, weight) {
    return '<text x="' + x + '" y="' + y + '" font-family="Arial" font-size="' + (size || 12) + '"' + (weight ? ' font-weight="' + weight + '"' : '') + ' fill="#1B2D4D">' + esc(s) + '</text>';
  }
  function dim(x1, y1, x2, y2, label, vertical) {
    let s = line(x1, y1, x2, y2, '#c0392b', 1.5);
    if (vertical) {
      s += line(x1 - 5, y1, x1 + 5, y1, '#c0392b', 1.5) + line(x2 - 5, y2, x2 + 5, y2, '#c0392b', 1.5);
      s += '<text x="' + (x1 + 10) + '" y="' + ((y1 + y2) / 2) + '" font-family="Arial" font-size="13" fill="#c0392b" transform="rotate(90 ' + (x1 + 10) + ' ' + ((y1 + y2) / 2) + ')">' + esc(label) + '</text>';
    } else {
      s += line(x1, y1 - 5, x1, y1 + 5, '#c0392b', 1.5) + line(x2, y2 - 5, x2, y2 + 5, '#c0392b', 1.5);
      s += '<text x="' + ((x1 + x2) / 2 - 34) + '" y="' + (y1 + 18) + '" font-family="Arial" font-size="13" fill="#c0392b">' + esc(label) + '</text>';
    }
    return s;
  }
}

function printGateDrawing() {
  const svgHost = document.getElementById('gateDrawingContainer');
  const partsHost = document.getElementById('gatePartsList');
  if (!svgHost || !svgHost.innerHTML) { alert('Create a gate drawing first.'); return; }
  const win = window.open('', '_blank');
  if (!win) { alert('Please allow pop-ups to print the drawing.'); return; }
  win.document.write('<html><head><title>Gate Shop Drawing</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse;margin-top:14px}td,th{border:1px solid #999;padding:6px;text-align:left;font-size:12px}</style></head><body>' + svgHost.innerHTML + (partsHost ? partsHost.innerHTML : '') + '</body></html>');
  win.document.close();
  win.print();
}

function saveGateDrawingToProject() {
  const svgHost = document.getElementById('gateDrawingContainer');
  if (!svgHost || !svgHost.innerHTML) { alert('Create a gate drawing first.'); return; }
  if (typeof appState !== 'undefined') {
    if (!appState.drawings) appState.drawings = [];
    const type = document.getElementById('gateType');
    const w = document.getElementById('gateWidthFt');
    const h = document.getElementById('gateHeightFt');
    appState.drawings.push({
      name: 'Gate Shop Drawing — ' + (type ? type.value : 'gate') + ' ' + (w ? w.value : '?') + "'x" + (h ? h.value : '?') + "'",
      type: 'image/svg+xml',
      size: svgHost.innerHTML.length,
      data: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgHost.innerHTML))),
      date: new Date().toISOString()
    });
    if (typeof saveAppState === 'function') saveAppState();
    alert('Gate shop drawing saved to this project!');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  ['gateType', 'gateWidthFt', 'gateHeightFt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', drawGateShopDrawing);
  });
  drawGateShopDrawing();
});
