// Shop drawings tab
'use strict';

const Tab5 = {
  init() { this.input = document.getElementById('shopDrawingUpload'); this.tableBody = document.getElementById('drawingsTableBody'); this.preview = document.getElementById('drawingPreviewArea'); this.bindEvents(); this.load(); },
  bindEvents() {
    if (this.input) this.input.addEventListener('change', (event) => this.handleFiles(event.target.files));
    if (this.tableBody) this.tableBody.addEventListener('click', (event) => { const row = event.target.closest('tr'); if (!row) return; const index = Array.from(this.tableBody.children).indexOf(row); if (event.target.matches('.preview-drawing-btn')) this.previewDrawing(index); if (event.target.matches('.delete-drawing-btn')) this.deleteDrawing(index); });
  },
  handleFiles(fileList) {
    const files = Array.from(fileList || []); if (!files.length) return;
    const readers = files.map((file) => new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, date: new Date().toISOString(), size: file.size, type: file.type, dataUrl: reader.result }); reader.readAsDataURL(file); }));
    Promise.all(readers).then((entries) => { AppState.drawings = (AppState.drawings || []).concat(entries); this.render(); this.save(); showNotification('Shop drawings uploaded.', 'success'); });
  },
  previewDrawing(index) { const drawing = (AppState.drawings || [])[index]; if (!drawing || !this.preview) return; this.preview.innerHTML = drawing.type && drawing.type.startsWith('image/') ? `<img src="${drawing.dataUrl}" alt="${drawing.name}">` : `<p><strong>${drawing.name}</strong></p><p>Date: ${formatDate(drawing.date)}</p><p>Stored preview unavailable for non-image file types.</p>`; },
  deleteDrawing(index) { AppState.drawings.splice(index, 1); this.render(); this.save(); },
  render() { if (!this.tableBody) return; this.tableBody.innerHTML = ''; (AppState.drawings || []).forEach((drawing) => { const size = drawing.size ? `${Math.round(drawing.size / 1024)} KB` : 'Saved'; this.tableBody.insertAdjacentHTML('beforeend', `<tr><td>${drawing.name}</td><td>${formatDate(drawing.date)}</td><td>${size}</td><td><button type="button" class="btn btn-secondary btn-sm preview-drawing-btn">Preview</button> <button type="button" class="btn btn-danger btn-sm delete-drawing-btn">Delete</button></td></tr>`); }); },
  load() { AppState.drawings = Storage.load('drawings') || AppState.drawings || []; this.render(); },
  save() { Storage.save('drawings', AppState.drawings || []); return true; },
  validate() { return true; }
};
window.Tab5 = Tab5;
