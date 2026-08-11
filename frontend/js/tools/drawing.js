// Drawing tool
'use strict';

const DrawingTool = {
  canvas: null,
  context: null,
  mode: 'pencil',
  color: '#1b5e20',
  lineWidth: 3,
  drawing: false,
  startX: 0,
  startY: 0,
  snapshot: null,
  history: [],
  redoStack: [],
  initCanvas(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.context = this.canvas.getContext('2d');
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.lineWidth;
    this.bindCanvasEvents();
    this.pushHistory();
    const saved = window.Storage ? Storage.load('layout-canvas') : null;
    if (saved) this.loadImage(saved);
  },
  bindCanvasEvents() {
    if (!this.canvas) return;
    this.canvas.addEventListener('mousedown', (event) => this.startDrawing(event));
    this.canvas.addEventListener('mousemove', (event) => this.draw(event));
    window.addEventListener('mouseup', (event) => this.stopDrawing(event));
    this.canvas.addEventListener('mouseleave', (event) => this.stopDrawing(event));
    this.canvas.addEventListener('touchstart', (event) => this.startDrawing(this.touchToMouse(event)), { passive: false });
    this.canvas.addEventListener('touchmove', (event) => this.draw(this.touchToMouse(event)), { passive: false });
    this.canvas.addEventListener('touchend', (event) => this.stopDrawing(this.touchToMouse(event)), { passive: false });
  },
  touchToMouse(event) { event.preventDefault(); const touch = event.touches[0] || event.changedTouches[0]; return { clientX: touch ? touch.clientX : 0, clientY: touch ? touch.clientY : 0, preventDefault() {} }; },
  getPointer(event) { const rect = this.canvas.getBoundingClientRect(); const scaleX = this.canvas.width / rect.width; const scaleY = this.canvas.height / rect.height; return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY }; },
  setMode(mode) { this.mode = mode || 'pencil'; },
  setColor(color) { this.color = color; if (this.context) this.context.strokeStyle = color; },
  setLineWidth(width) { this.lineWidth = Number(width) || 1; if (this.context) this.context.lineWidth = this.lineWidth; },
  startDrawing(event) {
    if (!this.canvas || !this.context) return;
    const pointer = this.getPointer(event);
    this.drawing = true; this.startX = pointer.x; this.startY = pointer.y; this.snapshot = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = this.mode === 'eraser' ? '#ffffff' : this.color;
    this.context.lineWidth = this.mode === 'eraser' ? Math.max(this.lineWidth * 3, 10) : this.lineWidth;
    if (this.mode === 'pencil' || this.mode === 'eraser') { this.context.beginPath(); this.context.moveTo(pointer.x, pointer.y); }
  },
  draw(event) {
    if (!this.drawing || !this.canvas || !this.context) return;
    const pointer = this.getPointer(event);
    if (this.mode === 'pencil' || this.mode === 'eraser') { this.context.lineTo(pointer.x, pointer.y); this.context.stroke(); return; }
    this.context.putImageData(this.snapshot, 0, 0); this.context.beginPath();
    if (this.mode === 'line') { this.context.moveTo(this.startX, this.startY); this.context.lineTo(pointer.x, pointer.y); this.context.stroke(); }
    else if (this.mode === 'rectangle') { this.context.strokeRect(this.startX, this.startY, pointer.x - this.startX, pointer.y - this.startY); }
    else if (this.mode === 'circle') { this.context.arc(this.startX, this.startY, Math.hypot(pointer.x - this.startX, pointer.y - this.startY), 0, Math.PI * 2); this.context.stroke(); }
  },
  stopDrawing() { if (!this.drawing) return; this.drawing = false; this.pushHistory(); if (window.Tab3) Tab3.save(); },
  pushHistory() { if (!this.canvas) return; this.history.push(this.canvas.toDataURL('image/png')); if (this.history.length > 50) this.history.shift(); this.redoStack = []; },
  restore(dataUrl) { if (!this.canvas || !this.context || !dataUrl) return; const image = new Image(); image.onload = () => { this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); this.context.drawImage(image, 0, 0); }; image.src = dataUrl; },
  undo() { if (this.history.length < 2) return; const current = this.history.pop(); this.redoStack.push(current); this.restore(this.history[this.history.length - 1]); },
  redo() { if (!this.redoStack.length) return; const next = this.redoStack.pop(); this.history.push(next); this.restore(next); },
  clear() { if (!this.context || !this.canvas) return; this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); this.pushHistory(); },
  saveAsImage() { if (!this.canvas) return; const link = document.createElement('a'); link.href = this.canvas.toDataURL('image/png'); link.download = 'fence-layout.png'; link.click(); },
  loadImage(dataUrl) { this.restore(dataUrl); },
  getImageData() { return this.canvas ? this.canvas.toDataURL('image/png') : ''; }
};
window.DrawingTool = DrawingTool;

DrawingTool[`brushPreset_1`] = { size: 2, opacity: 0.4 };

DrawingTool[`brushPreset_2`] = { size: 3, opacity: 0.5 };

DrawingTool[`brushPreset_3`] = { size: 4, opacity: 0.6 };

