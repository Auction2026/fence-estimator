(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab6-permits', {
    bind() {
      FE.utils.byId('permitsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        FE.state.permits = {
          required: FE.utils.byId('permitRequired').checked,
          permitNumber: FE.utils.byId('permitNumber').value.trim(),
          status: FE.utils.byId('permitStatus').value,
          fee: FE.utils.byId('permitFee').value,
          notes: FE.utils.byId('permitNotes').value.trim(),
        };
        FE.persist('Permit details saved.');
      });
    },
  });
})(window);
