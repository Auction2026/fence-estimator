(function attachPrintingTool(global) {
  const FE = global.FenceEstimator;
  FE.registerTool('printing', {
    printEstimate() {
      FE.UI.message('Opening print dialog…');
      window.print();
    },
  });
})(window);
