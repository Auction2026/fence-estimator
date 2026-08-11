// Shop drawings tab
'use strict';

const Tab5 = {
  storageKey: 'drawings',
  init() {
    this.fileInput = document.getElementById('shopDrawingUpload');
    this.revisionInput = document.getElementById('shopDrawingRevision');
    this.tableBody = document.getElementById('drawingsTableBody');
    this.previewArea = document.getElementById('drawingPreviewArea');
    this.dropzone = document.getElementById('drawingsDropzone');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    if (this.fileInput) this.fileInput.addEventListener('change', (event) => this.handleFileUpload(event));
    if (this.dropzone) {
      ['dragenter', 'dragover'].forEach((name) => this.dropzone.addEventListener(name, (event) => this.onDrag(event, true)));
      ['dragleave', 'drop'].forEach((name) => this.dropzone.addEventListener(name, (event) => this.onDrag(event, false)));
      this.dropzone.addEventListener('drop', (event) => this.onDrop(event));
    }
    if (!this.tableBody) return;
    this.tableBody.addEventListener('click', (event) => {
      const previewButton = event.target.closest('[data-preview-drawing]');
      const deleteButton = event.target.closest('[data-delete-drawing]');
      if (previewButton) this.previewFile(Number(previewButton.dataset.previewDrawing));
      if (deleteButton) this.deleteFile(Number(deleteButton.dataset.deleteDrawing));
    });
  },
  onDrag(event, active) {
    event.preventDefault();
    if (this.dropzone) this.dropzone.classList.toggle('is-dragging', active);
  },
  onDrop(event) {
    event.preventDefault();
    this.onDrag(event, false);
    const files = Array.from((event.dataTransfer && event.dataTransfer.files) || []);
    if (!files.length) return;
    this.processFiles(files);
  },
  formatSize(size) {
    const value = App.safeNumber(size);
    if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${value} B`;
  },
  fileToRecord(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        date: new Date().toISOString(),
        revisionNotes: this.revisionInput ? this.revisionInput.value.trim() : '',
        dataUrl: String(reader.result || '')
      });
      reader.readAsDataURL(file);
    });
  },
  async processFiles(files) {
    AppState.drawings = Array.isArray(AppState.drawings) ? AppState.drawings : [];
    const records = await Promise.all(files.map((file) => this.fileToRecord(file)));
    AppState.drawings = AppState.drawings.concat(records);
    this.save(false);
    this.renderFileList();
    this.previewFile(AppState.drawings.length - 1);
    UI.showNotification(`${records.length} drawing(s) uploaded.`, 'success');
  },
  async handleFileUpload(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    await this.processFiles(files);
    if (this.fileInput) this.fileInput.value = '';
  },
  renderFileList() {
    if (!this.tableBody) return;
    const drawings = Array.isArray(AppState.drawings) ? AppState.drawings : [];
    this.tableBody.innerHTML = drawings.map((file, index) => `
      <tr>
        <td>${file.name || `Drawing ${index + 1}`}</td>
        <td>${formatDate(file.date)}</td>
        <td>${this.formatSize(file.size)}</td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" data-preview-drawing="${index}">Preview</button>
          <button type="button" class="btn btn-danger btn-sm" data-delete-drawing="${index}">Delete</button>
        </td>
      </tr>`).join('');
    if (!drawings.length) this.tableBody.innerHTML = '<tr><td colspan="4">No drawings uploaded yet.</td></tr>';
  },
  previewMarkup(file) {
    if ((file.type || '').startsWith('image/')) {
      return `<img src="${file.dataUrl}" alt="${file.name}" style="max-width:100%;max-height:320px;display:block;margin:0 auto 12px;">` +
        `<div><strong>${file.name}</strong><div>${file.revisionNotes || 'No revision notes.'}</div><div>${this.formatSize(file.size)}</div></div>`;
    }
    return `<div class="surface p-3 rounded-8"><strong>${file.name}</strong><p class="mt-2">Preview not available for this file type.</p><p>${file.revisionNotes || 'No revision notes.'}</p></div>`;
  },
  previewFile(index) {
    const file = (AppState.drawings || [])[index];
    if (!this.previewArea || !file) return;
    this.previewArea.innerHTML = this.previewMarkup(file);
  },
  deleteFile(index) {
    AppState.drawings.splice(index, 1);
    this.save(false);
    this.renderFileList();
    if ((AppState.drawings || []).length) this.previewFile(0);
    else if (this.previewArea) this.previewArea.innerHTML = '<p>No drawing selected.</p>';
    UI.showNotification('Drawing removed.', 'info');
  },
  load() {
    const drawings = Storage.load(this.storageKey) || AppState.drawings || [];
    AppState.drawings = Array.isArray(drawings) ? drawings : [];
    this.renderFileList();
    if (AppState.drawings.length) this.previewFile(0);
  },
  save(showToast = true) {
    Storage.save(this.storageKey, AppState.drawings || []);
    if (showToast) UI.showNotification('Shop drawings saved.', 'success');
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab5 = Tab5;
