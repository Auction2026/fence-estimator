(function () {
  class DrawingTool {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.tool = 'line';
      this.isDrawing = false;
      this.startPoint = null;
      this.currentShape = null;
      this.shapes = [];
      this.undoStack = [];
      this.redoStack = [];
      this.onChange = null;
    }

    init(canvasId, onChange) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.onChange = onChange || null;
      this.resizeCanvas();
      this.bindEvents();
      this.redraw();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    bindEvents() {
      if (!this.canvas || this.canvas.dataset.bound === 'true') return;
      this.canvas.dataset.bound = 'true';
      this.canvas.addEventListener('mousedown', (event) => this.handleStart(event));
      this.canvas.addEventListener('mousemove', (event) => this.handleMove(event));
      window.addEventListener('mouseup', (event) => this.handleEnd(event));
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const parentWidth = this.canvas.parentElement.clientWidth;
      const ratio = 1200 / 680;
      this.canvas.width = Math.min(1200, Math.max(760, parentWidth - 2));
      this.canvas.height = this.canvas.width / ratio;
      this.redraw();
    }

    setTool(tool) {
      this.tool = tool;
    }

    getPoint(event) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    handleStart(event) {
      this.isDrawing = true;
      this.startPoint = this.getPoint(event);
      if (this.tool === 'eraser') {
        this.eraseAt(this.startPoint);
      }
    }

    handleMove(event) {
      if (!this.isDrawing || !this.startPoint) return;
      const endPoint = this.getPoint(event);
      this.currentShape = { type: this.tool, start: this.startPoint, end: endPoint };
      this.redraw(true);
    }

    handleEnd(event) {
      if (!this.isDrawing || !this.startPoint || !this.canvas) return;
      const endPoint = this.getPoint(event);
      this.isDrawing = false;

      if (this.tool === 'eraser') {
        this.startPoint = null;
        this.currentShape = null;
        return;
      }

      let shape = { type: this.tool, start: this.startPoint, end: endPoint };
      if (this.tool === 'text') {
        const note = window.prompt('Enter layout note text:', 'Fence note');
        if (!note) {
          this.currentShape = null;
          this.startPoint = null;
          this.redraw();
          return;
        }
        shape.text = note;
      }
      if (this.tool === 'measure') {
        shape.distance = this.calculateDistance(shape.start, shape.end);
      }

      this.pushShape(shape);
      this.startPoint = null;
      this.currentShape = null;
    }

    calculateDistance(start, end) {
      const pixels = Math.hypot(end.x - start.x, end.y - start.y);
      return `${(pixels / 12).toFixed(1)} ft`;
    }

    pushShape(shape) {
      this.shapes.push(shape);
      this.undoStack.push(JSON.stringify(this.shapes));
      this.redoStack = [];
      this.redraw();
      this.triggerChange();
    }

    eraseAt(point) {
      const threshold = 14;
      this.shapes = this.shapes.filter((shape) => {
        const centerX = (shape.start.x + shape.end.x) / 2;
        const centerY = (shape.start.y + shape.end.y) / 2;
        return Math.hypot(centerX - point.x, centerY - point.y) > threshold;
      });
      this.undoStack.push(JSON.stringify(this.shapes));
      this.redraw();
      this.triggerChange();
    }

    undo() {
      if (this.shapes.length === 0) return;
      this.redoStack.push(JSON.stringify(this.shapes));
      this.shapes.pop();
      this.redraw();
      this.triggerChange();
    }

    redo() {
      if (this.redoStack.length === 0) return;
      this.shapes = JSON.parse(this.redoStack.pop());
      this.redraw();
      this.triggerChange();
    }

    clear() {
      this.shapes = [];
      this.undoStack = [];
      this.redoStack = [];
      this.redraw();
      this.triggerChange();
    }

    drawShape(shape, preview = false) {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = preview ? 'rgba(21, 101, 192, 0.5)' : '#1565C0';
      ctx.fillStyle = '#1565C0';
      ctx.lineWidth = 2;

      if (shape.type === 'line' || shape.type === 'measure') {
        ctx.beginPath();
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);
        ctx.stroke();
        if (shape.type === 'measure' && shape.distance) {
          ctx.fillStyle = '#0d47a1';
          ctx.font = '14px Inter';
          ctx.fillText(shape.distance, (shape.start.x + shape.end.x) / 2 + 8, (shape.start.y + shape.end.y) / 2 - 8);
        }
      } else if (shape.type === 'rectangle') {
        const width = shape.end.x - shape.start.x;
        const height = shape.end.y - shape.start.y;
        ctx.strokeRect(shape.start.x, shape.start.y, width, height);
      } else if (shape.type === 'text') {
        ctx.font = '14px Inter';
        ctx.fillText(shape.text || 'Note', shape.start.x, shape.start.y);
      }
      ctx.restore();
    }

    redraw(includeCurrent = false) {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      this.shapes.forEach((shape) => this.drawShape(shape));
      if (includeCurrent && this.currentShape) {
        this.drawShape(this.currentShape, true);
      }
    }

    drawGrid() {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(21, 101, 192, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= this.canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= this.canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    exportJSON() {
      return this.shapes;
    }

    importJSON(shapes = []) {
      this.shapes = Array.isArray(shapes) ? shapes : [];
      this.redraw();
    }

    exportImage() {
      return this.canvas ? this.canvas.toDataURL('image/png') : '';
    }

    downloadImage(filename = 'layout-diagram.png') {
      if (!this.canvas) return;
      const link = document.createElement('a');
      link.href = this.canvas.toDataURL('image/png');
      link.download = filename;
      link.click();
    }

    triggerChange() {
      if (typeof this.onChange === 'function') {
        this.onChange({ shapes: this.exportJSON(), imageData: this.exportImage() });
      }
    }
  }

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.drawing = new DrawingTool();
})();
