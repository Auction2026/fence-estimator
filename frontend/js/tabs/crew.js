// TAB 16: CREW MANAGEMENT
function crewTabRefresh() {
  if (!state.crew) state.crew = [];
  const grid = document.getElementById('crewGrid');
  if (!state.crew.length) { grid.innerHTML = '<p class="empty-state">No crew members yet.</p>'; return; }
  grid.innerHTML = state.crew.map(c => `
    <div class="crew-card">
      <strong>${c.name}</strong>
      <div>${c.role}</div>
      <div>${c.phone||''}</div>
      <div>Rate: $${c.rate||0}/hr</div>
      <button class="btn btn-danger btn-sm" style="margin-top:.5rem" onclick="deleteCrewMember(${c.id})">Remove</button>
    </div>`).join('');
}

function crewTabAdd() {
  app.openModal(`
    <h3>Add Crew Member</h3>
    <div class="form-group"><label>Name</label><input id="cName" class="form-control" /></div>
    <div class="form-group"><label>Role</label>
      <select id="cRole" class="form-control">
        <option>Foreman</option><option>Installer</option><option>Laborer</option><option>Driver</option>
      </select>
    </div>
    <div class="form-group"><label>Phone</label><input id="cPhone" class="form-control" /></div>
    <div class="form-group"><label>Hourly Rate ($)</label><input id="cRate" type="number" class="form-control" value="20" /></div>
    <button class="btn btn-primary" onclick="saveCrewMember()">Save</button>`);
}

function saveCrewMember() {
  if (!state.crew) state.crew = [];
  state.crew.push({ id:Date.now(), name: document.getElementById('cName').value, role: document.getElementById('cRole').value, phone: document.getElementById('cPhone').value, rate: parseFloat(document.getElementById('cRate').value)||0 });
  saveState(); app.closeModal(); crewTabRefresh();
}

function deleteCrewMember(id) {
  state.crew = (state.crew||[]).filter(c => c.id !== id);
  saveState(); crewTabRefresh();
}
