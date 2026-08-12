(function attachDrawingTool(global) {
  const FE = global.FenceEstimator;
  FE.registerTool('drawing', {
    init() {
      const canvas = FE.utils.byId('layoutCanvas');
      if (!canvas) return;
      const context = canvas.getContext('2d');
      let drawing = false;
      const draw = (event) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches?.[0]?.clientX || 0) - rect.left;
        const y = (event.clientY || event.touches?.[0]?.clientY || 0) - rect.top;
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#0f766e';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
      };
      const start = (event) => {
        drawing = true;
        context.beginPath();
        draw(event);
      };
      const stop = () => {
        drawing = false;
        context.beginPath();
      };
      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stop);
      canvas.addEventListener('mouseleave', stop);
      canvas.addEventListener('touchstart', start, { passive: true });
      canvas.addEventListener('touchmove', draw, { passive: true });
      canvas.addEventListener('touchend', stop, { passive: true });
      FE.utils.byId('clearDrawingBtn').addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        FE.state.layout.drawingData = '';
        FE.persist('Layout cleared');
      });
      FE.utils.byId('saveDrawingBtn').addEventListener('click', () => {
        FE.state.layout.drawingData = canvas.toDataURL('image/png');
        FE.persist('Layout saved');
      });
      if (FE.state.layout.drawingData) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
        image.src = FE.state.layout.drawingData;
      }
    },
  });
})(window);
