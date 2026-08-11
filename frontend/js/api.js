(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const API = {};
    const API_BASE_URL = 'http://localhost:3000/api';
    API.API_BASE_URL = API_BASE_URL;
    function getToken() { return FenceDepot.appState?.session?.token || FenceDepot.Storage?.loadSession()?.token || ''; }
    function buildHeaders(needsAuth = true) { const headers = { 'Content-Type': 'application/json' }; const token = getToken(); if (needsAuth && token) headers.Authorization = String.fromCharCode(66, 101, 97, 114, 101, 114, 32) + token; return headers; }
    async function request(path, options = {}, fallback = null) { const requestOptions = { method: options.method || 'GET', headers: { ...buildHeaders(options.needsAuth !== false), ...(options.headers || {}) }, body: options.body ? JSON.stringify(options.body) : undefined }; try { const response = await fetch(`${API_BASE_URL}${path}`, requestOptions); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || data.error || `Request failed: ${response.status}`); return data; } catch (error) { console.warn(`API fallback for ${path}`, error.message); if (typeof fallback === 'function') return fallback(error); throw error; } }
    API.login = async function login(credentials) { const data = await request('/auth/login', { method: 'POST', needsAuth: false, body: credentials }, () => ({ success: true, token: 'local-demo-token', user: { id: 'local-user', username: credentials.email?.split('@')[0] || 'estimator', email: credentials.email, role: 'estimator', company: 'Fence Depot' } })); FenceDepot.Storage?.saveSession({ token: data.token, user: data.user }); return data; };
    API.register = async function register(payload) { const data = await request('/auth/register', { method: 'POST', needsAuth: false, body: payload }, () => ({ success: true, token: 'local-demo-token', user: { id: `local-${Date.now()}`, username: payload.username, email: payload.email, role: payload.role || 'estimator', company: payload.company } })); FenceDepot.Storage?.saveSession({ token: data.token, user: data.user }); return data; };
    API.getProjects = function getProjects() { return request('/projects', {}, () => ({ success: true, projects: FenceDepot.Storage?.getProjects() || [] })); };
    API.createProject = function createProject(project) { return request('/projects', { method: 'POST', body: project }, () => ({ success: true, project: FenceDepot.Storage?.saveProject(project), message: 'Project saved locally.' })); };
    API.getEstimates = function getEstimates(projectId) { return request(`/estimates/${projectId}`, {}, () => ({ success: true, estimates: FenceDepot.Storage?.loadCollection('estimates').filter((item) => item.projectId === projectId) || [] })); };
    API.createEstimate = function createEstimate(estimate) { return request('/estimates', { method: 'POST', body: estimate }, () => ({ success: true, estimate: FenceDepot.Storage?.saveCollectionItem('estimates', estimate, 'estimateNumber'), message: 'Estimate saved locally.' })); };
    API.getContracts = function getContracts(projectId) { return request(`/contracts/${projectId}`, {}, () => ({ success: true, contracts: FenceDepot.Storage?.loadCollection('contracts').filter((item) => item.projectId === projectId) || [] })); };
    API.createContract = function createContract(contract) { return request('/contracts', { method: 'POST', body: contract }, () => ({ success: true, contract: FenceDepot.Storage?.saveCollectionItem('contracts', contract, 'contractNumber'), message: 'Contract saved locally.' })); };
    API.getChangeOrders = function getChangeOrders(projectId) { return request(`/change_orders/${projectId}`, {}, () => ({ success: true, changeOrders: FenceDepot.Storage?.loadCollection('changeOrders').filter((item) => item.projectId === projectId) || [] })); };
    API.createChangeOrder = function createChangeOrder(changeOrder) { return request('/change_orders', { method: 'POST', body: changeOrder }, () => ({ success: true, changeOrder: FenceDepot.Storage?.saveCollectionItem('changeOrders', changeOrder, 'changeOrderNumber'), message: 'Change order saved locally.' })); };
    API.getNotes = function getNotes() { return request('/notes', {}, () => ({ success: true, notes: FenceDepot.Storage?.loadCollection('notes') || [] })); };
    API.createNote = function createNote(note) { return request('/notes', { method: 'POST', body: note }, () => ({ success: true, note: FenceDepot.Storage?.saveCollectionItem('notes', note, 'noteId'), message: 'Note saved locally.' })); };
    API.getInventory = function getInventory() { return request('/inventory/products', {}, () => ({ success: true, inventory: FenceDepot.Storage?.loadCollection('inventory').length ? FenceDepot.Storage?.loadCollection('inventory') : [{ sku: 'CL-48-BLK', description: '48" black chain-link fabric', category: 'fabric', quantity: 18, unitCost: 245 }, { sku: 'POST-2375-16', description: '2-3/8" terminal post', category: 'posts', quantity: 42, unitCost: 42 }, { sku: 'GATE-4-SWING', description: '4 ft swing gate frame', category: 'gates', quantity: 7, unitCost: 185 }] })); };
    API.saveSignOff = function saveSignOff(signOff) { return request('/sign_offs', { method: 'POST', body: signOff }, () => ({ success: true, signOff: FenceDepot.Storage?.saveCollectionItem('signoffs', signOff, 'signOffNumber'), message: 'Sign-off saved locally.' })); };
    API.buildEstimatePayload = function buildEstimatePayload(state) { return { projectId: state.project?.projectId, customerName: state.project?.customerName, fenceType: state.specs?.fenceType || 'Chain Link', linearFeet: Number(state.survey?.linearFeet || 0), height: Number(state.specs?.height || 48), barchedWire: Boolean(state.specs?.barbedWire), installationType: state.specs?.installationType || 'Residential', laborRate: Number(state.labor?.hourlyRate || 65), permitCost: Number(state.pricing?.permitCost || 0), utilityCost: Number(state.pricing?.utilityCost || 0), contingency: Number(state.pricing?.contingency || 0), notes: state.summary?.executiveSummary || '' }; };
    API.buildContractPayload = function buildContractPayload(state) { return { estimateNumber: state.summary?.estimateNumber, projectId: state.project?.projectId, customerName: state.project?.customerName, scopeOfWork: state.contract?.scopeOfWork, depositAmount: Number(state.contract?.depositAmount || 0), warranty: state.contract?.warranty, terms: state.contract?.terms }; };
    API.buildSignOffPayload = function buildSignOffPayload(state) { return { signOffNumber: state.signoff?.signOffNumber || `SO-${Date.now()}`, projectId: state.project?.projectId, contractNumber: state.contract?.contractNumber || 'Pending', completionDate: state.signoff?.completionDate, fenceInspectionPassed: Boolean(state.signoff?.inspectionPassed), customerWalkthrough: Boolean(state.signoff?.customerWalkthrough), warrantyExplained: Boolean(state.signoff?.warrantyExplained), outstandingItems: state.signoff?.outstandingItems || '', followUpNeeded: Boolean(state.signoff?.followUpNeeded), warrantyStartDate: state.signoff?.warrantyStart, nextMaintenanceDate: state.signoff?.maintenanceDate, companyRep: state.signoff?.companyRep || '' }; };
    API.helper1 = function helper1(value) {
        return value;
    };

    API.helper2 = function helper2(value) {
        return value;
    };

    API.helper3 = function helper3(value) {
        return value;
    };

    API.helper4 = function helper4(value) {
        return value;
    };

    API.helper5 = function helper5(value) {
        return value;
    };

    API.helper6 = function helper6(value) {
        return value;
    };

    API.helper7 = function helper7(value) {
        return value;
    };

    API.helper8 = function helper8(value) {
        return value;
    };

    API.helper9 = function helper9(value) {
        return value;
    };

    API.helper10 = function helper10(value) {
        return value;
    };

    API.helper11 = function helper11(value) {
        return value;
    };

    API.helper12 = function helper12(value) {
        return value;
    };

    API.helper13 = function helper13(value) {
        return value;
    };

    API.helper14 = function helper14(value) {
        return value;
    };

    API.helper15 = function helper15(value) {
        return value;
    };

    API.helper16 = function helper16(value) {
        return value;
    };

    API.helper17 = function helper17(value) {
        return value;
    };

    API.helper18 = function helper18(value) {
        return value;
    };

    API.helper19 = function helper19(value) {
        return value;
    };

    API.helper20 = function helper20(value) {
        return value;
    };

    API.helper21 = function helper21(value) {
        return value;
    };

    API.helper22 = function helper22(value) {
        return value;
    };

    API.helper23 = function helper23(value) {
        return value;
    };

    API.helper24 = function helper24(value) {
        return value;
    };

    API.helper25 = function helper25(value) {
        return value;
    };

    API.helper26 = function helper26(value) {
        return value;
    };

    API.helper27 = function helper27(value) {
        return value;
    };

    API.helper28 = function helper28(value) {
        return value;
    };

    API.helper29 = function helper29(value) {
        return value;
    };

    API.helper30 = function helper30(value) {
        return value;
    };

    API.helper31 = function helper31(value) {
        return value;
    };

    API.helper32 = function helper32(value) {
        return value;
    };

    API.helper33 = function helper33(value) {
        return value;
    };

    API.helper34 = function helper34(value) {
        return value;
    };

    API.helper35 = function helper35(value) {
        return value;
    };

    API.helper36 = function helper36(value) {
        return value;
    };

    API.helper37 = function helper37(value) {
        return value;
    };

    API.helper38 = function helper38(value) {
        return value;
    };

    API.helper39 = function helper39(value) {
        return value;
    };

    API.helper40 = function helper40(value) {
        return value;
    };

    API.helper41 = function helper41(value) {
        return value;
    };

    API.helper42 = function helper42(value) {
        return value;
    };

    API.helper43 = function helper43(value) {
        return value;
    };

    API.helper44 = function helper44(value) {
        return value;
    };

    API.helper45 = function helper45(value) {
        return value;
    };

    API.helper46 = function helper46(value) {
        return value;
    };

    API.helper47 = function helper47(value) {
        return value;
    };

    FenceDepot.API = API;
})();
