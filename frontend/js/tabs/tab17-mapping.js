(function () {
  const MODULE = {
    app: null,
    init(app) {
      this.app = app;
      this.list = document.getElementById('boundary-points-list');
      FenceEstimatorTools.mapping.init('map-container', (state) => {
        this.app.setSection('mapping', state);
        this.renderPoints();
      });
      document.getElementById('map-clear-boundary-btn')?.addEventListener('click', () => {
        FenceEstimatorTools.mapping.clearBoundary();
        this.renderPoints();
      });
      document.getElementById('map-use-address-btn')?.addEventListener('click', () => {
        const project = this.app.state.project;
        FenceEstimatorTools.mapping.centerOnAddress(`${project.address || ''} ${project.city || ''} ${project.province || ''}`.trim());
      });
      this.loadFromState();
    },
    renderPoints() {
      const points = this.app.state.mapping.points || [];
      this.list.innerHTML = points.length
        ? points.map((point, index) => `<li>Point ${index + 1}: x ${point.x}, y ${point.y}</li>`).join('')
        : '<li>No boundary points recorded.</li>';
    },
    loadFromState() {
      FenceEstimatorTools.mapping.importState(this.app.state.mapping || {});
      this.renderPoints();
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.mapping = MODULE;
})();
