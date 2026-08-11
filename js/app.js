import { loadState, saveState } from './storage.js';
import { renderTabNav, renderTabContent } from './ui.js';
import { calculateMaterialEstimate } from './calculations.js';
import { validateProject } from './validation.js';
import { api } from './api.js';
import { exportJson } from './tools/export.js';
import { tab1 } from './tabs/tab1-project.js';
import { tab2 } from './tabs/tab2-customer.js';
import { tab3 } from './tabs/tab3-site-survey.js';
import { tab4 } from './tabs/tab4-layout.js';
import { tab5 } from './tabs/tab5-fence-configuration.js';
import { tab6 } from './tabs/tab6-materials.js';
import { tab7 } from './tabs/tab7-labor.js';
import { tab8 } from './tabs/tab8-equipment.js';
import { tab9 } from './tabs/tab9-permits.js';
import { tab10 } from './tabs/tab10-subcontractors.js';
import { tab11 } from './tabs/tab11-logistics.js';
import { tab12 } from './tabs/tab12-safety.js';
import { tab13 } from './tabs/tab13-change-orders.js';
import { tab14 } from './tabs/tab14-pricing.js';
import { tab15 } from './tabs/tab15-review.js';
import { tab16 } from './tabs/tab16-approval.js';
import { tab17 } from './tabs/tab17-mapping.js';

const tabs = [
  tab1,
  tab2,
  tab3,
  tab4,
  tab5,
  tab6,
  tab7,
  tab8,
  tab9,
  tab10,
  tab11,
  tab12,
  tab13,
  tab14,
  tab15,
  tab16,
  tab17
];

const state = loadState();
let activeTabId = state.activeTabId || tabs[0].id;

const navEl = document.querySelector('#tab-nav');
const contentEl = document.querySelector('#tab-content');

const context = {
  state,
  calculateMaterialEstimate,
  validateProject,
  api,
  exportJson
};

function setActiveTab(tabId) {
  activeTabId = tabId;
  state.activeTabId = tabId;
  saveState(state);
  draw();
}

function draw() {
  renderTabNav(navEl, tabs, activeTabId, setActiveTab);
  const tab = tabs.find((item) => item.id === activeTabId) || tabs[0];
  renderTabContent(contentEl, tab, context);
}

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!target.name) return;
  state[target.name] = target.value;
  saveState(state);
});

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 's') {
    event.preventDefault();
    exportJson('fence-estimator-save.json', state);
  }
});

draw();
