(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab7-utilities', {
    bind() {
      FE.utils.byId('utilitiesForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const selection = Object.fromEntries(['hydro', 'gas', 'water', 'sewer'].map((name) => [name, document.querySelector(`input[name="utility"][value="${name}"]`).checked]));
        FE.state.utilities = Object.assign(selection, {
          locateRequested: FE.utils.byId('locateRequested').checked,
          notes: FE.utils.byId('utilityNotes').value.trim(),
        });
        FE.persist('Utilities saved.');
      });
    },
  });
})(window);