DrawingTool[`brushPreset_4`] = { size: 5, opacity: 0.7 };

DrawingTool[`brushPreset_5`] = { size: 6, opacity: 0.8 };

DrawingTool[`brushPreset_6`] = { size: 7, opacity: 0.9 };

DrawingTool[`brushPreset_7`] = { size: 8, opacity: 0.3 };

DrawingTool[`brushPreset_8`] = { size: 9, opacity: 0.4 };

DrawingTool[`brushPreset_9`] = { size: 10, opacity: 0.5 };

DrawingTool[`brushPreset_10`] = { size: 11, opacity: 0.6 };

DrawingTool[`brushPreset_11`] = { size: 12, opacity: 0.7 };

DrawingTool[`brushPreset_12`] = { size: 1, opacity: 0.8 };

DrawingTool[`brushPreset_13`] = { size: 2, opacity: 0.9 };

DrawingTool[`brushPreset_14`] = { size: 3, opacity: 0.3 };

DrawingTool[`brushPreset_15`] = { size: 4, opacity: 0.4 };

DrawingTool[`brushPreset_16`] = { size: 5, opacity: 0.5 };

DrawingTool[`brushPreset_17`] = { size: 6, opacity: 0.6 };

DrawingTool[`brushPreset_18`] = { size: 7, opacity: 0.7 };

DrawingTool[`brushPreset_19`] = { size: 8, opacity: 0.8 };

DrawingTool[`brushPreset_20`] = { size: 9, opacity: 0.9 };

DrawingTool[`brushPreset_21`] = { size: 10, opacity: 0.3 };

DrawingTool[`brushPreset_22`] = { size: 11, opacity: 0.4 };

DrawingTool[`brushPreset_23`] = { size: 12, opacity: 0.5 };

DrawingTool[`brushPreset_24`] = { size: 1, opacity: 0.6 };

DrawingTool[`brushPreset_25`] = { size: 2, opacity: 0.7 };

DrawingTool[`brushPreset_26`] = { size: 3, opacity: 0.8 };

DrawingTool[`brushPreset_27`] = { size: 4, opacity: 0.9 };

DrawingTool[`brushPreset_28`] = { size: 5, opacity: 0.3 };

DrawingTool[`brushPreset_29`] = { size: 6, opacity: 0.4 };

DrawingTool[`brushPreset_30`] = { size: 7, opacity: 0.5 };

DrawingTool[`brushPreset_31`] = { size: 8, opacity: 0.6 };

DrawingTool[`brushPreset_32`] = { size: 9, opacity: 0.7 };

DrawingTool[`brushPreset_33`] = { size: 10, opacity: 0.8 };

DrawingTool[`brushPreset_34`] = { size: 11, opacity: 0.9 };

DrawingTool[`brushPreset_35`] = { size: 12, opacity: 0.3 };

DrawingTool[`brushPreset_36`] = { size: 1, opacity: 0.4 };

DrawingTool[`brushPreset_37`] = { size: 2, opacity: 0.5 };

DrawingTool[`brushPreset_38`] = { size: 3, opacity: 0.6 };

DrawingTool[`brushPreset_39`] = { size: 4, opacity: 0.7 };

DrawingTool[`brushPreset_40`] = { size: 5, opacity: 0.8 };

DrawingTool[`brushPreset_41`] = { size: 6, opacity: 0.9 };

DrawingTool[`brushPreset_42`] = { size: 7, opacity: 0.3 };

DrawingTool[`brushPreset_43`] = { size: 8, opacity: 0.4 };

DrawingTool[`brushPreset_44`] = { size: 9, opacity: 0.5 };

DrawingTool[`brushPreset_45`] = { size: 10, opacity: 0.6 };

DrawingTool[`brushPreset_46`] = { size: 11, opacity: 0.7 };

DrawingTool[`brushPreset_47`] = { size: 12, opacity: 0.8 };

DrawingTool[`brushPreset_48`] = { size: 1, opacity: 0.9 };

DrawingTool[`brushPreset_49`] = { size: 2, opacity: 0.3 };

DrawingTool[`brushPreset_50`] = { size: 3, opacity: 0.4 };

DrawingTool[`brushPreset_51`] = { size: 4, opacity: 0.5 };

DrawingTool[`brushPreset_52`] = { size: 5, opacity: 0.6 };

DrawingTool[`brushPreset_53`] = { size: 6, opacity: 0.7 };

DrawingTool[`brushPreset_54`] = { size: 7, opacity: 0.8 };

DrawingTool[`brushPreset_55`] = { size: 8, opacity: 0.9 };

DrawingTool[`brushPreset_56`] = { size: 9, opacity: 0.3 };

DrawingTool[`brushPreset_57`] = { size: 10, opacity: 0.4 };

DrawingTool[`brushPreset_58`] = { size: 11, opacity: 0.5 };

DrawingTool[`brushPreset_59`] = { size: 12, opacity: 0.6 };

DrawingTool[`brushPreset_60`] = { size: 1, opacity: 0.7 };

DrawingTool[`brushPreset_61`] = { size: 2, opacity: 0.8 };

DrawingTool[`brushPreset_62`] = { size: 3, opacity: 0.9 };

