(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const API_BASE_URL = 'http://localhost:3000/api';
    const tabOrder = ['project-info','site-survey','fence-specs','materials','labor','equipment','pricing','estimate-summary','contract','change-orders','sign-off','notes','photos','schedule','reports','inventory','map'];
    const tabModules = { 'project-info': () => FenceDepot.ProjectTab, 'site-survey': () => FenceDepot.SurveyTab, 'fence-specs': () => FenceDepot.SpecsTab, 'materials': () => FenceDepot.MaterialsTab, 'labor': () => FenceDepot.LaborTab, 'equipment': () => FenceDepot.EquipmentTab, 'pricing': () => FenceDepot.PricingTab, 'estimate-summary': () => FenceDepot.SummaryTab, 'contract': () => FenceDepot.ContractTab, 'change-orders': () => FenceDepot.ChangeOrdersTab, 'sign-off': () => FenceDepot.SignOffTab, 'notes': () => FenceDepot.NotesTab, 'photos': () => FenceDepot.PhotosTab, 'schedule': () => FenceDepot.ScheduleTab, 'reports': () => FenceDepot.ReportsTab, 'inventory': () => FenceDepot.InventoryTab, 'map': () => FenceDepot.MappingTab };
    const appState = FenceDepot.appState = { apiBaseUrl: API_BASE_URL, currentTab: 'project-info', session: FenceDepot.Storage?.loadSession() || { token: '', user: null }, project: {}, survey: {}, specs: { fenceType: 'Chain Link', height: 48 }, materials: {}, labor: {}, equipment: {}, pricing: { taxRate: 13 }, summary: {}, contract: {}, changeOrders: {}, signoff: {}, notes: {}, photos: {}, schedule: {}, reports: {}, inventory: {}, map: {} };
    function getTabIndex(tabId) { return Math.max(0, tabOrder.indexOf(tabId)); }
    function getModule(tabId) { return tabModules[tabId]?.(); }
    function updateProgress() { const index = getTabIndex(appState.currentTab); const button = document.querySelector(`[data-tab-target="${appState.currentTab}"]`); document.getElementById('tab-progress-label').textContent = button?.textContent || 'Estimator'; document.getElementById('tab-progress-fill').style.width = `${((index + 1) / tabOrder.length) * 100}%`; }
    function setActiveTab(tabId) { appState.currentTab = tabId; document.querySelectorAll('.tab-button').forEach((button) => button.classList.toggle('active', button.dataset.tabTarget === tabId)); document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.tabPanel === tabId)); updateProgress(); const module = getModule(tabId); if (module?.load) module.load(appState[module.stateKey]); }
    function saveCurrentTab() { const module = getModule(appState.currentTab); if (!module?.save) return; appState[module.stateKey] = { ...appState[module.stateKey], ...module.save() }; FenceDepot.Storage?.autoSave(appState); FenceDepot.UI?.populateSnapshot(appState); }
    function navigate(offset) { const next = Math.min(tabOrder.length - 1, Math.max(0, getTabIndex(appState.currentTab) + offset)); saveCurrentTab(); setActiveTab(tabOrder[next]); }
    function recalculateEstimate() { appState.materials = { ...appState.materials, ...FenceDepot.Calculations.calculateMaterials({ linearFeet: appState.survey.linearFeet || 0, height: appState.specs.height, numberGates: appState.specs.numberGates, privacySlats: appState.specs.privacySlats, wasteFactor: appState.materials.wasteFactor || 8 }) }; appState.labor = { ...appState.labor, ...FenceDepot.Calculations.calculateLabor({ linearFeet: appState.survey.linearFeet, height: appState.specs.height }, appState.labor) }; appState.equipment = { ...appState.equipment, ...FenceDepot.Calculations.calculateEquipment(appState.equipment) }; const parts = FenceDepot.Calculations.buildEstimateParts(appState); appState.pricing = { ...appState.pricing, ...parts }; appState.summary = { ...appState.summary, subtotal: parts.subtotal, tax: parts.tax, total: parts.total }; FenceDepot.MaterialsTab?.load(appState.materials); FenceDepot.LaborTab?.load(appState.labor); FenceDepot.EquipmentTab?.load(appState.equipment); FenceDepot.PricingTab?.load(appState.pricing); FenceDepot.SummaryTab?.load(appState.summary); FenceDepot.UI?.populateSnapshot(appState); }
    FenceDepot.recalculateEstimate = recalculateEstimate;
    async function handleLogin(event) { event.preventDefault(); const credentials = { email: document.getElementById('login-email').value.trim(), password: document.getElementById('login-password').value }; FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.login(credentials); appState.session = { token: response.token, user: response.user }; document.getElementById('current-user-name').textContent = response.user?.username || 'Estimator'; FenceDepot.UI.hideModal('login-modal'); FenceDepot.UI.showNotification('Login successful.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    async function handleRegister(event) { event.preventDefault(); const payload = { username: document.getElementById('register-username').value.trim(), email: document.getElementById('register-email').value.trim(), password: document.getElementById('register-password').value, company: document.getElementById('register-company').value.trim(), phone: document.getElementById('register-phone').value.trim(), role: document.getElementById('register-role').value }; FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.register(payload); appState.session = { token: response.token, user: response.user }; document.getElementById('current-user-name').textContent = response.user?.username || 'Estimator'; FenceDepot.UI.hideModal('login-modal'); FenceDepot.UI.showNotification('Account created successfully.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    async function saveProject() { saveCurrentTab(); const validation = FenceDepot.Validation.validateProject(appState.project); if (!validation.valid) { FenceDepot.UI.showNotification(validation.errors[0], 'error'); setActiveTab('project-info'); return; } FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.createProject(appState.project); appState.project = { ...appState.project, ...response.project }; document.getElementById('project-id').value = appState.project.projectId || ''; FenceDepot.Storage.saveProject(appState.project); FenceDepot.UI.populateSnapshot(appState); FenceDepot.UI.showNotification(response.message || 'Project saved.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    function loadDemoData() { appState.project = { customerName: 'Jordan McLean', customerEmail: 'jordan.mclean@example.com', customerPhone: '(403) 555-0138', address: '148 Ridge View Terrace', city: 'Calgary', province: 'AB', postalCode: 'T2V 8B1', propertySize: '7,200 sq ft', projectNotes: 'Rear yard chain-link replacement with one 4 ft swing gate.' }; appState.survey = { linearFeet: 214, terrainType: 'mixed', utilityStatus: 'requested' }; appState.specs = { fenceType: 'Chain Link', height: 72, numberGates: 1, gateType: 'Swing', privacySlats: 0 }; appState.labor = { crewSize: 3, hourlyRate: 65, foremanRate: 85, mobilizations: 1 }; appState.equipment = { augerDays: 2, trailerDays: 2, fuelSurcharge: 60 }; appState.pricing = { markup: 18, overhead: 8, discount: 0, taxRate: 13, permitCost: 150, contingency: 250 }; appState.contract = { depositAmount: 0, timeline: 'Install within 3 weeks of approval' }; recalculateEstimate(); Object.values(tabModules).forEach((resolver) => { const module = resolver(); if (module?.load) module.load(appState[module.stateKey]); }); FenceDepot.UI.showNotification('Demo data loaded.', 'success'); }
    async function createEstimate() { saveCurrentTab(); recalculateEstimate(); const payload = { ...FenceDepot.API.buildEstimatePayload(appState), estimateNumber: `EST-${Date.now()}` }; const validation = FenceDepot.Validation.validateEstimate(payload); if (!validation.valid) { FenceDepot.UI.showNotification(validation.errors[0], 'error'); return; } FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.createEstimate(payload); appState.summary.estimateNumber = response.estimate?.estimateNumber || payload.estimateNumber; appState.summary.status = response.estimate?.status || 'draft'; appState.summary.preparedDate = new Date().toISOString().slice(0, 10); FenceDepot.SummaryTab.load(appState.summary); FenceDepot.UI.showNotification(response.message || 'Estimate created.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    async function createContract() { saveCurrentTab(); FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.createContract({ ...FenceDepot.API.buildContractPayload(appState), contractNumber: appState.contract.contractNumber || `CON-${Date.now()}` }); appState.contract = { ...appState.contract, ...response.contract }; FenceDepot.ContractTab.load(appState.contract); FenceDepot.UI.showNotification(response.message || 'Contract created.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    async function createChangeOrder() { saveCurrentTab(); FenceDepot.UI.showLoading(); try { const response = await FenceDepot.API.createChangeOrder({ ...appState.changeOrders, projectId: appState.project.projectId, changeOrderNumber: appState.changeOrders.changeOrderNumber || `CO-${Date.now()}` }); FenceDepot.ChangeOrdersTab.load({ list: FenceDepot.Storage.loadCollection('changeOrders') }); FenceDepot.UI.showNotification(response.message || 'Change order created.', 'success'); } catch (error) { FenceDepot.UI.showNotification(error.message, 'error'); } finally { FenceDepot.UI.hideLoading(); } }
    async function createNote() { const note = FenceDepot.NotesTab.save(); const response = await FenceDepot.API.createNote(note); FenceDepot.UI.showNotification(response.message || 'Note saved.', 'success'); FenceDepot.NotesTab.load({ list: FenceDepot.Storage.loadCollection('notes') }); }
    async function refreshNotes() { const response = await FenceDepot.API.getNotes(); FenceDepot.NotesTab.load({ list: response.notes || [] }); }
    async function refreshInventory() { const response = await FenceDepot.API.getInventory(); FenceDepot.InventoryTab.load({ list: response.inventory || [] }); }
    async function saveSignOff() { saveCurrentTab(); const response = await FenceDepot.API.saveSignOff(FenceDepot.API.buildSignOffPayload(appState)); appState.signoff = { ...appState.signoff, ...response.signOff }; FenceDepot.SignOffTab.load(appState.signoff); FenceDepot.UI.showNotification(response.message || 'Sign-off saved.', 'success'); }
    FenceDepot.saveSignOff = saveSignOff;
    function bindEvents() {
        document.querySelectorAll('.tab-button').forEach((button) => button.addEventListener('click', () => { saveCurrentTab(); setActiveTab(button.dataset.tabTarget); }));
        document.getElementById('prev-tab-btn')?.addEventListener('click', () => navigate(-1));
        document.getElementById('next-tab-btn')?.addEventListener('click', () => navigate(1));
        document.getElementById('open-login-modal')?.addEventListener('click', () => FenceDepot.UI.showModal('login-modal'));
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('register-form')?.addEventListener('submit', handleRegister);
        document.getElementById('save-project-btn')?.addEventListener('click', saveProject);
        document.getElementById('load-demo-btn')?.addEventListener('click', loadDemoData);
        document.getElementById('create-estimate-btn')?.addEventListener('click', createEstimate);
        document.getElementById('create-contract-btn')?.addEventListener('click', createContract);
        document.getElementById('create-change-order-btn')?.addEventListener('click', createChangeOrder);
        document.getElementById('create-note-btn')?.addEventListener('click', createNote);
        document.getElementById('refresh-inventory-btn')?.addEventListener('click', refreshInventory);
        document.getElementById('print-estimate-btn')?.addEventListener('click', () => FenceDepot.PrintingTool.printEstimate(appState));
        document.getElementById('print-contract-btn')?.addEventListener('click', () => FenceDepot.PrintingTool.printContract(appState));
        document.getElementById('export-report-btn')?.addEventListener('click', () => FenceDepot.ExportTool.exportProjectBundle(appState));
        document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveProject(); } });
    }
    function restoreAutoSave() { const saved = FenceDepot.Storage.loadAutoSave(); if (!saved?.data) return; Object.assign(appState, saved.data); Object.values(tabModules).forEach((resolver) => { const module = resolver(); if (module?.load) module.load(appState[module.stateKey]); }); FenceDepot.UI.populateSnapshot(appState); }
    function initTabs() { Object.values(tabModules).forEach((resolver) => resolver()?.init?.()); }
    function helper1(value) {
        return value;
    }

    function helper2(value) {
        return value;
    }

    function helper3(value) {
        return value;
    }

    function helper4(value) {
        return value;
    }

    function helper5(value) {
        return value;
    }

    function helper6(value) {
        return value;
    }

    function helper7(value) {
        return value;
    }

    function helper8(value) {
        return value;
    }

    function helper9(value) {
        return value;
    }

    function helper10(value) {
        return value;
    }

    function helper11(value) {
        return value;
    }

    function helper12(value) {
        return value;
    }

    function helper13(value) {
        return value;
    }

    function helper14(value) {
        return value;
    }

    function helper15(value) {
        return value;
    }

    function helper16(value) {
        return value;
    }

    function helper17(value) {
        return value;
    }

    function helper18(value) {
        return value;
    }

    function helper19(value) {
        return value;
    }

    function helper20(value) {
        return value;
    }

    function helper21(value) {
        return value;
    }

    function helper22(value) {
        return value;
    }

    function helper23(value) {
        return value;
    }

    function helper24(value) {
        return value;
    }

    function helper25(value) {
        return value;
    }

    function helper26(value) {
        return value;
    }

    function helper27(value) {
        return value;
    }

    function helper28(value) {
        return value;
    }

    function helper29(value) {
        return value;
    }

    function helper30(value) {
        return value;
    }

    function helper31(value) {
        return value;
    }

    function helper32(value) {
        return value;
    }

    function helper33(value) {
        return value;
    }

    function helper34(value) {
        return value;
    }

    function helper35(value) {
        return value;
    }

    function helper36(value) {
        return value;
    }

    function helper37(value) {
        return value;
    }

    function helper38(value) {
        return value;
    }

    function helper39(value) {
        return value;
    }

    function helper40(value) {
        return value;
    }

    FenceDepot.helpers = FenceDepot.helpers || {};
    FenceDepot.helpers.app = { updateProgress, setActiveTab, saveCurrentTab, navigate, recalculateEstimate };
    document.addEventListener('DOMContentLoaded', async () => {
        FenceDepot.UI.bindModalTriggers();
        FenceDepot.Validation.attachLiveValidation();
        initTabs();
        bindEvents();
        restoreAutoSave();
        FenceDepot.DrawingTool?.init();
        FenceDepot.MappingTool?.init();
        setActiveTab(appState.currentTab);
        if (appState.session?.user) { document.getElementById('current-user-name').textContent = appState.session.user.username || 'Estimator'; FenceDepot.UI.hideModal('login-modal'); }
        await refreshNotes();
        await refreshInventory();
        FenceDepot.UI.hideLoading();
    });
})();
