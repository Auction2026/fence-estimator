(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab12-changeorder', {
    bind() {
      FE.utils.byId('changeOrderForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const entry = {
          id: FE.utils.uid('change'),
          description: FE.utils.byId('changeDescription').value.trim(),
          reason: FE.utils.byId('changeReason').value.trim(),
          cost: FE.utils.byId('changeCost').value,
          timeline: FE.utils.byId('timelineChange').value.trim(),
        };
        const errors = FE.Validation.changeOrder(entry);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.changeOrders.push(entry);
        FE.persist('Change order created.');
      });
    },
  });
})(window);
