(function bootstrapApp(global, doc) {
  const TABS = [
    ['tab1-project', 'Project'],
    ['tab2-specs', 'Specs'],
    ['tab3-layout', 'Layout'],
    ['tab4-installation', 'Installation'],
    ['tab5-drawings', 'Drawings'],
    ['tab6-permits', 'Permits'],
    ['tab7-utilities', 'Utilities'],
    ['tab8-estimate', 'Estimate'],
    ['tab9-contract', 'Contract'],
    ['tab10-extras', 'Extras'],
    ['tab11-crew', 'Crew'],
    ['tab12-changeorder', 'Change Orders'],
    ['tab13-signoff', 'Sign Off'],
    ['tab14-notes', 'Notes'],
    ['tab15-admin', 'Admin'],
    ['tab16-catalog', 'Catalog'],
    ['tab17-mapping', 'Mapping']
  ];

  function renderTab(tabId) {
    const container = doc.getElementById('tab-content');
    const renderer = global.FrontendTabs?.[tabId];
    if (typeof renderer === 'function') {
      renderer(container);
      return;
    }
    container.innerHTML = `<h2>${tabId}</h2><p>Module not available.</p>`;
  }

  function createTabs() {
    const tabsRoot = doc.getElementById('tabs');
    tabsRoot.innerHTML = '';

    TABS.forEach(([id, label], index) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.addEventListener('click', () => {
        tabsRoot.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
        button.setAttribute('aria-selected', 'true');
        renderTab(id);
      });
      tabsRoot.appendChild(button);
    });

    renderTab(TABS[0][0]);
  }

  doc.addEventListener('DOMContentLoaded', createTabs);
})(window, document);
