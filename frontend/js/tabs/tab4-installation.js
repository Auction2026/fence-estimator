(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab4-installation', {
    bind() {
      FE.utils.byId('installationForm').addEventListener('submit', (event) => {
        event.preventDefault();
        FE.state.installation = {
          crewSize: FE.utils.byId('crewSize').value,
          laborRate: FE.utils.byId('laborRate').value,
          equipmentRate: FE.utils.byId('equipmentRate').value,
          startDate: FE.utils.byId('startDate').value,
          durationDays: FE.utils.byId('durationDays').value,
          soilConditions: FE.utils.byId('soilConditions').value,
          notes: FE.utils.byId('installationNotes').value.trim(),
        };
        FE.persist('Installation saved.');
      });
    },
  });
})(window);
