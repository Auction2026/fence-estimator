/* ═══════════════════════════════════════════════════════════════
   dashboard.js – KPI cards + recent tables
   ═══════════════════════════════════════════════════════════════ */
'use strict';
document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'dashboard') return;
  try {
    const data = await App.Api.get('/dashboard/summary');
    document.getElementById('kpi-open-estimates').textContent  = data.openEstimates  ?? 0;
    document.getElementById('kpi-active-projects').textContent = data.activeProjects  ?? 0;
    document.getElementById('kpi-contracts-pending').textContent = data.pendingContracts ?? 0;
    document.getElementById('kpi-month-revenue').textContent   = App.fmtCurrency(data.monthRevenue ?? 0);

    const estBody = document.getElementById('recent-estimates-body');
    estBody.innerHTML = (data.recentEstimates || []).map(r => `
      <tr>
        <td>${App.escHtml(r.id)}</td>
        <td>${App.escHtml(r.customerName)}</td>
        <td>${App.escHtml(App.fmtDate(r.createdAt))}</td>
        <td>${App.escHtml(App.fmtCurrency(r.total))}</td>
        <td><span class="badge badge-${App.escHtml(r.status)}">${App.escHtml(r.status)}</span></td>
      </tr>`).join('') || '<tr><td colspan="5">No estimates yet</td></tr>';

    const projBody = document.getElementById('recent-projects-body');
    projBody.innerHTML = (data.recentProjects || []).map(r => `
      <tr>
        <td>${App.escHtml(r.id)}</td>
        <td>${App.escHtml(r.customerName)}</td>
        <td>${App.escHtml(r.fenceType)}</td>
        <td><span class="badge badge-${App.escHtml(r.status)}">${App.escHtml(r.status)}</span></td>
      </tr>`).join('') || '<tr><td colspan="4">No projects yet</td></tr>';
  } catch (err) {
    // Offline fallback – show local storage data
    const estimates = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
    document.getElementById('kpi-open-estimates').textContent = estimates.length;
    document.getElementById('recent-estimates-body').innerHTML =
      estimates.slice(-5).reverse().map(r => `
        <tr>
          <td>${App.escHtml(r.id || '—')}</td>
          <td>${App.escHtml(r.firstName || '')} ${App.escHtml(r.lastName || '')}</td>
          <td>${App.escHtml(App.fmtDate(r.createdAt))}</td>
          <td>${App.escHtml(App.fmtCurrency(r.grandTotal))}</td>
          <td>draft</td>
        </tr>`).join('') || '<tr><td colspan="5">No estimates yet</td></tr>';
  }
});
