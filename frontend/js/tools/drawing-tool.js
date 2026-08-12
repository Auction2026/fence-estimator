"use strict";
/**
 * @file Canvas-based site drawing tool for fence lines, gates, and corners.
 */
(function initDrawingTool(window, document) {
  /**
   * Basic drawing tool.
   */
  class DrawingTool {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {object} [options]
     */
    constructor(canvas, options) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
      this.options = Object.assign({ gridSize: 24 }, options || {});
      this.mode = "line";
      this.shapes = [];
      this.activePoint = null;
      this.isDrawing = false;
      this.bindCanvasEvents();
      this.redraw();
    }

    /**
     * Attach pointer handlers.
     * @returns {void}
     */
    bindCanvasEvents() {
      var self = this;
      this.canvas.addEventListener("mousedown", function (event) {
        self.isDrawing = true;
        self.activePoint = self.snap(self.getCanvasPoint(event));
      });
      this.canvas.addEventListener("mousemove", function () {
        if (self.isDrawing) {
          self.redraw();
        }
      });
      this.canvas.addEventListener("mouseup", function (event) {
        if (!self.isDrawing || !self.activePoint) {
          return;
        }
        self.addShape(self.activePoint, self.snap(self.getCanvasPoint(event)));
        self.isDrawing = false;
        self.activePoint = null;
      });
      this.canvas.addEventListener("mouseleave", function () {
        self.isDrawing = false;
        self.activePoint = null;
      });
    }

    /**
     * @param {MouseEvent} event
     * @returns {{x:number,y:number}}
     */
    getCanvasPoint(event) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    /**
     * @param {{x:number,y:number}} point
     * @returns {{x:number,y:number}}
     */
    snap(point) {
      var grid = this.options.gridSize;
      return {
        x: Math.round(point.x / grid) * grid,
        y: Math.round(point.y / grid) * grid
      };
    }

    /**
     * @param {{x:number,y:number}} start
     * @param {{x:number,y:number}} end
     * @returns {void}
     */
    addShape(start, end) {
      if (this.mode === "corner") {
        this.shapes.push({ type: "corner", point: start });
      } else {
        this.shapes.push({ type: this.mode, start: start, end: end });
      }
      this.redraw();
    }

    /**
     * @param {string} mode
     * @returns {void}
     */
    setMode(mode) {
      this.mode = mode;
    }

    /**
     * Remove last action.
     * @returns {void}
     */
    undo() {
      this.shapes.pop();
      this.redraw();
    }

    /**
     * Clear drawing.
     * @returns {void}
     */
    clear() {
      this.shapes = [];
      this.redraw();
    }

    /**
     * Redraw canvas content.
     * @returns {void}
     */
    redraw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      for (var i = 0; i < this.shapes.length; i += 1) {
        this.drawShape(this.shapes[i]);
      }
    }

    /**
     * Draw grid background.
     * @returns {void}
     */
    drawGrid() {
      var grid = this.options.gridSize;
      this.context.save();
      this.context.strokeStyle = "#e1e7ef";
      this.context.lineWidth = 1;
      for (var x = 0; x <= this.canvas.width; x += grid) {
        this.context.beginPath();
        this.context.moveTo(x, 0);
        this.context.lineTo(x, this.canvas.height);
        this.context.stroke();
      }
      for (var y = 0; y <= this.canvas.height; y += grid) {
        this.context.beginPath();
        this.context.moveTo(0, y);
        this.context.lineTo(this.canvas.width, y);
        this.context.stroke();
      }
      this.context.restore();
    }

    /**
     * @param {object} shape
     * @returns {void}
     */
    drawShape(shape) {
      this.context.save();
      if (shape.type === "gate") {
        this.context.strokeStyle = "#d97706";
        this.context.lineWidth = 4;
        this.drawLine(shape.start, shape.end);
      } else if (shape.type === "corner") {
        this.context.fillStyle = "#0f766e";
        this.context.beginPath();
        this.context.arc(shape.point.x, shape.point.y, 6, 0, Math.PI * 2);
        this.context.fill();
      } else {
        this.context.strokeStyle = "#1d4ed8";
        this.context.lineWidth = 3;
        this.drawLine(shape.start, shape.end);
      }
      this.context.restore();
    }

    /**
     * @param {{x:number,y:number}} start
     * @param {{x:number,y:number}} end
     * @returns {void}
     */
    drawLine(start, end) {
      this.context.beginPath();
      this.context.moveTo(start.x, start.y);
      this.context.lineTo(end.x, end.y);
      this.context.stroke();
      var distance = this.measureDistance(start, end);
      this.context.fillStyle = "#111827";
      this.context.font = "12px sans-serif";
      this.context.fillText(distance.toFixed(1) + " ft", (start.x + end.x) / 2 + 6, (start.y + end.y) / 2 - 6);
    }

    /**
     * @param {{x:number,y:number}} start
     * @param {{x:number,y:number}} end
     * @returns {number}
     */
    measureDistance(start, end) {
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      return Math.sqrt((dx * dx) + (dy * dy)) / this.options.gridSize * 4;
    }

    /**
     * @returns {Array<object>}
     */
    exportLayout() {
      return this.shapes.map(function (shape) {
        return JSON.parse(JSON.stringify(shape));
      });
    }

    /**
     * @param {Array<object>} shapes
     * @returns {void}
     */
    loadLayout(shapes) {
      this.shapes = Array.isArray(shapes) ? shapes.slice() : [];
      this.redraw();
    }
  }

  /**
   * Create a drawing tool toolbar and canvas instance.
   * @param {string} hostId
   * @param {object} [options]
   * @returns {DrawingTool|null}
   */
  function mountDrawingTool(hostId, options) {
    var host = document.getElementById(hostId);
    if (!host) {
      return null;
    }
    host.innerHTML = [
      '<div class="drawing-tool">',
      '  <div class="drawing-toolbar">',
      '    <button type="button" data-mode="line">Fence Line</button>',
      '    <button type="button" data-mode="gate">Gate</button>',
      '    <button type="button" data-mode="corner">Corner</button>',
      '    <button type="button" data-action="undo">Undo</button>',
      '    <button type="button" data-action="clear">Clear</button>',
      '  </div>',
      '  <canvas width="720" height="420"></canvas>',
      '</div>'
    ].join("");

    var tool = new DrawingTool(host.querySelector("canvas"), options);
    host.querySelectorAll("[data-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        tool.setMode(button.dataset.mode);
      });
    });
    host.querySelector('[data-action="undo"]').addEventListener("click", function () {
      tool.undo();
    });
    host.querySelector('[data-action="clear"]').addEventListener("click", function () {
      tool.clear();
    });
    return tool;
  }

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.drawing = {
    DrawingTool: DrawingTool,
    mount: mountDrawingTool
  };
})(window, document);
