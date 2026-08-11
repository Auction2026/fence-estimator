(function () {
  function downloadBlob(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const ExportTool = {
    exportToPDF(elementId, filename = 'fence-estimate.pdf') {
      const element = document.getElementById(elementId) || document.getElementById('app-shell');
      if (!element) return;
      if (window.html2pdf) {
        window.html2pdf().set({
          margin: 0.5,
          filename,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(element).save();
      } else {
        window.FenceEstimatorTools.printing.printSelectedTab(elementId);
      }
    },

    exportToCSV(filename, rows = []) {
      const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\\n');
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
    },

    exportToExcel(filename, headers = [], rows = []) {
      const table = [headers, ...rows]
        .map((row) => `<tr>${row.map((cell) => `<td>${cell ?? ''}</td>`).join('')}</tr>`)
        .join('');
      const html = `<html><body><table>${table}</table></body></html>`;
      downloadBlob(new Blob([html], { type: 'application/vnd.ms-excel' }), filename);
    }
  };

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.exporter = ExportTool;
})();
