// TAB 7: SUPPLIERS
const DEFAULT_SUPPLIERS = [
  { id:1, name:'Fence Depot Wholesale', contact:'John Smith', phone:'(800)555-1234', email:'john@fencedepot.com', terms:'Net 30' },
  { id:2, name:'National Wire & Post',   contact:'Jane Doe',   phone:'(800)555-5678', email:'orders@natiwire.com', terms:'Net 15' },
];

function suppliersTabRefresh() {
  if (!state.suppliers) state.suppliers = DEFAULT_SUPPLIERS;
  const grid = document.getElementById('suppliersGrid');
  if (!state.suppliers.length) { grid.innerHTML = '<p class="empty-state">No suppliers configured.</p>'; return; }
  grid.innerHTML = state.suppliers.map(s => `
    <div class="supplier-card">
      <strong>${s.name}</strong>
      <div>${s.contact}</div>
      <div>${s.phone}</div>
      <div>${s.email}</div>
      <div>Terms: ${s.terms}</div>
      <button class="btn btn-danger btn-sm" style="margin-top:.5rem" onclick="deleteSupplier(${s.id})">Remove</button>
    </div>`).join('');
}

function suppliersTabAdd() {
  app.openModal(`
    <h3>Add Supplier</h3>
    <div class="form-group"><label>Name</label><input id="sName" class="form-control" /></div>
    <div class="form-group"><label>Contact</label><input id="sContact" class="form-control" /></div>
    <div class="form-group"><label>Phone</label><input id="sPhone" class="form-control" /></div>
    <div class="form-group"><label>Email</label><input id="sEmail" class="form-control" /></div>
    <div class="form-group"><label>Terms</label><input id="sTerms" class="form-control" value="Net 30" /></div>
    <button class="btn btn-primary" onclick="saveSupplierModal()">Save</button>`);
}

function saveSupplierModal() {
  if (!state.suppliers) state.suppliers = [];
  state.suppliers.push({
    id: Date.now(),
    name: document.getElementById('sName').value,
    contact: document.getElementById('sContact').value,
    phone: document.getElementById('sPhone').value,
    email: document.getElementById('sEmail').value,
    terms: document.getElementById('sTerms').value,
  });
  saveState(); app.closeModal(); suppliersTabRefresh();
}

function deleteSupplier(id) {
  state.suppliers = (state.suppliers||[]).filter(s => s.id !== id);
  saveState(); suppliersTabRefresh();
}
