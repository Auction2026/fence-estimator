/**
 * Export / Import helpers (used by Settings tab)
 * Core logic is in app.exportData / app.importData
 */
function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv  = [keys.join(','), ...data.map(row => keys.map(k => `"${String(row[k]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || 'export.csv';
  a.click();
}
