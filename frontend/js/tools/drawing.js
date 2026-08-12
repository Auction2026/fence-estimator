function startDrawingTool(canvasId = 'layoutCanvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  canvas.onmousedown = (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  };
  canvas.onmousemove = (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  };
  canvas.onmouseup = () => {
    drawing = false;
  };

  return { clear: () => ctx.clearRect(0, 0, canvas.width, canvas.height) };
}

window.drawingTool = { startDrawingTool };
