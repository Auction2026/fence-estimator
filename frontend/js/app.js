(function initApp() {
  FEAuth.load();
  const tabs = [Tab1, Tab2, Tab3, Tab4, Tab5, Tab6, Tab7, Tab8, Tab9, Tab10, Tab11, Tab12, Tab13, Tab14, Tab15, Tab16, Tab17];
  const nav = FEUtils.byId('tabs-nav');
  const root = FEUtils.byId('tabs-root');
  root.innerHTML = tabs.map((tab) => tab.render()).join('');

  function activate(id) {
    document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));
    FEUtils.byId(id).classList.add('active');
  }

  tabs.forEach((tab) => {
    const button = FEUtils.el('button', { class: 'tab-btn', type: 'button' }, `Tab ${tab.id.split('-')[1]}`);
    button.addEventListener('click', () => activate(tab.id));
    nav.appendChild(button);
  });

  activate('tab-1');
  const layoutCanvas = document.createElement('canvas');
  layoutCanvas.width = 600; layoutCanvas.height = 220;
  FEUtils.byId('tab-3').appendChild(layoutCanvas);
  FEDrawing.init(layoutCanvas);
  const mapDiv = FEUtils.el('div', { id: 'map-tab17' });
  FEUtils.byId('tab-17').appendChild(mapDiv);
  FEMapping.init('map-tab17');
})();
