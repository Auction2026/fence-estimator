// TAB 3: PROJECTS
function projectsTabRefresh() {
  renderProjects(getCollection('estimates'));
  populateSignOffDropdown();
}

function projectsTabFilter(query) {
  const q = query.toLowerCase();
  const filtered = getCollection('estimates').filter(e =>
    (e.customer?.name||'').toLowerCase().includes(q) ||
    (e.estimateNum||'').toLowerCase().includes(q)
  );
  renderProjects(filtered);
}

function renderProjects(estimates) {
  const grid = document.getElementById('projectsGrid');
  if (!estimates.length) {
    grid.innerHTML = '<p class="empty-state">No projects yet.</p>'; return;
  }
  grid.innerHTML = estimates.map(e => `
    <div class="project-card" onclick="openProjectModal(${e.id})">
      <div class="project-card-header">
        <span class="project-card-name">${e.customer?.name||'Unknown'}</span>
        <span class="project-card-status status-${e.status}">${e.status}</span>
      </div>
      <div>${e.estimateNum}</div>
      <div>${e.specs?.type||''} — ${e.specs?.footage||0} ft</div>
      <div style="font-weight:700;color:var(--primary)">$${(e.costs?.total||0).toFixed(2)}</div>
      <div style="font-size:.75rem;color:var(--text-muted)">${new Date(e.createdAt).toLocaleDateString()}</div>
    </div>`).join('');
}

function openProjectModal(id) {
  const e = getCollection('estimates').find(x => x.id === id);
  if (!e) return;
  app.openModal(`
    <h3>${e.estimateNum}</h3>
    <div class="summary-box" style="margin-top:.75rem">
      <div class="summary-row"><span>Customer</span><span>${e.customer?.name}</span></div>
      <div class="summary-row"><span>Phone</span><span>${e.customer?.phone||'—'}</span></div>
      <div class="summary-row"><span>Email</span><span>${e.customer?.email||'—'}</span></div>
      <div class="summary-row"><span>Address</span><span>${e.address?.street}, ${e.address?.city} ${e.address?.state}</span></div>
      <div class="summary-row"><span>Fence Type</span><span>${e.specs?.type} — ${e.specs?.height} ft</span></div>
      <div class="summary-row"><span>Footage</span><span>${e.specs?.footage} ft</span></div>
      <div class="summary-row"><span>Total</span><span>$${(e.costs?.total||0).toFixed(2)}</span></div>
      <div class="summary-row"><span>Status</span><span>${e.status}</span></div>
    </div>
    <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">
      <button class="btn btn-success btn-sm" onclick="markEstimateSigned(${id})">✅ Mark Signed</button>
      <button class="btn btn-outline btn-sm" onclick="markEstimateComplete(${id})">🏁 Mark Complete</button>
      <button class="btn btn-danger btn-sm" onclick="deleteEstimate(${id})">🗑 Delete</button>
    </div>`);
}

function markEstimateSigned(id) {
  const estimates = getCollection('estimates');
  const e = estimates.find(x => x.id === id);
  if (e) { e.status = 'signed'; saveCollection('estimates', estimates); app.closeModal(); projectsTabRefresh(); app.toast('Marked as signed!','success'); }
}

function markEstimateComplete(id) {
  const estimates = getCollection('estimates');
  const e = estimates.find(x => x.id === id);
  if (e) { e.status = 'complete'; saveCollection('estimates', estimates); app.closeModal(); projectsTabRefresh(); app.toast('Marked complete!','success'); }
}

function deleteEstimate(id) {
  if (!confirm('Delete this estimate?')) return;
  saveCollection('estimates', getCollection('estimates').filter(x => x.id !== id));
  app.closeModal(); projectsTabRefresh(); app.toast('Deleted.','info');
}

function populateSignOffDropdown() {
  const sel = document.getElementById('signOffProject');
  if (!sel) return;
  const estimates = getCollection('estimates');
  sel.innerHTML = '<option value="">-- Select a project --</option>' +
    estimates.map(e => `<option value="${e.id}">${e.estimateNum} — ${e.customer?.name||''}</option>`).join('');
}
