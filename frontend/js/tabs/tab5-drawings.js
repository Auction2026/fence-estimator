(function () {
  const MODULE = {
    app: null,

    init(app) {
      this.app = app;
      this.input = document.getElementById('drawingUpload');
      this.notes = document.getElementById('drawingNotes');
      this.tableBody = document.querySelector('#drawings-table tbody');
      this.input?.addEventListener('change', (event) => this.handleUpload(event));
      this.notes?.addEventListener('input', () => this.captureNotes());
      document.getElementById('clear-drawings-btn')?.addEventListener('click', () => this.clearAll());
      this.render();
    },

    async handleUpload(event) {
      const files = Array.from(event.target.files || []);
      const processed = await Promise.all(files.map((file) => this.readFile(file)));
      const drawings = [...(this.app.state.drawings.files || []), ...processed];
      this.app.updateSection('drawings', { files: drawings, notes: this.notes?.value || '' });
      this.render();
      this.input.value = '';
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result
        });
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    },

    captureNotes() {
      this.app.updateSection('drawings', {
        ...(this.app.state.drawings || {}),
        notes: this.notes?.value || ''
      });
    },

    clearAll() {
      this.app.updateSection('drawings', { files: [], notes: this.notes?.value || '' });
      this.render();
    },

    render() {
      const files = this.app.state.drawings.files || [];
      if (this.notes) this.notes.value = this.app.state.drawings.notes || '';
      this.tableBody.innerHTML = '';
      if (!files.length) {
        this.tableBody.innerHTML = '<tr><td colspan="5">No drawings uploaded.</td></tr>';
        return;
      }
      files.forEach((file) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${file.name}</td>
          <td>${file.type}</td>
          <td>${(file.size / 1024).toFixed(1)} KB</td>
          <td>${new Date(file.uploadedAt).toLocaleString()}</td>
          <td><button class="btn btn-secondary" type="button" data-open="${file.id}">View</button></td>`;
        row.querySelector('[data-open]')?.addEventListener('click', () => this.openFile(file));
        this.tableBody.appendChild(row);
      });
    },

    openFile(file) {
      const content = file.type.includes('image')
        ? `<img src="${file.dataUrl}" alt="${file.name}" style="max-width:100%;border-radius:12px;">`
        : `<iframe src="${file.dataUrl}" title="${file.name}" style="width:100%;height:70vh;border:0;"></iframe>`;
      UI.showModal(file.name, content);
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.drawings = MODULE;
})();
