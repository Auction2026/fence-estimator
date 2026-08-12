/**
 * FENCE DEPOT ESTIMATOR - Drawing Tool
 * drawing.js — canvas-based fence layout sketcher
 */
'use strict';

const DrawingTool = (() => {
  let canvas, ctx;
  let activeTool = 'line';
  let isDrawing  = false;
  let startX, startY;
  let segments   = [];
  let undoStack  = [];
  let scale      = 10;  // px per foot

  const COLORS = {
    fence:    '#0FA89F',
    gate:     '#FF6B35',
    post:     '#1B2D4D',
    grid:     '#E0E6ED',
    text:     '#2C3E50',
  };

  function init(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width  = canvas.parentElement.clientWidth  || 800;
    canvas.height = canvas.parentElement.clientHeight || 500;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup',   onMouseUp);
    canvas.addEventListener('mouseleave',() => { isDrawing = false; });

    drawGrid();
  }

  // ── Grid ────────────────────────────────────────────────
  function drawGrid() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    segments.forEach(drawSegment);
  }

  function drawSegment(seg) {
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
    ctx.strokeStyle = seg.type === 'gate' ? COLORS.gate : COLORS.fence;
    ctx.lineWidth   = seg.type === 'gate' ? 3 : 4;
    ctx.setLineDash(seg.type === 'gate' ? [8, 4] : []);
    ctx.stroke();
    ctx.setLineDash([]);
    // Label length
    const ft = Math.round(Math.hypot(seg.x2-seg.x1, seg.y2-seg.y1) / scale);
    const mx = (seg.x1+seg.x2)/2, my = (seg.y1+seg.y2)/2;
    ctx.fillStyle   = COLORS.text;
    ctx.font        = '12px Segoe UI';
    ctx.textAlign   = 'center';
    ctx.fillText(ft + ' ft', mx, my - 8);
  }

  // ── Mouse events ─────────────────────────────────────────
  function snap(v) { return Math.round(v / scale) * scale; }

  function onMouseDown(e) {
    const r = canvas.getBoundingClientRect();
    startX   = snap(e.clientX - r.left);
    startY   = snap(e.clientY - r.top);
    isDrawing = true;
  }

  function onMouseMove(e) {
    if (!isDrawing) return;
    const r  = canvas.getBoundingClientRect();
    const cx = snap(e.clientX - r.left);
    const cy = snap(e.clientY - r.top);
    drawGrid();
    // Preview line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = activeTool === 'gate' ? COLORS.gate : COLORS.fence;
    ctx.lineWidth   = activeTool === 'gate' ? 3 : 4;
    ctx.setLineDash(activeTool === 'gate' ? [8,4] : []);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function onMouseUp(e) {
    if (!isDrawing) return;
    const r  = canvas.getBoundingClientRect();
    const ex = snap(e.clientX - r.left);
    const ey = snap(e.clientY - r.top);
    if (Math.hypot(ex-startX, ey-startY) > scale) {
      undoStack.push([...segments]);
      segments.push({ x1: startX, y1: startY, x2: ex, y2: ey, type: activeTool });
    }
    isDrawing = false;
    drawGrid();
  }

  // ── Controls ─────────────────────────────────────────────
  function setTool(tool) { activeTool = tool; }
  function undo() {
    if (undoStack.length) { segments = undoStack.pop(); drawGrid(); }
  }
  function clearAll() { undoStack.push([...segments]); segments = []; drawGrid(); }

  function getTotalFootage() {
    return Math.round(segments
      .filter(s => s.type !== 'gate')
      .reduce((sum, s) => sum + Math.hypot(s.x2-s.x1, s.y2-s.y1)/scale, 0));
  }

  function getGateCount() { return segments.filter(s => s.type === 'gate').length; }

  function exportToEstimate() {
    return {
      footage:   getTotalFootage(),
      gateCount: getGateCount(),
    };
  }

  return { init, setTool, undo, clearAll, getTotalFootage, getGateCount, exportToEstimate };
})();

window.DrawingTool = DrawingTool;
