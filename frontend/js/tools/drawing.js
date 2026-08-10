/**
 * Drawing Tool — Canvas-based fence layout sketcher
 */
(function () {
  'use strict';

  let canvas, ctx, tool = 'line', drawing = false;
  let startX = 0, startY = 0;
  let shapes  = [];
  let snapshot;

  app.drawing = {
    setTool(t) {
      tool = t;
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`.tool-btn[data-tool="${t}"]`);
      if (btn) btn.classList.add('active');
    },
    undo() {
      shapes.pop();
      redraw();
    },
    clear() {
      if (confirm('Clear canvas?')) { shapes = []; redraw(); }
    },
    exportPNG() {
      if (!canvas) return;
      const a = document.createElement('a');
      a.download = 'fence-layout.png';
      a.href = canvas.toDataURL();
      a.click();
    },
    init() {
      canvas = document.getElementById('drawingCanvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      canvas.addEventListener('mousedown', onDown);
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseup',   onUp);
    },
  };

  function onDown(e) {
    drawing = true;
    startX = e.offsetX; startY = e.offsetY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (tool === 'text') {
      const text = prompt('Enter label:');
      if (text) {
        shapes.push({ type:'text', x:startX, y:startY, text });
        redraw();
      }
      drawing = false;
    }
  }

  function onMove(e) {
    if (!drawing || tool === 'select' || tool === 'text') return;
    ctx.putImageData(snapshot, 0, 0);
    draw(startX, startY, e.offsetX, e.offsetY, true);
  }

  function onUp(e) {
    if (!drawing) return;
    drawing = false;
    if (tool === 'select' || tool === 'text') return;
    shapes.push({ type: tool, x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY });
    updateFootage();
  }

  function draw(x1, y1, x2, y2, preview) {
    ctx.strokeStyle = '#1a6cba';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    if (tool === 'line') {
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    } else if (tool === 'rect') {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
    ctx.stroke();
  }

  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(s => {
      if (s.type === 'line') {
        ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2);
        ctx.strokeStyle = '#1a6cba'; ctx.lineWidth = 2; ctx.stroke();
      } else if (s.type === 'rect') {
        ctx.strokeStyle = '#1a6cba'; ctx.lineWidth = 2;
        ctx.strokeRect(s.x1, s.y1, s.x2-s.x1, s.y2-s.y1);
      } else if (s.type === 'text') {
        ctx.fillStyle = '#1e293b'; ctx.font = '14px sans-serif';
        ctx.fillText(s.text, s.x, s.y);
      }
    });
    updateFootage();
  }

  function updateFootage() {
    const SCALE = 0.1; // 1 pixel = 0.1 ft (adjust as needed)
    const total = shapes
      .filter(s => s.type === 'line')
      .reduce((sum, s) => sum + Math.hypot(s.x2 - s.x1, s.y2 - s.y1), 0);
    const el = document.getElementById('drawingFootageDisplay');
    if (el) el.textContent = `Total drawn: ~${(total * SCALE).toFixed(1)} ft`;
  }

  // Init drawing canvas when drawing tab is first activated
  const origSwitch = app.switchTab.bind(app);
  app.switchTab = function (tabId) {
    origSwitch(tabId);
    if (tabId === 'drawing-tool') app.drawing.init();
  };
}());
