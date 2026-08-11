/**
 * export.js – Export utilities (PDF, Excel, Email) for Fence Estimator Pro
 * Note: Full PDF export requires jsPDF library (load from CDN as needed)
 */
const ExportTool = (() => {

  function exportPDF(elementId, filename) {
    if (window.jsPDF) {
      const element = document.getElementById(elementId);
      if (!element) return;
      // Basic text export as fallback
      const pdf = new window.jsPDF();
      pdf.html(element, {
        callback: (doc) => doc.save(`${filename}.pdf`),
        x: 10, y: 10, width: 190
      });
    } else {
      // Fallback: print dialog
      UI.showNotification('PDF library not loaded. Using print dialog instead.', 'info');
      window.print();
    }
  }

  function exportCSV(data, filename) {
    if (!data || !data.length) { UI.showNotification('No data to export', 'error'); return; }
    const keys = Object.keys(data[0]);
    const rows = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))];
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function exportEstimateCSV() {
    const est = Storage.loadEstimate();
    if (!est || !est.lineItems) { UI.showNotification('No estimate to export', 'error'); return; }
    exportCSV(est.lineItems, `estimate-${est.estimateNumber || 'draft'}`);
  }

  function exportNotesCSV() {
    const notes = Storage.loadNotes();
    if (!notes.length) { UI.showNotification('No notes to export', 'error'); return; }
    exportCSV(notes.map(n => ({ title: n.title, category: n.category, content: n.content, created: n.createdAt })), 'notes');
  }

  function emailDocument(type) {
    const proj = Storage.loadProject();
    const est  = Storage.loadEstimate();
    const email = proj.customerEmail || '';
    const subject = encodeURIComponent(`Fence Estimator – ${type}`);
    const body = encodeURIComponent(`Dear ${proj.customerName || 'Customer'},\n\nPlease find your ${type} attached.\n\nTotal: ${Calculations.formatCurrency(est.total)}\n\nThank you for choosing Fence Depot!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return { exportPDF, exportCSV, exportEstimateCSV, exportNotesCSV, emailDocument };
})();
