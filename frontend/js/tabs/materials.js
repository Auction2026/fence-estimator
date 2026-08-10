/* ═══════════════════════════════════════════════════════════════
   materials.js – material / cost browser
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const MATERIAL_CATALOG = [
  { plu:'CL-MESH',   desc:'Chain Link Mesh 4ft',      dept:'Chain Link', unit:'Roll',  cost:62,   price:89.99 },
  { plu:'CL-MESH6',  desc:'Chain Link Mesh 6ft',      dept:'Chain Link', unit:'Roll',  cost:79,   price:119.99 },
  { plu:'CL-POST4',  desc:'Line Post 1-3/8" 5ft',     dept:'Chain Link', unit:'Each',  cost:8.50, price:14.99 },
  { plu:'CL-POST7',  desc:'Line Post 1-3/8" 7ft',     dept:'Chain Link', unit:'Each',  cost:10.50,price:18.99 },
  { plu:'CL-TOPRL',  desc:'Top Rail 1-3/8" 21ft',     dept:'Chain Link', unit:'Each',  cost:11,   price:18.49 },
  { plu:'CL-TENWIRE',desc:'Tension Wire 12.5ga 170ft',dept:'Chain Link', unit:'Roll',  cost:14,   price:24.99 },
  { plu:'CL-BRBND',  desc:'Brace Band 1-3/8"',        dept:'Commercial Fitting',unit:'Each',cost:.42,price:.89 },
  { plu:'CL-SLIPFIT',desc:'Slip Fit Rail End',         dept:'Commercial Fitting',unit:'Each',cost:.55,price:1.29 },
  { plu:'CL-TENSBAR',desc:'Tension Bar',               dept:'Commercial Fitting',unit:'Each',cost:1.20,price:2.49 },
  { plu:'CL-CONCRETE',desc:'Concrete 80lb',            dept:'Hardware',  unit:'Bag',   cost:3.80, price:6.49 },
  { plu:'WD-PICKET6',desc:'Cedar Picket 6ft',          dept:'Wood',      unit:'Each',  cost:1.50, price:2.89 },
  { plu:'WD-POST4X4',desc:'4x4x10 Cedar Post',         dept:'Wood',      unit:'Each',  cost:10.99,price:18.99 },
  { plu:'WD-RAIL2X4',desc:'2x4x8 Pressure Treated Rail',dept:'Wood',    unit:'Each',  cost:2.99, price:5.29 },
  { plu:'WD-SCREWS', desc:'Decking Screws 1lb',        dept:'Hardware',  unit:'Box',   cost:4.50, price:7.99 },
  { plu:'VY-PANEL6', desc:'Vinyl Privacy Panel 6ft',   dept:'Vinyl',     unit:'Each',  cost:34,   price:59.99 },
  { plu:'VY-POST8',  desc:'Vinyl Post 8ft',            dept:'Vinyl',     unit:'Each',  cost:19,   price:34.99 },
  { plu:'OM-PANEL4', desc:'Ornamental Panel 4ft',      dept:'Ornamental',unit:'Each',  cost:49,   price:89.99 },
  { plu:'OM-POST6',  desc:'Ornamental Post 6ft',       dept:'Ornamental',unit:'Each',  cost:24,   price:44.99 },
  { plu:'AL-PANEL4', desc:'Aluminum Panel 4ft',        dept:'Aluminum',  unit:'Each',  cost:38,   price:69.99 },
  { plu:'AL-POST',   desc:'Aluminum Post 5ft',         dept:'Aluminum',  unit:'Each',  cost:16,   price:29.99 },
];

document.addEventListener('tabLoad', e => {
  if (e.detail !== 'materials') return;
  renderMaterials(MATERIAL_CATALOG);
});

document.getElementById('mat-search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  renderMaterials(MATERIAL_CATALOG.filter(r =>
    r.desc.toLowerCase().includes(q) || r.plu.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q)
  ));
});

function renderMaterials(rows) {
  document.getElementById('mat-body').innerHTML = rows.map(r => {
    const margin = r.cost ? (((r.price - r.cost) / r.price) * 100).toFixed(1) + '%' : '—';
    return `<tr>
      <td>${r.plu}</td>
      <td>${r.desc}</td>
      <td>${r.dept}</td>
      <td>${r.unit}</td>
      <td>${App.fmtCurrency(r.cost)}</td>
      <td>${App.fmtCurrency(r.price)}</td>
      <td>${margin}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="7">No items found</td></tr>';
}

document.getElementById('export-materials-btn').addEventListener('click', () => {
  const csv = ['PLU,Description,Dept,Unit,Cost,Price,Margin',
    ...MATERIAL_CATALOG.map(r => `${r.plu},"${r.desc}",${r.dept},${r.unit},${r.cost},${r.price}`)
  ].join('\n');
  downloadCSV('materials.csv', csv);
});

function downloadCSV(filename, csv) {
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename;
  a.click();
}
