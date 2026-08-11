(function () {
  const MODULE = {
    app: null,

    init(app) {
      this.app = app;
      this.notes = document.getElementById('layoutNotes');
      this.bindToolbar();
      FenceEstimatorTools.drawing.init('layout-canvas', (layout) => {
        this.app.updateSection('layout', {
          ...this.app.state.layout,
          drawing: layout.shapes,
          imageData: layout.imageData
        });
      });
      this.loadFromState();
    },

    bindToolbar() {
      document.querySelectorAll('.drawing-tool').forEach((button) => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.drawing-tool').forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
          FenceEstimatorTools.drawing.setTool(button.dataset.drawingTool);
        });
      });

      document.getElementById('layout-undo-btn')?.addEventListener('click', () => FenceEstimatorTools.drawing.undo());
      document.getElementById('layout-redo-btn')?.addEventListener('click', () => FenceEstimatorTools.drawing.redo());
      document.getElementById('layout-clear-btn')?.addEventListener('click', () => FenceEstimatorTools.drawing.clear());
      document.getElementById('layout-save-btn')?.addEventListener('click', () => this.saveLayout());
      document.getElementById('layout-save-image-btn')?.addEventListener('click', () => this.saveLayout());
      document.getElementById('layout-download-btn')?.addEventListener('click', () => FenceEstimatorTools.drawing.downloadImage('fence-layout.png'));
      this.notes?.addEventListener('input', () => this.saveLayout());
    },

    saveLayout() {
      this.app.updateSection('layout', {
        notes: this.notes?.value || '',
        drawing: FenceEstimatorTools.drawing.exportJSON(),
        imageData: FenceEstimatorTools.drawing.exportImage()
      });
      UI.showNotification('Layout diagram saved.', 'success');
    },

    loadFromState() {
      const state = this.app.state.layout || {};
      if (this.notes) this.notes.value = state.notes || '';
      FenceEstimatorTools.drawing.importJSON(state.drawing || []);
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.layout = MODULE;
})();
