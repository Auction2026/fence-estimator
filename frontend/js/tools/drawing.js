/**
 * FENCE DEPOT ESTIMATOR - Drawing Tool
 * frontend/js/tools/drawing.js
 * (Enhanced drawing utilities - Tab3 uses this directly)
 */

'use strict';

var DrawingTool = DrawingTool || (function () {

  // Color palette for drawing layers
  var COLORS = {
    fence:      '#1B2D4D',
    gate:       '#FF6B35',
    dimension:  '#0FA89F',
    label:      '#E74C3C',
    grid:       '#E8EEF5',
  };

  // Shape type registry
  var SHAPE_TYPES = {
    LINE:     'line',
    RECT:     'rect',
    CIRCLE:   'circle',
    TEXT:     'text',
    GATE:     'gate',
    ARROW:    'arrow',
  };

  // ---- Drawing Helpers ----
  function drawLine(ctx, x1, y1, x2, y2, color, width, dash) {
    ctx.save();
    ctx.strokeStyle = color || COLORS.fence;
    ctx.lineWidth   = width || 2;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawRect(ctx, x, y, w, h, strokeColor, fillColor) {
    ctx.save();
    ctx.strokeStyle = strokeColor || COLORS.fence;
    ctx.lineWidth   = 2;
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w, h);
    }
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function drawCircle(ctx, cx, cy, r, strokeColor, fillColor) {
    ctx.save();
    ctx.strokeStyle = strokeColor || COLORS.gate;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
    ctx.stroke();
    ctx.restore();
  }

  function drawArrow(ctx, x1, y1, x2, y2, color) {
    var headLen = 14;
    var angle   = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color || COLORS.dimension;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    ctx.restore();
  }

  function drawDimension(ctx, x1, y1, x2, y2, labelText) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    drawArrow(ctx, x1, y1, x2, y2, COLORS.dimension);
    ctx.save();
    ctx.fillStyle  = COLORS.dimension;
    ctx.font       = 'bold 12px Segoe UI';
    ctx.textAlign  = 'center';
    ctx.fillText(labelText, mx, my - 6);
    ctx.restore();
  }

  function drawLabel(ctx, text, x, y, bgColor) {
    ctx.save();
    ctx.font = '11px Segoe UI';
    var w = ctx.measureText(text).width + 10;
    if (bgColor) {
      ctx.fillStyle = bgColor || '#fff';
      ctx.fillRect(x - 2, y - 13, w, 17);
    }
    ctx.fillStyle = COLORS.label;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawGateSymbol(ctx, x, y, width, height) {
    // Swing arc indicator for gate
    drawLine(ctx, x, y, x + width, y, COLORS.gate, 3);
    ctx.save();
    ctx.strokeStyle = COLORS.gate;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(x, y, width, 0, Math.PI / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    drawLabel(ctx, 'GATE', x + width / 2, y - 8, 'rgba(255,255,255,0.8)');
  }

  // ---- Scale Calculation ----
  function calcScale(canvasWidth, canvasHeight, fenceLinearFeet) {
    if (!fenceLinearFeet || fenceLinearFeet <= 0) return 1;
    var maxDim = Math.max(canvasWidth, canvasHeight) - 80;
    return maxDim / fenceLinearFeet; // pixels per foot
  }

  function linearDistance(x1, y1, x2, y2, scale) {
    var px = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return scale > 0 ? px / scale : px;
  }

  // ---- Export ----
  function canvasToDataURL(canvas, type, quality) {
    return canvas.toDataURL(type || 'image/png', quality || 1);
  }

  function downloadCanvas(canvas, filename) {
    var url = canvasToDataURL(canvas);
    var a   = document.createElement('a');
    a.href  = url;
    a.download = filename || 'layout.png';
    a.click();
  }

  // ---- init (delegates to Tab3Layout if present) ----
  function init() {
    if (typeof Tab3Layout !== 'undefined' && Tab3Layout !== DrawingTool) {
      Tab3Layout.init();
    }
  }

  return {
    COLORS,
    SHAPE_TYPES,
    drawLine, drawRect, drawCircle, drawArrow, drawDimension, drawLabel, drawGateSymbol,
    calcScale, linearDistance,
    canvasToDataURL, downloadCanvas,
    init,
  };

})();

window.DrawingTool = DrawingTool;
