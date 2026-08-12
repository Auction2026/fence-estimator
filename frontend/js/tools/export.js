(function attachExportTool(global) {
  const FE = global.FenceEstimator;
  FE.registerTool('export', {
    downloadContract() {
      const content = FE.Calculations.createContractPreview(FE.state);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${FE.state.project.customerName || 'draft'}.txt`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    },
  });
})(window);
