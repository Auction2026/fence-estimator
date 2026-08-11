/**
 * drawing.js – Canvas drawing tool for Layout Diagram tab
 */
const DrawingTool = (() => {
  let canvas, ctx;
  let tool = 'pen';
  let color = '#1a3c6e';
  let size = 3;
  let drawing = false;
  let startX, startY;
  let snapshot;

  function init() {
    canvas = document.getElementById('layout-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load saved drawing
    const saved = Storage.loadCanvas();
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = saved;
    } else {
      drawGrid();
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    // Toolbar
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tool = btn.dataset.tool;
      });
    });

    const colorInput = document.getElementById('draw-color');
    if (colorInput) colorInput.addEventListener('input', e => color = e.target.value);

    const sizeInput = document.getElementById('draw-size');
    if (sizeInput) sizeInput.addEventListener('input', e => size = parseInt(e.target.value));

    document.getElementById('btn-clear-canvas')?.addEventListener('click', clearCanvas);
    document.getElementById('btn-save-canvas')?.addEventListener('click', saveCanvas);
    document.getElementById('btn-download-canvas')?.addEventListener('click', downloadCanvas);
    document.getElementById('btn-add-label')?.addEventListener('click', addLabel);
  }

  function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    drawing = true;
    const pos = getPos(e);
    startX = pos.x; startY = pos.y;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }

  function draw(e) {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pen') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
      } else if (tool === 'circle') {
        const r = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
        ctx.arc(startX, startY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function endDraw() {
    drawing = false;
    ctx.beginPath();
  }

  function touchStart(e) {
    e.preventDefault();
    startDraw(e.touches[0]);
  }

  function touchMove(e) {
    e.preventDefault();
    draw(e.touches[0]);
  }

  function clearCanvas() {
    if (!UI.confirm('Clear the drawing?')) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    Storage.saveCanvas(null);
  }

  function saveCanvas() {
    const dataUrl = canvas.toDataURL('image/png');
    Storage.saveCanvas(dataUrl);
    UI.showNotification('Drawing saved', 'success');
  }

  function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'fence-layout.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function addLabel() {
    const text = UI.getValue('canvas-label-text').trim();
    if (!text) return;
    ctx.fillStyle = color;
    ctx.font = `${size * 4 + 10}px sans-serif`;
    ctx.fillText(text, 30, 30);
    UI.setValue('canvas-label-text', '');
  }

  function resize() {
    if (!canvas) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, resize };
})();
