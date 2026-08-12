function printEstimate() {
  window.print();
}

function exportEstimateJson(state, filename = 'estimate.json') {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

window.printingTool = { printEstimate, exportEstimateJson };
