// TAB 15: REPORTS
function reportsTabRefresh() {}

function reportsTabPrint(type) {
  const win = window.open('', '_blank');
  const estimates = getCollection('estimates');
  let html = `<html><head><title>${type} Report</title>
    <style>body{font-family:sans-serif;padding:1rem}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:.4rem}th{background:#f0f4f8}</style>
    </head><body><h2 style="text-transform:capitalize">${type} Report</h2>
    <p>Generated: ${new Date().toLocaleString()}</p>`;
  if (type === 'estimates') {
    html += '<table><thead><tr><th>#</th><th>Customer</th><th>Type</th><th>Footage</th><th>Total</th><th>Status</th></tr></thead><tbody>';
    estimates.forEach(e => { html += `<tr><td>${e.estimateNum}</td><td>${e.customer?.name}</td><td>${e.specs?.type}</td><td>${e.specs?.footage}</td><td>$${(e.costs?.total||0).toFixed(2)}</td><td>${e.status}</td></tr>`; });
    html += '</tbody></table>';
  }
  html += '</body></html>';
  win.document.write(html); win.document.close(); win.print();
}
