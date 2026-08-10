window.FEDrawing = {
  init(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    canvas.addEventListener('mousedown', (event) => { drawing = true; ctx.beginPath(); ctx.moveTo(event.offsetX, event.offsetY); });
    canvas.addEventListener('mousemove', (event) => { if (!drawing) return; ctx.lineTo(event.offsetX, event.offsetY); ctx.stroke(); });
    canvas.addEventListener('mouseup', () => { drawing = false; });
  }
};
