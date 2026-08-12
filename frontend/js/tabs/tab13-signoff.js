(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab13-signoff', {
    bind() {
      FE.utils.byId('signoffForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const payload = {
          completionDate: FE.utils.byId('completionDate').value,
          companyRep: FE.utils.byId('companyRep').value.trim(),
          inspectionPassed: FE.utils.byId('inspectionPassed').checked,
          customerWalkthrough: FE.utils.byId('customerWalkthrough').checked,
          warrantyExplained: FE.utils.byId('warrantyExplained').checked,
          outstandingItems: FE.utils.byId('outstandingItems').value.trim(),
        };
        const errors = FE.Validation.signoff(payload);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.signoff = payload;
        FE.persist('Sign-off saved.');
      });
    },
  });
})(window);
