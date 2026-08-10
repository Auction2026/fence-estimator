import { createFormTab } from './tab-factory.js';

const base = createFormTab({
  id: 'layout',
  title: '3. Layout',
  description: 'Sketch fence lines, gate swings, elevations, and site obstacles.',
  fields: [
    { name: 'layoutScale', label: 'Scale', defaultValue: '1:100' },
    { name: 'northArrow', label: 'North Arrow Direction', defaultValue: 'North' },
    { name: 'layoutNotes', label: 'Layout Notes', type: 'textarea' }
  ]
});

export default {
  ...base,
  render(state) {
    return `${base.render(state)}
      <section class="card canvas-wrapper">
        <h3>Drawing Board</h3>
        <p class="helper">Use the canvas below for a simple site sketch. The current version keeps the drawing in-browser for review sessions.</p>
        <canvas id="layout-canvas" width="1100" height="360"></canvas>
        <div class="inline-actions">
          <button type="button" class="secondary-btn" id="clear-layout">Clear Drawing</button>
        </div>
      </section>`;
  },
  bind(context) {
    base.bind(context);
    const canvas = context.panel.querySelector('#layout-canvas');
    const clearButton = context.panel.querySelector('#clear-layout');
    if (!canvas || !clearButton) return;
    const canvasContext = canvas.getContext('2d');
    canvasContext.lineWidth = 2;
    canvasContext.lineCap = 'round';
    let drawing = false;
    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    };
    canvas.addEventListener('pointerdown', event => {
      drawing = true;
      const p = point(event);
      canvasContext.beginPath();
      canvasContext.moveTo(p.x, p.y);
    });
    canvas.addEventListener('pointermove', event => {
      if (!drawing) return;
      const p = point(event);
      canvasContext.lineTo(p.x, p.y);
      canvasContext.stroke();
    });
    window.addEventListener('pointerup', () => {
      drawing = false;
    });
    clearButton.addEventListener('click', () => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
};
