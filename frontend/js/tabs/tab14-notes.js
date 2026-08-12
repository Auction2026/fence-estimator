(function (global) {
  const FE = global.FenceEstimator;
  FE.registerTab('tab14-notes', {
    bind() {
      FE.utils.byId('noteForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const entry = {
          id: FE.utils.uid('note'),
          title: FE.utils.byId('noteTitle').value.trim(),
          category: FE.utils.byId('noteCategory').value,
          content: FE.utils.byId('noteContent').value.trim(),
        };
        const errors = FE.Validation.note(entry);
        if (errors.length) return FE.UI.message(errors.join(' '));
        FE.state.notes.unshift(entry);
        event.target.reset();
        FE.persist('Note added.');
      });
    },
  });
})(window);
