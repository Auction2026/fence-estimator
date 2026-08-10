/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Drawing Tool – Layout Canvas (Tab 3)
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('layout-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  drawDefaultRectangle(ctx, canvas.width, canvas.height);
});

function drawDefaultRectangle(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#1a6b3a';
  ctx.lineWidth   = 3;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Labels
  ctx.fillStyle = '#555';
  ctx.font      = '12px Segoe UI';
  ctx.fillText('North', w / 2 - 18, 30);
  ctx.fillText('South', w / 2 - 18, h - 15);
  ctx.fillText('West',  5, h / 2);
  ctx.fillText('East',  w - 30, h / 2);

  // Fence posts indicator
  ctx.fillStyle = '#1a6b3a';
  const postSpacing = 30;
  for (let x = 40; x <= w - 40; x += postSpacing) {
    ctx.beginPath();
    ctx.arc(x, 40, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, h - 40, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 40; y <= h - 40; y += postSpacing) {
    ctx.beginPath();
    ctx.arc(40, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - 40, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
