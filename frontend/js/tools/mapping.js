function renderMappingSummary(targetId = 'mapContainer', coords = []) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = '';
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify({ points: coords, total: coords.length }, null, 2);
  target.appendChild(pre);
}

window.mappingTool = { renderMappingSummary };
