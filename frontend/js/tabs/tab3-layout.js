(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab3-layout', {
    bind() {
      FE.utils.byId('layoutForm').addEventListener('submit', (event) => {
        event.preventDefault();
        FE.state.layout = Object.assign({}, FE.state.layout, {
          notes: FE.utils.byId('layoutNotes').value.trim(),
          frontageFeet: FE.utils.byId('frontageFeet').value,
          rearFeet: FE.utils.byId('rearFeet').value,
          leftFeet: FE.utils.byId('leftFeet').value,
          rightFeet: FE.utils.byId('rightFeet').value,
        });
        FE.persist('Layout details saved.');
      });
    },
  });
})(window);
