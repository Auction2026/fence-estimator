(function attachMappingTool(global) {
  const FE = global.FenceEstimator;
  FE.registerTool('mapping', {
    refresh() {
      FE.UI.renderMapping();
    },
  });
})(window);
