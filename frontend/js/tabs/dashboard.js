// TAB 1: DASHBOARD
function dashboardTabRefresh() {
  const estimates = getCollection('estimates');
  const signed    = estimates.filter(e => e.status === 'signed' || e.status === 'complete');
  document.getElementById('statTotalProjects').textContent    = estimates.length;
  document.getElementById('statOpenEstimates').textContent    = estimates.filter(e => e.status === 'open').length;
  document.getElementById('statSignedContracts').textContent  = signed.length;
  const revenue = signed.reduce((sum, e) => sum + (e.costs?.total || 0), 0);
  document.getElementById('statMonthRevenue').textContent     = '$' + revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const listEl = document.getElementById('recentProjectsList');
  const recent = [...estimates].sort((a,b) => b.id - a.id).slice(0, 6);
  if (!recent.length) { listEl.innerHTML = '<p class="empty-state">No projects yet.</p>'; return; }
  listEl.innerHTML = recent.map(e => `
    <div class="list-group-item" onclick="app.switchTab('projects')">
      <strong>${e.customer?.name || '—'}</strong>
      <span class="project-card-status status-${e.status}">${e.status}</span>
      <small style="color:var(--text-muted)">${e.estimateNum} | $${(e.costs?.total||0).toFixed(2)}</small>
    </div>`).join('');
}
