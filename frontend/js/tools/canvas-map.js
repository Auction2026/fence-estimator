/* ═══════════════════════════════════════════════════════════════
   canvas-map.js – freehand / polyline site map drawing tool
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const canvas = document.getElementById('site-canvas');
const ctx    = canvas.getContext('2d');
const SCALE  = 10; // pixels per foot (default)
let points   = [];
let history  = [];
let drawing  = false;

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#1a6b3c';
  ctx.lineWidth   = 2.5;
  ctx.stroke();
  // measure
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    total += Math.sqrt(dx*dx + dy*dy);
  }
  const feet = (total / SCALE).toFixed(1);
  document.getElementById('map-footage-display').textContent = `Measured: ${feet} ft`;
}

function drawGrid() {
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth   = .5;
  for (let x = 0; x < canvas.width; x += SCALE) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += SCALE) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

canvas.addEventListener('mousedown', e => {
  drawing = true;
  history.push([...points]);
  const r = canvas.getBoundingClientRect();
  points.push({ x: e.clientX - r.left, y: e.clientY - r.top });
});
canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const r = canvas.getBoundingClientRect();
  points.push({ x: e.clientX - r.left, y: e.clientY - r.top });
  redraw();
});
canvas.addEventListener('mouseup', () => { drawing = false; redraw(); });
canvas.addEventListener('mouseleave', () => { drawing = false; });

// touch support
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  const r = canvas.getBoundingClientRect();
  drawing = true;
  history.push([...points]);
  points.push({ x: t.clientX - r.left, y: t.clientY - r.top });
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!drawing) return;
  const t = e.touches[0];
  const r = canvas.getBoundingClientRect();
  points.push({ x: t.clientX - r.left, y: t.clientY - r.top });
  redraw();
}, { passive: false });
canvas.addEventListener('touchend', () => { drawing = false; redraw(); });

document.getElementById('map-clear-btn').addEventListener('click', () => {
  history = []; points = []; redraw();
  document.getElementById('map-footage-display').textContent = 'Measured: 0 ft';
});
document.getElementById('map-undo-btn').addEventListener('click', () => {
  if (history.length) { points = history.pop(); redraw(); }
});
document.getElementById('map-save-btn').addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'site-map.png';
  a.click();
  App.toast('Site map downloaded', 'success');
});

redraw();
