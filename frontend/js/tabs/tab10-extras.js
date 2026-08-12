(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab10-extras', {
    bind() {
      FE.utils.byId('extraForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const entry = {
          id: FE.utils.uid('extra'),
          description: FE.utils.byId('extraItem').value.trim(),
          category: FE.utils.byId('extraCategory').value,
          cost: FE.utils.byId('extraCost').value,
        };
        const errors = FE.Validation.extra(entry);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.extras.push(entry);
        event.target.reset();
        FE.persist('Extra added.');
      });
    },
  });
})(window);
