(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab17-mapping', {
    bind() {
      FE.utils.byId('mappingForm').addEventListener('submit', (event) => {
        event.preventDefault();
        FE.state.mapping = {
          address: FE.utils.byId('mappingAddress').value.trim(),
          lat: FE.utils.byId('mappingLat').value,
          lng: FE.utils.byId('mappingLng').value,
          width: FE.utils.byId('mappingWidth').value,
          depth: FE.utils.byId('mappingDepth').value,
        };
        FE.modules.tools.mapping.refresh();
        FE.persist('Mapping summary updated.');
      });
    },
  });
})(window);
