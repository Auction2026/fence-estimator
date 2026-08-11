
window.FenceDrawing = (() => {
  let initializedCanvasId = null;
  let activeCanvas = null;
  let activeContext = null;
  let points = [];

  function initialize(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || initializedCanvasId === canvasId) {
      return;
    }
    initializedCanvasId = canvasId;
    activeCanvas = canvas;
    points = window.FenceStorage?.getDrawing?.() || [];
    activeContext = canvas.getContext('2d');
    render(activeContext, activeCanvas);

    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const point = { x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top) };
      points.push(point);
      window.FenceStorage?.saveDrawing?.(points);
      render(activeContext, activeCanvas);
    });

    canvas.addEventListener('dblclick', () => {
      if (points.length > 2) {
        points.push({ ...points[0] });
        window.FenceStorage?.saveDrawing?.(points);
        render(activeContext, activeCanvas);
      }
    });

    document.getElementById('drawingClearBtn')?.addEventListener('click', clear);
    document.getElementById('drawingUndoBtn')?.addEventListener('click', undo);
    document.getElementById('drawingExportBtn')?.addEventListener('click', exportDrawing);
  }

  function render(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#1d4ed8';
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();

    points.forEach((point, index) => {
      context.fillStyle = '#0f766e';
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#183047';
      context.fillText(String(index + 1), point.x + 8, point.y - 8);
    });
  }

  function clear() {
    points = [];
    window.FenceStorage?.saveDrawing?.(points);
    if (activeContext && activeCanvas) {
      render(activeContext, activeCanvas);
    }
  }

  function undo() {
    points.pop();
    window.FenceStorage?.saveDrawing?.(points);
    if (activeContext && activeCanvas) {
      render(activeContext, activeCanvas);
    }
  }

  function exportDrawing() {
    const payload = JSON.stringify(points, null, 2);
    window.FenceExport?.downloadTextFile?.('layout-diagram.json', payload);
  }

  return {
    initialize,
    clear,
    undo,
    exportDrawing
  };
})();
