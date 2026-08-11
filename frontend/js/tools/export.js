
const ExportTool = (() => {
  function download(filename, content, mime = 'text/plain') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    }, 150);
  }

  function exportEstimateAsJSON(data) {
    download('estimate.json', JSON.stringify(data, null, 2), 'application/json');
  }

  function exportEstimateAsCSV(rows) {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
    download('estimate.csv', csv, 'text/csv');
  }

  return { exportEstimateAsJSON, exportEstimateAsCSV };
})();
