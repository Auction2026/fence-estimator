// Estimate tab
'use strict';

const Tab8 = { init() { this.load(); }, load() { if (AppState.estimate) UI.renderEstimate(AppState.estimate); }, save() { Storage.saveEstimate(AppState.estimate || {}); return true; }, validate() { return true; } };
window.Tab8 = Tab8;
