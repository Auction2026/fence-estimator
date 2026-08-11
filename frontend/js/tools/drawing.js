
const DrawingTool = (() => {
  let ctx = null;
  let drawing = false;

  function init() {
    const canvas = document.getElementById('layout-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f4f82';
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('mousemove', draw);
  }

  function position(event) {
    const rect = event.target.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event) { drawing = true; const p = position(event); ctx?.beginPath(); ctx?.moveTo(p.x, p.y); }
  function stop() { drawing = false; ctx?.beginPath(); }
  function draw(event) {
    if (!drawing || !ctx) return;
    const p = position(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  function clear() {
    const canvas = document.getElementById('layout-canvas');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.addEventListener('DOMContentLoaded', init);
  return { init, clear };
})();
