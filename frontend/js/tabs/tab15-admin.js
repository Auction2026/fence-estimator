(function () {
  const MODULE = {
    app: null,
    init(app) {
      this.app = app;
      document.getElementById('admin-refresh-btn')?.addEventListener('click', () => this.refreshProjects());
      document.getElementById('admin-report-btn')?.addEventListener('click', () => this.generateReport());
      this.renderDashboard(this.buildProjectRows());
    },
    buildProjectRows() {
      const project = this.app.state.project || {};
      if (!project.customerName) return [];
      return [{
        projectId: project.projectId,
        customerName: project.customerName,
        status: this.app.state.contract.lockedPrice ? 'Contract Ready' : 'Draft',
        total: this.app.state.estimate.total || 0,
        updatedAt: new Date().toISOString()
      }];
    },
    async refreshProjects() {
      const remoteProjects = await Api.fetchProjects();
      const localProjects = this.buildProjectRows();
      const rows = [...localProjects, ...remoteProjects.map((project) => ({
        projectId: project.projectId,
        customerName: project.customerName,
        status: project.status,
        total: 0,
        updatedAt: project.updatedAt || project.createdAt
      }))];
      this.renderDashboard(rows);
      UI.showNotification('Admin dashboard refreshed.', 'success');
    },
    renderDashboard(rows) {
      const uniqueRows = rows.filter((row, index, array) => array.findIndex((candidate) => candidate.projectId === row.projectId) === index);
      UI.populateTable('admin-projects-table', uniqueRows, [
        { key: 'projectId' },
        { key: 'customerName' },
        { key: 'status' },
        { render: (row) => Calculations.formatCurrency(row.total || 0) },
        { render: (row) => new Date(row.updatedAt).toLocaleString() }
      ]);
      const ticketValues = uniqueRows.map((row) => Number(row.total || 0)).filter(Boolean);
      const average = ticketValues.length ? ticketValues.reduce((sum, value) => sum + value, 0) / ticketValues.length : 0;
      document.getElementById('admin-project-count').textContent = String(uniqueRows.length);
      document.getElementById('admin-estimate-count').textContent = String(uniqueRows.filter((row) => row.status !== 'completed').length);
      document.getElementById('admin-average-ticket').textContent = Calculations.formatCurrency(average);
      document.getElementById('admin-contract-count').textContent = String(uniqueRows.filter((row) => row.status === 'Contract Ready').length);
    },
    generateReport() {
      const estimate = this.app.state.estimate || {};
      document.getElementById('admin-report-output').innerHTML = `
        <h3>Pipeline Snapshot</h3>
        <p><strong>Active Project:</strong> ${this.app.state.project.customerName || 'No active project'}</p>
        <p><strong>Estimate Value:</strong> ${Calculations.formatCurrency(estimate.total || 0)}</p>
        <p><strong>Extras Value:</strong> ${Calculations.formatCurrency(estimate.extrasTotal || 0)}</p>
        <p><strong>Notes Logged:</strong> ${(this.app.state.notes || []).length}</p>`;
      UI.showNotification('Project report generated.', 'success');
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.admin = MODULE;
})();
