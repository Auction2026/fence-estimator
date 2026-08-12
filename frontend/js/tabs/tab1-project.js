(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab1-project', {
    bind() {
      FE.utils.byId('projectForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = {
          customerName: FE.utils.byId('customerName').value.trim(),
          customerEmail: FE.utils.byId('customerEmail').value.trim(),
          customerPhone: FE.utils.byId('customerPhone').value.trim(),
          projectDate: FE.utils.byId('projectDate').value,
          address: FE.utils.byId('customerAddress').value.trim(),
          city: FE.utils.byId('customerCity').value.trim(),
          province: FE.utils.byId('customerProvince').value.trim(),
          postalCode: FE.utils.byId('customerPostal').value.trim(),
          propertySize: FE.utils.byId('propertySize').value,
          status: FE.utils.byId('projectStatus').value,
          projectNotes: FE.utils.byId('projectNotes').value.trim(),
        };
        const errors = FE.Validation.project(payload);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.project = payload;
        const result = await FE.API.saveProject(payload);
        FE.persist(result.offline ? 'Project saved locally.' : 'Project saved.');
      });
    },
  });
})(window);
