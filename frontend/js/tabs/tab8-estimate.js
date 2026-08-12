(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab8-estimate', {
    bind() {
      FE.utils.byId('refreshEstimateBtn').addEventListener('click', async () => {
        const result = await FE.API.saveEstimate(Object.assign({}, FE.state.estimate, {
          projectId: FE.state.project.customerName || 'draft-project',
          fenceType: FE.state.specs.fenceType,
          linearFeet: FE.state.specs.linearFeet,
        }));
        FE.persist(result.offline ? 'Estimate refreshed locally.' : 'Estimate refreshed and synced.');
      });
    },
  });
})(window);
