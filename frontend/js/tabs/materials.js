// TAB 4: MATERIALS
const DEFAULT_MATERIALS = [
  { sku:'CL-201-G',  desc:'Chain Link Fabric 2" 11ga 6ft Galvanized', unit:'Roll', cost:89.50,  sell:135.00 },
  { sku:'CL-LP-6G',  desc:'Line Post 2-3/8" x 6ft Galvanized',        unit:'Each', cost:12.75,  sell:19.50  },
  { sku:'CL-TP-6G',  desc:'Terminal Post 2-7/8" x 6ft Galvanized',    unit:'Each', cost:18.50,  sell:27.95  },
  { sku:'WD-PP-6',   desc:'Privacy Picket 1x6x6 Dog Ear',              unit:'Each', cost:2.25,   sell:3.95   },
  { sku:'WD-RL-8',   desc:'Top Rail 2x4x8 Pressure Treated',           unit:'Each', cost:8.50,   sell:13.50  },
  { sku:'VNL-PNL-6', desc:'Vinyl Privacy Panel 6ft White',             unit:'Panel',cost:48.00,  sell:75.00  },
  { sku:'ORN-PNL-4', desc:'Ornamental Iron Panel 4ft Black',           unit:'Panel',cost:85.00,  sell:130.00 },
];

function materialsTabRefresh() {
  if (!state.materials) state.materials = DEFAULT_MATERIALS;
  renderMaterialsTable();
}

function renderMaterialsTable() {
  const tbody = document.getElementById('materialsTableBody');
  tbody.innerHTML = (state.materials || []).map((m, i) => `
    <tr>
      <td>${m.sku}</td>
      <td>${m.desc}</td>
      <td>${m.unit}</td>
      <td><input type="number" class="form-control" style="width:90px" value="${m.cost}" onchange="updateMaterial(${i},'cost',this.value)" /></td>
      <td><input type="number" class="form-control" style="width:90px" value="${m.sell}" onchange="updateMaterial(${i},'sell',this.value)" /></td>
      <td>${((m.sell - m.cost) / m.cost * 100).toFixed(1)}%</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteMaterial(${i})">Del</button></td>
    </tr>`).join('');
}

function updateMaterial(i, field, val) {
  state.materials[i][field] = parseFloat(val) || 0;
  saveState();
  renderMaterialsTable();
}

function deleteMaterial(i) {
  state.materials.splice(i, 1);
  saveState();
  renderMaterialsTable();
}

function materialsTabAddRow() {
  if (!state.materials) state.materials = [];
  state.materials.push({ sku:'NEW-'+Date.now(), desc:'New Material', unit:'Each', cost:0, sell:0 });
  saveState();
  renderMaterialsTable();
}
