// Layout diagram tab
'use strict';

const Tab3 = {
  storageKey: 'layout-canvas',
  metaKey: 'layout-drawing-meta',
  init() {
    this.cache();
    if (window.DrawingTool) DrawingTool.initCanvas('layoutCanvas');
    this.bindEvents();
    this.load();
  },
  cache() {
    this.canvas = document.getElementById('layoutCanvas');
    this.root = document.getElementById('tab-3');
    this.colorPicker = document.getElementById('drawingColor');
    this.lineWidth = document.getElementById('drawingLineWidth');
    this.saveButton = document.getElementById('toolSaveDrawing');
    this.clearButton = document.getElementById('toolClear');
    this.downloadButton = document.getElementById('downloadDrawingBtn');
    this.previewButton = document.getElementById('exportDrawingToNotesBtn');
    this.printButton = document.getElementById('printDrawingBtn');
    this.legendFields = Array.from(this.root ? this.root.querySelectorAll('[id^="layoutLegend"]') : []);
    this.modeButtons = {
      pencil: document.getElementById('toolPencil'),
      line: document.getElementById('toolLine'),
      rectangle: document.getElementById('toolRectangle'),
      eraser: document.getElementById('toolEraser')
    };
  },
  bindEvents() {
    Object.keys(this.modeButtons).forEach((mode) => {
      const button = this.modeButtons[mode];
      if (!button) return;
      button.addEventListener('click', () => this.setMode(mode));
    });
    if (this.colorPicker) {
      this.colorPicker.addEventListener('change', (event) => {
        if (window.DrawingTool) DrawingTool.setColor(event.target.value);
        this.save(false);
      });
    }
    if (this.lineWidth) {
      this.lineWidth.addEventListener('input', (event) => {
        if (window.DrawingTool) DrawingTool.setLineWidth(event.target.value);
        this.save(false);
      });
    }
    this.legendFields.forEach((field) => field.addEventListener('input', App.debounce(() => this.save(false), 200)));
    if (this.saveButton) {
      this.saveButton.addEventListener('click', () => {
        this.save(true);
        if (window.DrawingTool) DrawingTool.saveAsImage();
      });
    }
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => {
        if (window.DrawingTool) DrawingTool.clear();
        this.save(false);
      });
    }
    if (this.downloadButton) this.downloadButton.addEventListener('click', () => this.download());
    if (this.previewButton) this.previewButton.addEventListener('click', () => this.addSnapshotToDrawings());
    if (this.printButton) this.printButton.addEventListener('click', () => this.printLayout());
  },
  setMode(mode) {
    if (window.DrawingTool) DrawingTool.setMode(mode);
    Object.keys(this.modeButtons).forEach((key) => {
      const button = this.modeButtons[key];
      if (button) button.classList.toggle('active', key === mode);
    });
  },
  getLegendNotes() {
    return this.legendFields.reduce((notes, field) => {
      if (field.value.trim()) notes.push(field.value.trim());
      return notes;
    }, []);
  },
  addSnapshotToDrawings() {
    const image = this.getImageData();
    if (!image) return;
    AppState.drawings = Array.isArray(AppState.drawings) ? AppState.drawings : [];
    AppState.drawings.push({
      name: `layout-snapshot-${AppState.drawings.length + 1}.png`,
      size: image.length,
      type: 'image/png',
      date: new Date().toISOString(),
      notes: this.getLegendNotes(),
      dataUrl: image
    });
    Storage.save('drawings', AppState.drawings);
    UI.showNotification('Snapshot added to shop drawings.', 'success');
  },
  getImageData() {
    return window.DrawingTool ? DrawingTool.getImageData() : '';
  },
  applyMeta(meta) {
    if (this.colorPicker && meta.color) this.colorPicker.value = meta.color;
    if (this.lineWidth && meta.lineWidth) this.lineWidth.value = meta.lineWidth;
    if (window.DrawingTool && meta.color) DrawingTool.setColor(meta.color);
    if (window.DrawingTool && meta.lineWidth) DrawingTool.setLineWidth(meta.lineWidth);
    this.legendFields.forEach((field, index) => {
      field.value = (meta.legendNotes || [])[index] || '';
    });
  },
  load() {
    const saved = Storage.load(this.storageKey) || AppState.drawingData || '';
    const meta = Storage.load(this.metaKey) || {};
    AppState.drawingData = saved;
    if (saved && window.DrawingTool) DrawingTool.loadImage(saved);
    this.applyMeta(meta);
    this.setMode('pencil');
  },
  save(showToast = false) {
    const image = this.getImageData();
    if (!image) return false;
    AppState.drawingData = image;
    Storage.save(this.storageKey, image);
    Storage.save(this.metaKey, {
      savedAt: new Date().toISOString(),
      color: this.colorPicker ? this.colorPicker.value : '#1b5e20',
      lineWidth: this.lineWidth ? this.lineWidth.value : 3,
      legendNotes: this.getLegendNotes()
    });
    if (showToast) UI.showNotification('Layout saved.', 'success');
    return true;
  },
  clear() {
    if (window.DrawingTool) DrawingTool.clear();
    return this.save(false);
  },
  download() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.href = this.canvas.toDataURL('image/png');
    link.download = `layout-${(AppState.currentProject || {}).projectId || 'drawing'}.png`;
    link.click();
  },
  printLayout() {
    const image = this.getImageData();
    if (!image || !window.PrintTool) return false;
    PrintTool.openPrintWindow('Fence Layout Diagram', `<h1>Fence Layout Diagram</h1><img src="${image}" style="max-width:100%;"><p>${this.getLegendNotes().join('<br>') || 'No legend notes entered.'}</p>`);
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab3 = Tab3;
