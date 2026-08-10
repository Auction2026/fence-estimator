import * as api from './api.js';
import { tabs } from './tabs/index.js';
import { calculateEstimate } from './calculations.js';
import { showMessage } from './utils.js';

const flashTarget = document.querySelector('#flash-message');
const state = {
  mode: 'loading',
  activeTab: 'project',
  projectId: null,
  project: null,
  tabs: {
    project: {
      name: 'Fence Depot Demo Project',
      customerName: 'Sample Customer',
      address: '100 Yard Line Road',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'A1A 1A1',
      status: 'draft'
    },
    estimate: {
      fenceType: 'chain-link',
      linearFeet: 120,
      heightFeet: 6,
      gates: 1,
      tearOutFeet: 0,
      labourRate: 78,
      overheadRate: 0.12,
      profitRate: 0.18
    }
  },
  estimate: calculateEstimate({ fenceType: 'chain-link', linearFeet: 120, heightFeet: 6, gates: 1, labourRate: 78 }),
  catalog: []
};

function renderNavigation() {
  const nav = document.querySelector('#tab-nav');
  nav.innerHTML = tabs.map(tab => `
    <button data-tab-button="${tab.id}" class="${state.activeTab === tab.id ? 'active' : ''}">
      ${tab.title}
      <span>${tab.id.replace(/-/g, ' ')}</span>
    </button>`).join('');

  nav.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.activeTab = button.dataset.tabButton;
      render();
    });
  });
}

function renderPanels() {
  const panels = document.querySelector('#tab-panels');
  panels.innerHTML = tabs.map(tab => `
    <section class="tab-panel ${state.activeTab === tab.id ? 'active' : ''}" id="panel-${tab.id}">${tab.render(state)}</section>
  `).join('');

  tabs.forEach(tab => {
    const panel = document.querySelector(`#panel-${tab.id}`);
    tab.bind?.({
      panel,
      state,
      projectId: state.projectId,
      api,
      onSave: saveTab,
      onCalculate: recalculate
    });
  });
}

async function saveTab(tabId, payload, rerender = false) {
  state.tabs[tabId] = { ...(state.tabs[tabId] || {}), ...payload };
  if (tabId === 'project') {
    document.querySelector('#project-ref').textContent = state.tabs.project.name || `Project #${state.projectId}`;
  }
  if (state.projectId) {
    await api.saveTab(state.projectId, tabId, state.tabs[tabId]);
  }
  showMessage(flashTarget, `${tabId} saved`, 'success');
  if (rerender) render();
}

async function recalculate(payload = state.tabs.estimate) {
  state.tabs.estimate = { ...(state.tabs.estimate || {}), ...payload };
  state.estimate = await api.calculateEstimate(state.tabs.estimate);
  render();
}

async function bootstrap() {
  const login = await api.loginDemo();
  state.mode = login.mode;
  document.querySelector('#app-mode').textContent = login.mode === 'api' ? 'Connected API' : 'Local fallback';
  state.catalog = await api.listCatalog();
  state.project = await api.createProject({
    ...state.tabs.project,
    linearFeet: Number(state.tabs.estimate.linearFeet || 0),
    fenceType: state.tabs.estimate.fenceType,
    notes: 'Auto-created starter project'
  });
  state.projectId = state.project.id;
  document.querySelector('#project-ref').textContent = state.project.name;
  await saveTab('project', state.tabs.project, false);
  await saveTab('estimate', state.tabs.estimate, false);
  render();
}

function render() {
  renderNavigation();
  renderPanels();
}

document.querySelector('#save-all').addEventListener('click', async () => {
  const activePayload = state.tabs[state.activeTab] || {};
  await saveTab(state.activeTab, activePayload, false);
});

document.querySelector('#recalculate').addEventListener('click', async () => {
  await recalculate(state.tabs.estimate);
});

bootstrap();
