(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab11-crew', {
    bind() {
      FE.utils.byId('crewForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const entry = {
          id: FE.utils.uid('crew'),
          name: FE.utils.byId('crewName').value.trim(),
          role: FE.utils.byId('crewRole').value,
          rate: FE.utils.byId('crewRate').value,
        };
        const errors = FE.Validation.crew(entry);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.crew.push(entry);
        event.target.reset();
        FE.persist('Crew member added.');
      });
    },
  });
})(window);
