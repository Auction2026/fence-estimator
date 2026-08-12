function printEstimate() {
  window.print();
}

function exportEstimateJson(state, filename = 'estimate.json') {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

window.printingTool = { printEstimate, exportEstimateJson };
