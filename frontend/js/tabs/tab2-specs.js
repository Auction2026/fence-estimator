(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab2-specs', {
    bind() {
      FE.utils.byId('specsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const payload = {
          fenceType: FE.utils.byId('fenceType').value,
          height: FE.utils.byId('fenceHeight').value,
          color: FE.utils.byId('fenceColor').value.trim(),
          grade: FE.utils.byId('materialGrade').value,
          linearFeet: FE.utils.byId('linearFeet').value,
          posts: FE.utils.byId('numberOfPosts').value,
          gates: FE.utils.byId('numberOfGates').value,
          gateWidth: FE.utils.byId('gateWidth').value,
          terrain: FE.utils.byId('terrainType').value,
          installType: FE.utils.byId('installType').value,
        };
        const errors = FE.Validation.specs(payload);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.specs = payload;
        FE.persist('Specifications saved.');
      });
    },
  });
})(window);
