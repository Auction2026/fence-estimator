/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Reports Module
 */
'use strict';

// Reports are handled inside main.js runReport() function.
// This file can be extended for PDF generation via backend API.

async function generatePDFReport(reportType) {
  const pi  = AppState.projectInfo;
  const es  = AppState.estimateSummary;
  const apiBase = window.API_BASE || 'http://localhost:3001';

  try {
    const res = await fetch(`${apiBase}/api/reports/${reportType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectInfo: pi, summary: es, estimateNumber: AppState.estimateNumber }),
    });
    if (!res.ok) throw new Error(await res.text());
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${reportType}-${AppState.estimateNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`${reportType} PDF downloaded`);
  } catch (err) {
    console.error('PDF generation error:', err);
    setStatus('PDF generation requires backend connection');
  }
}
