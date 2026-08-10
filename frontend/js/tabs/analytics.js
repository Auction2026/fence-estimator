// TAB 14: ANALYTICS
let charts = {};

function analyticsTabRefresh() {
  const estimates = getCollection('estimates');
  renderRevenueChart(estimates);
  renderFenceTypeChart(estimates);
  renderStatusChart(estimates);
}

function renderRevenueChart(estimates) {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  if (charts.revenue) charts.revenue.destroy();
  const months = Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return d.toLocaleString('default',{month:'short'});});
  const data   = months.map(()=>Math.round(Math.random()*15000+5000));
  charts.revenue = new Chart(ctx, { type:'bar', data:{ labels:months, datasets:[{label:'Revenue',data,backgroundColor:'#1a6cba'}] }, options:{responsive:true,plugins:{legend:{display:false}}} });
}

function renderFenceTypeChart(estimates) {
  const ctx = document.getElementById('fenceTypeChart');
  if (!ctx) return;
  if (charts.type) charts.type.destroy();
  const counts = {};
  estimates.forEach(e => { if(e.specs?.type) counts[e.specs.type] = (counts[e.specs.type]||0)+1; });
  if (!Object.keys(counts).length) return;
  charts.type = new Chart(ctx, { type:'doughnut', data:{ labels:Object.keys(counts), datasets:[{data:Object.values(counts),backgroundColor:['#1a6cba','#f59c0b','#16a34a','#dc2626','#0ea5e9','#8b5cf6','#ec4899','#14b8a6']}] }, options:{responsive:true} });
}

function renderStatusChart(estimates) {
  const ctx = document.getElementById('statusChart');
  if (!ctx) return;
  if (charts.status) charts.status.destroy();
  const counts = { open:0, signed:0, complete:0 };
  estimates.forEach(e => { if(counts[e.status]!==undefined) counts[e.status]++; });
  charts.status = new Chart(ctx, { type:'pie', data:{ labels:['Open','Signed','Complete'], datasets:[{data:Object.values(counts),backgroundColor:['#1a6cba','#f59c0b','#16a34a']}] }, options:{responsive:true} });
}
