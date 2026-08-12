(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab5-drawings', {
    bind() {
      FE.utils.byId('drawingsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const files = Array.from(FE.utils.byId('drawingFile').files || []).map((file) => ({
          id: FE.utils.uid('drawing'), fileName: file.name, size: file.size, category: FE.utils.byId('drawingNotes').value.trim() || 'Uploaded drawing',
        }));
        FE.state.drawings.notes = FE.utils.byId('drawingNotes').value.trim();
        FE.state.drawings.files = FE.state.drawings.files.concat(files);
        FE.persist(files.length ? 'Drawing references saved.' : 'Drawing notes saved.');
      });
    },
  });
})(window);
