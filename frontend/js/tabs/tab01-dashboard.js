/**
 * TAB 01 - DASHBOARD
 * Shows summary stats: open projects, estimates this month, revenue pipeline, recent activity.
 */
'use strict';

const TabDashboard = (() => {

  const MOCK_STATS = {
    openProjects:    12,
    estimatesMonth:  28,
    contractsSigned:  9,
    revenuePipeline: 187450,
  };

  function render() {
    const el = document.getElementById('dashboard-tab');
    if (!el) return;

    el.innerHTML = `
      <div class="grid-4 mb-20" style="margin-bottom:24px">
        ${statCard('📋', 'Open Projects',     MOCK_STATS.openProjects,    '', 'primary')}
        ${statCard('📝', 'Estimates (Month)', MOCK_STATS.estimatesMonth,  '', 'warning')}
        ${statCard('✅', 'Contracts Signed',  MOCK_STATS.contractsSigned, '', 'success')}
        ${statCard('💰', 'Revenue Pipeline',  formatCurrency(MOCK_STATS.revenuePipeline), '', 'accent')}
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>📅 Recent Projects</h3></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Project</th><th>Customer</th><th>Status</th><th>Value</th></tr></thead>
              <tbody>
                ${recentProjects().map(p => `
                  <tr>
                    <td><strong>${UI.escapeHtml(p.id)}</strong></td>
                    <td>${UI.escapeHtml(p.customer)}</td>
                    <td><span class="badge badge-${p.statusClass}">${UI.escapeHtml(p.status)}</span></td>
                    <td class="td-right">${formatCurrency(p.value)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3>🔔 Activity Feed</h3></div>
          <div class="card-body">
            ${activityFeed().map(a => `
              <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-start">
                <span style="font-size:22px">${a.icon}</span>
                <div>
                  <div style="font-size:14px;font-weight:600">${UI.escapeHtml(a.message)}</div>
                  <div class="text-muted text-sm">${UI.escapeHtml(a.time)}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function statCard(icon, label, value, change, type) {
    return `
      <div class="stat-card ${type}" style="position:relative">
        <div class="stat-label">${UI.escapeHtml(label)}</div>
        <div class="stat-value">${value}</div>
        ${change ? `<div class="stat-change">${UI.escapeHtml(change)}</div>` : ''}
        <span class="stat-icon">${icon}</span>
      </div>`;
  }

  function recentProjects() {
    return [
      { id: 'FDE-2026-0028', customer: 'John Smith',    status: 'Estimate',  statusClass: 'warning', value: 4850 },
      { id: 'FDE-2026-0027', customer: 'Mary Johnson',  status: 'Contract',  statusClass: 'success', value: 12300 },
      { id: 'FDE-2026-0026', customer: 'Bob Williams',  status: 'Active',    statusClass: 'info',    value: 7200 },
      { id: 'FDE-2026-0025', customer: 'Sara Davis',    status: 'Completed', statusClass: 'secondary', value: 3400 },
      { id: 'FDE-2026-0024', customer: 'Mike Brown',    status: 'Draft',     statusClass: 'danger',  value: 0 },
    ];
  }

  function activityFeed() {
    return [
      { icon: '📧', message: 'Estimate emailed to John Smith',             time: '2 hours ago' },
      { icon: '✅', message: 'Contract signed — Mary Johnson',             time: '4 hours ago' },
      { icon: '📋', message: 'New project created — FDE-2026-0028',        time: 'Yesterday' },
      { icon: '💰', message: 'Payment received — Bob Williams ($3,200)',    time: '2 days ago' },
      { icon: '🔧', message: 'Crew assigned — FDE-2026-0026',              time: '2 days ago' },
    ];
  }

  function init() { render(); }

  return { init, render };
})();

window.TabDashboard = TabDashboard;
