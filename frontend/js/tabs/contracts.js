// TAB 8: CONTRACTS
function contractsTabRefresh() {
  const estimates = getCollection('estimates').filter(e => e.status === 'signed' || e.status === 'complete');
  const el = document.getElementById('contractsList');
  if (!estimates.length) { el.innerHTML = '<p class="empty-state">No contracts yet. Sign an estimate from the Projects tab.</p>'; return; }
  el.innerHTML = estimates.map(e => `
    <div class="list-item">
      <div>
        <strong>${e.estimateNum}</strong> — ${e.customer?.name}
        <div style="font-size:.8rem;color:var(--text-muted)">${e.address?.street}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700;color:var(--primary)">$${(e.costs?.total||0).toFixed(2)}</div>
        <span class="project-card-status status-${e.status}">${e.status}</span>
      </div>
    </div>`).join('');
}
