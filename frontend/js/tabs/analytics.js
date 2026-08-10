/* ═══════════════════════════════════════════════════════════════
   analytics.js – revenue/project analytics
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', e => {
  if (e.detail !== 'analytics') return;
  loadAnalytics();
});

function loadAnalytics() {
  const estimates = JSON.parse(localStorage.getItem('fd_estimates') || '[]');
  const projects  = JSON.parse(localStorage.getItem('fd_projects')  || '[]');

  const totalRevenue = estimates.reduce((s, e) => s + (e.grand || 0), 0);
  const avgEstimate  = estimates.length ? totalRevenue / estimates.length : 0;
  const contracts    = JSON.parse(localStorage.getItem('fd_contracts') || '[]');
  const winRate      = estimates.length ? Math.round((contracts.length / estimates.length) * 100) : 0;

  document.getElementById('ana-total-revenue').textContent  = App.fmtCurrency(totalRevenue);
  document.getElementById('ana-avg-estimate').textContent   = App.fmtCurrency(avgEstimate);
  document.getElementById('ana-win-rate').textContent       = winRate + '%';
  document.getElementById('ana-total-projects').textContent = projects.length;

  // Simple ASCII-style bar chart using canvas
  drawRevenueChart(estimates);
}

function drawRevenueChart(estimates) {
  const canvas = document.getElementById('revenue-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.parentElement.offsetWidth || 800;
  canvas.height = 260;

  // Group by month
  const months = {};
  estimates.forEach(e => {
    const d = new Date(e.createdAt || Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    months[key] = (months[key] || 0) + (e.grand || 0);
  });
  const keys   = Object.keys(months).sort().slice(-12);
  const values = keys.map(k => months[k]);
  const maxVal = Math.max(...values, 1);

  const barW = keys.length ? Math.floor((canvas.width - 60) / keys.length) - 4 : 60;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f4f6f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  keys.forEach((k, i) => {
    const barH = Math.round((values[i] / maxVal) * 200);
    const x = 40 + i * (barW + 4);
    const y = 220 - barH;
    ctx.fillStyle = '#1a6b3c';
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.fillText(k.slice(5), x, 236);
    ctx.fillStyle = '#1a6b3c';
    ctx.fillText('$' + Math.round(values[i]/1000) + 'k', x, y - 3);
  });

  if (!keys.length) {
    ctx.fillStyle = '#999';
    ctx.font = '14px sans-serif';
    ctx.fillText('No data yet – create some estimates!', 40, 130);
  }
}
