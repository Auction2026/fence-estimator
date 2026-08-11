// Layout tab
'use strict';

const Tab3 = {
  init() { this.bindEvents(); this.load(); },
  bindEvents() {
    const snapshotButton = document.getElementById('exportDrawingToNotesBtn');
    if (snapshotButton) snapshotButton.addEventListener('click', () => { if (!window.DrawingTool) return; const image = DrawingTool.getImageData(); AppState.drawings.push({ name: 'Layout Snapshot', date: new Date().toISOString(), dataUrl: image }); Storage.save('drawings', AppState.drawings); showNotification('Drawing snapshot stored.', 'success'); });
  },
  load() { AppState.drawings = Storage.load('drawings') || AppState.drawings || []; AppState.drawingData = Storage.load('layout-canvas') || AppState.drawingData; if (window.DrawingTool && AppState.drawingData) DrawingTool.loadImage(AppState.drawingData); },
  save() { if (!window.DrawingTool) return false; AppState.drawingData = DrawingTool.getImageData(); Storage.save('layout-canvas', AppState.drawingData); return true; },
  validate() { return true; }
};
window.Tab3 = Tab3;