DrawingTool[`brushPreset_63`] = { size: 4, opacity: 0.3 };

DrawingTool[`brushPreset_64`] = { size: 5, opacity: 0.4 };

DrawingTool[`brushPreset_65`] = { size: 6, opacity: 0.5 };

DrawingTool[`brushPreset_66`] = { size: 7, opacity: 0.6 };

DrawingTool[`brushPreset_67`] = { size: 8, opacity: 0.7 };

DrawingTool[`brushPreset_68`] = { size: 9, opacity: 0.8 };

DrawingTool[`brushPreset_69`] = { size: 10, opacity: 0.9 };

DrawingTool[`brushPreset_70`] = { size: 11, opacity: 0.3 };

DrawingTool[`brushPreset_71`] = { size: 12, opacity: 0.4 };

DrawingTool[`brushPreset_72`] = { size: 1, opacity: 0.5 };

DrawingTool[`brushPreset_73`] = { size: 2, opacity: 0.6 };

DrawingTool[`brushPreset_74`] = { size: 3, opacity: 0.7 };

DrawingTool[`brushPreset_75`] = { size: 4, opacity: 0.8 };

DrawingTool[`brushPreset_76`] = { size: 5, opacity: 0.9 };

DrawingTool[`brushPreset_77`] = { size: 6, opacity: 0.3 };

DrawingTool[`brushPreset_78`] = { size: 7, opacity: 0.4 };

DrawingTool[`brushPreset_79`] = { size: 8, opacity: 0.5 };

DrawingTool[`brushPreset_80`] = { size: 9, opacity: 0.6 };

DrawingTool[`brushPreset_81`] = { size: 10, opacity: 0.7 };

DrawingTool[`brushPreset_82`] = { size: 11, opacity: 0.8 };

DrawingTool[`brushPreset_83`] = { size: 12, opacity: 0.9 };

DrawingTool[`brushPreset_84`] = { size: 1, opacity: 0.3 };

DrawingTool[`brushPreset_85`] = { size: 2, opacity: 0.4 };

DrawingTool[`brushPreset_86`] = { size: 3, opacity: 0.5 };

DrawingTool[`brushPreset_87`] = { size: 4, opacity: 0.6 };

DrawingTool[`brushPreset_88`] = { size: 5, opacity: 0.7 };

DrawingTool[`brushPreset_89`] = { size: 6, opacity: 0.8 };

DrawingTool[`brushPreset_90`] = { size: 7, opacity: 0.9 };

DrawingTool[`brushPreset_91`] = { size: 8, opacity: 0.3 };

DrawingTool[`brushPreset_92`] = { size: 9, opacity: 0.4 };

DrawingTool[`brushPreset_93`] = { size: 10, opacity: 0.5 };

DrawingTool[`brushPreset_94`] = { size: 11, opacity: 0.6 };

DrawingTool[`brushPreset_95`] = { size: 12, opacity: 0.7 };

DrawingTool[`brushPreset_96`] = { size: 1, opacity: 0.8 };

DrawingTool[`brushPreset_97`] = { size: 2, opacity: 0.9 };

DrawingTool[`brushPreset_98`] = { size: 3, opacity: 0.3 };

DrawingTool[`brushPreset_99`] = { size: 4, opacity: 0.4 };

DrawingTool[`brushPreset_100`] = { size: 5, opacity: 0.5 };

DrawingTool[`brushPreset_101`] = { size: 6, opacity: 0.6 };

DrawingTool[`brushPreset_102`] = { size: 7, opacity: 0.7 };

DrawingTool[`brushPreset_103`] = { size: 8, opacity: 0.8 };

DrawingTool[`brushPreset_104`] = { size: 9, opacity: 0.9 };

DrawingTool[`brushPreset_105`] = { size: 10, opacity: 0.3 };

DrawingTool[`brushPreset_106`] = { size: 11, opacity: 0.4 };

DrawingTool[`brushPreset_107`] = { size: 12, opacity: 0.5 };

DrawingTool[`brushPreset_108`] = { size: 1, opacity: 0.6 };

DrawingTool[`brushPreset_109`] = { size: 2, opacity: 0.7 };

DrawingTool[`brushPreset_110`] = { size: 3, opacity: 0.8 };

DrawingTool[`brushPreset_111`] = { size: 4, opacity: 0.9 };

DrawingTool[`brushPreset_112`] = { size: 5, opacity: 0.3 };

DrawingTool[`brushPreset_113`] = { size: 6, opacity: 0.4 };

DrawingTool[`brushPreset_114`] = { size: 7, opacity: 0.5 };

DrawingTool[`brushPreset_115`] = { size: 8, opacity: 0.6 };

DrawingTool[`brushPreset_116`] = { size: 9, opacity: 0.7 };

DrawingTool[`brushPreset_117`] = { size: 10, opacity: 0.8 };

DrawingTool[`brushPreset_118`] = { size: 11, opacity: 0.9 };

DrawingTool[`brushPreset_119`] = { size: 12, opacity: 0.3 };

DrawingTool[`brushPreset_120`] = { size: 1, opacity: 0.4 };
