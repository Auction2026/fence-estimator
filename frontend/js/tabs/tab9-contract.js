(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab9-contract', {
    bind() {
      FE.utils.byId('contractForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        FE.state.contract = {
          depositRate: FE.utils.byId('depositRate').value,
          warranty: FE.utils.byId('warrantyText').value.trim(),
          paymentTerms: FE.utils.byId('paymentTerms').value.trim(),
          priceLocked: FE.utils.byId('priceLocked').checked,
          customerAccepted: FE.utils.byId('customerAccepted').checked,
        };
        const result = await FE.API.saveContract({
          projectId: FE.state.project.customerName || 'draft-project',
          customerName: FE.state.project.customerName,
          estimateTotal: FE.state.estimate.total,
          contract: FE.state.contract,
        });
        FE.persist(result.offline ? 'Contract saved locally.' : 'Contract saved.');
      });
    },
  });
})(window);
