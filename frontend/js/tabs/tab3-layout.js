/**
 * TAB 3 - Layout Diagram (Canvas Drawing)
 * frontend/js/tabs/tab3-layout.js
 */

'use strict';

var Tab3Layout = (function () {

  var canvas, ctx;
  var drawing = false;
  var currentTool = 'line';
  var startX, startY;
  var shapes = [];
  var scale = 10; // 1 pixel = scale inches

  function init() {
    canvas = document.getElementById('layout-canvas');
    if (!canvas) return;
    ctx    = canvas.getContext('2d');
    fitCanvas();
    bindTools();
    bindCanvasEvents();
    loadSavedLayout();
    redraw();
  }

  function fitCanvas() {
    var container = canvas.parentElement;
    if (container) {
      canvas.width  = container.clientWidth  || 700;
      canvas.height = 500;
    }
  }

  function bindTools() {
    document.querySelectorAll('.tool-btn[data-tool]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentTool = btn.dataset.tool;
        document.querySelectorAll('.tool-btn[data-tool]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    var btnClear = document.getElementById('btn-clear-canvas');
    if (btnClear) btnClear.addEventListener('click', clearCanvas);

    var btnSave = document.getElementById('btn-save-layout');
    if (btnSave) btnSave.addEventListener('click', saveLayout);

    var btnUndo = document.getElementById('btn-undo');
    if (btnUndo) btnUndo.addEventListener('click', undo);
  }

  function bindCanvasEvents() {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup',   onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);
  }

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onMouseDown(e) { var p = getPos(e); drawing = true; startX = p.x; startY = p.y; }
  function onMouseUp(e)   { if (!drawing) return; var p = getPos(e); addShape(startX, startY, p.x, p.y); drawing = false; }
  function onMouseMove(e) { if (!drawing) return; redraw(); drawPreview(getPos(e)); }

  function onTouchStart(e) { e.preventDefault(); var t = e.touches[0]; onMouseDown({ clientX: t.clientX, clientY: t.clientY }); }
  function onTouchMove(e)  { e.preventDefault(); var t = e.touches[0]; onMouseMove({ clientX: t.clientX, clientY: t.clientY }); }
  function onTouchEnd(e)   { e.preventDefault(); var t = e.changedTouches[0]; onMouseUp({ clientX: t.clientX, clientY: t.clientY }); }

  function addShape(x1, y1, x2, y2) {
    var len = Math.round(Math.sqrt((x2-x1)**2 + (y2-y1)**2) * scale / 12);
    shapes.push({ tool: currentTool, x1, y1, x2, y2, len: len });
    redraw();
  }

  function drawPreview(pos) {
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = '#0FA89F';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    shapes.forEach(drawShape);
  }

  function drawGrid() {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth   = 1;
    for (var x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (var y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  function drawShape(shape) {
    ctx.strokeStyle = '#1B2D4D';
    ctx.lineWidth   = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
    ctx.stroke();
    // Label length
    var mx = (shape.x1 + shape.x2) / 2;
    var my = (shape.y1 + shape.y2) / 2;
    ctx.fillStyle   = '#FF6B35';
    ctx.font        = '12px Segoe UI';
    ctx.fillText(shape.len + ' ft', mx + 4, my - 4);
  }

  function clearCanvas() {
    if (!window.confirm('Clear the layout? This cannot be undone.')) return;
    shapes = [];
    redraw();
    FenceApp.project.layout = null;
    Storage.saveProject(FenceApp.project);
  }

  function undo() {
    shapes.pop();
    redraw();
  }

  function saveLayout() {
    FenceApp.project.layout = {
      shapes:    shapes,
      imageData: canvas.toDataURL(),
      savedAt:   new Date().toISOString(),
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Layout saved ✓', 'success');
  }

  function loadSavedLayout() {
    var layout = FenceApp.project.layout;
    if (layout && Array.isArray(layout.shapes)) {
      shapes = layout.shapes;
    }
  }

  function getLayoutImage() {
    return canvas ? canvas.toDataURL() : null;
  }

  return { init, saveLayout, clearCanvas, getLayoutImage };

})();

window.Tab3Layout    = Tab3Layout;
window.DrawingTool   = Tab3Layout; // alias used in app.js
