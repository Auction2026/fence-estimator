// UI utilities
'use strict';

const UI = {
  showTab(tabNum) { document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.toggle('active', Number(pane.dataset.tabPane) === Number(tabNum))); document.querySelectorAll('.tab-btn').forEach((button) => button.classList.toggle('active', Number(button.dataset.tab) === Number(tabNum))); },
  hideTab(tabNum) { const pane = document.querySelector(`.tab-pane[data-tab-pane="${tabNum}"]`); if (pane) pane.classList.remove('active'); },
  updateTable(tableId, data, columns) {
    const table = document.getElementById(tableId); if (!table) return; const tbody = table.querySelector('tbody'); if (!tbody) return; tbody.innerHTML = '';
    (data || []).forEach((row) => { const tr = document.createElement('tr'); columns.forEach((column) => { const td = document.createElement('td'); td.textContent = row[column] == null ? '' : row[column]; tr.appendChild(td); }); tbody.appendChild(tr); });
  },
  showModal(title, content) {
    const modal = document.getElementById('globalModal'); const modalTitle = document.getElementById('globalModalTitle'); const modalBody = document.getElementById('globalModalBody');
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.textContent = title || 'Details';
    modalBody.innerHTML = typeof content === 'string' ? content : '';
    if (content instanceof HTMLElement) { modalBody.innerHTML = ''; modalBody.appendChild(content); }
    modal.classList.add('is-visible');
  },
  hideModal() { const modal = document.getElementById('globalModal'); if (modal) modal.classList.remove('is-visible'); },
  showNotification(message, type = 'info', duration = 3200) {
    const container = document.getElementById('notificationContainer'); if (!container) return null; const toast = document.createElement('div'); toast.className = `toast toast-${type}`; toast.textContent = message; container.appendChild(toast); window.setTimeout(() => { toast.style.opacity = '0'; window.setTimeout(() => toast.remove(), 300); }, duration); return toast;
  },
  showLoading(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target; const host = element || document.body; const overlay = document.createElement('div'); overlay.className = 'loading-overlay'; overlay.innerHTML = '<div class="loading-spinner"></div>'; overlay.style.position = host === document.body ? 'fixed' : 'absolute'; overlay.style.inset = '0'; overlay.style.background = 'rgba(255,255,255,0.7)'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.dataset.loadingOverlay = 'true'; if (host !== document.body && getComputedStyle(host).position === 'static') host.style.position = 'relative'; host.appendChild(overlay);
  },
  hideLoading(target) { const element = typeof target === 'string' ? document.querySelector(target) : target; const host = element || document.body; host.querySelectorAll('[data-loading-overlay="true"]').forEach((overlay) => overlay.remove()); },
  renderEstimate(estimateData) {
    const estimate = estimateData || {}; const materialsBody = document.querySelector('#estimateMaterialsTable tbody'); const laborBody = document.querySelector('#estimateLaborTable tbody'); const equipmentBody = document.querySelector('#estimateEquipmentTable tbody');
    if (materialsBody) { materialsBody.innerHTML = ''; ((estimate.materials && estimate.materials.items) || []).forEach((item) => materialsBody.insertAdjacentHTML('beforeend', `<tr><td>${item.item}</td><td>${item.qty}</td><td>${formatCurrency(item.unitCost)}</td><td>${formatCurrency(item.total)}</td></tr>`)); }
    if (laborBody) { laborBody.innerHTML = ''; ((estimate.labor && estimate.labor.items) || []).forEach((item) => laborBody.insertAdjacentHTML('beforeend', `<tr><td>${item.item}</td><td>${item.hours}</td><td>${formatCurrency(item.rate)}</td><td>${formatCurrency(item.total)}</td></tr>`)); }
    if (equipmentBody) { equipmentBody.innerHTML = ''; const concrete = estimate.concrete ? [{ item: 'Concrete', qty: estimate.concrete.bags, unitCost: estimate.concrete.unitCost, total: estimate.concrete.total }] : []; (((estimate.equipment && estimate.equipment.items) || []).concat(concrete)).forEach((item) => equipmentBody.insertAdjacentHTML('beforeend', `<tr><td>${item.item}</td><td>${item.qty}</td><td>${formatCurrency(item.unitCost)}</td><td>${formatCurrency(item.total)}</td></tr>`)); }
    const totals = estimate.totals || estimate; const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = formatCurrency(value || 0); };
    setText('estimateSummaryMaterials', totals.materials || 0); setText('estimateSummaryLabor', totals.labor || 0); setText('estimateSummaryPermits', totals.permits || 0); setText('estimateSummaryTotal', totals.total || 0); setText('estimateContingency', totals.contingency || 0); setText('estimateSubtotal', totals.subtotal || 0); setText('estimateTax', totals.tax || 0); setText('estimateGrandTotal', totals.total || 0);
  },
  renderContract(contractData) {
    const contract = contractData || {}; const summary = document.getElementById('contractProjectSummary'); const scope = document.getElementById('contractScopeOfWork'); const price = document.getElementById('contractPrice'); const status = document.getElementById('contractStatusIndicator'); const badge = document.getElementById('priceLockedBadge');
    if (summary) summary.textContent = contract.projectSummary || 'Project summary pending.'; if (scope) scope.textContent = contract.scopeOfWork || 'Scope of work pending.'; if (price) price.textContent = formatCurrency(contract.total || 0); if (status) status.textContent = contract.status || 'Draft'; if (badge) badge.style.display = contract.locked ? 'inline-flex' : 'none';
  },
  updateStats(statsData) {
    const stats = statsData || {}; const mapping = { statProjects: stats.totalProjects, statRevenue: stats.revenueThisMonth, statPending: stats.pendingEstimates, statActive: stats.activeProjects };
    Object.keys(mapping).forEach((id) => { const node = document.getElementById(id); if (!node || mapping[id] == null) return; node.textContent = typeof mapping[id] === 'number' && id === 'statRevenue' ? formatCurrency(mapping[id]) : String(mapping[id]); });
  },
  confirmDialog(message) { return window.confirm(message); }
};
window.UI = UI;

UI[`renderList_1`] = function renderList_1(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_2`] = function renderList_2(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_3`] = function renderList_3(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_4`] = function renderList_4(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_5`] = function renderList_5(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_6`] = function renderList_6(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_7`] = function renderList_7(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_8`] = function renderList_8(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_9`] = function renderList_9(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_10`] = function renderList_10(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_11`] = function renderList_11(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_12`] = function renderList_12(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_13`] = function renderList_13(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_14`] = function renderList_14(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_15`] = function renderList_15(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_16`] = function renderList_16(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_17`] = function renderList_17(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_18`] = function renderList_18(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_19`] = function renderList_19(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_20`] = function renderList_20(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_21`] = function renderList_21(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_22`] = function renderList_22(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_23`] = function renderList_23(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_24`] = function renderList_24(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_25`] = function renderList_25(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_26`] = function renderList_26(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_27`] = function renderList_27(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_28`] = function renderList_28(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_29`] = function renderList_29(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_30`] = function renderList_30(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_31`] = function renderList_31(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_32`] = function renderList_32(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_33`] = function renderList_33(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_34`] = function renderList_34(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_35`] = function renderList_35(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_36`] = function renderList_36(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_37`] = function renderList_37(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_38`] = function renderList_38(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_39`] = function renderList_39(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_40`] = function renderList_40(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_41`] = function renderList_41(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_42`] = function renderList_42(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_43`] = function renderList_43(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_44`] = function renderList_44(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_45`] = function renderList_45(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_46`] = function renderList_46(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_47`] = function renderList_47(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_48`] = function renderList_48(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_49`] = function renderList_49(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_50`] = function renderList_50(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_51`] = function renderList_51(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_52`] = function renderList_52(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_53`] = function renderList_53(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_54`] = function renderList_54(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_55`] = function renderList_55(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_56`] = function renderList_56(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_57`] = function renderList_57(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_58`] = function renderList_58(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_59`] = function renderList_59(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_60`] = function renderList_60(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_61`] = function renderList_61(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_62`] = function renderList_62(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_63`] = function renderList_63(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_64`] = function renderList_64(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_65`] = function renderList_65(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_66`] = function renderList_66(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_67`] = function renderList_67(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_68`] = function renderList_68(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_69`] = function renderList_69(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_70`] = function renderList_70(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_71`] = function renderList_71(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_72`] = function renderList_72(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_73`] = function renderList_73(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_74`] = function renderList_74(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_75`] = function renderList_75(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_76`] = function renderList_76(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_77`] = function renderList_77(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_78`] = function renderList_78(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_79`] = function renderList_79(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_80`] = function renderList_80(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_81`] = function renderList_81(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_82`] = function renderList_82(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_83`] = function renderList_83(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_84`] = function renderList_84(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_85`] = function renderList_85(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_86`] = function renderList_86(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_87`] = function renderList_87(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_88`] = function renderList_88(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_89`] = function renderList_89(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_90`] = function renderList_90(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_91`] = function renderList_91(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_92`] = function renderList_92(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_93`] = function renderList_93(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_94`] = function renderList_94(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_95`] = function renderList_95(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_96`] = function renderList_96(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_97`] = function renderList_97(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_98`] = function renderList_98(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_99`] = function renderList_99(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_100`] = function renderList_100(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_101`] = function renderList_101(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-2 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_102`] = function renderList_102(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-3 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_103`] = function renderList_103(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-4 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_104`] = function renderList_104(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-5 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_105`] = function renderList_105(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-6 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_106`] = function renderList_106(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-7 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_107`] = function renderList_107(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-8 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_108`] = function renderList_108(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-9 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_109`] = function renderList_109(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-10 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_110`] = function renderList_110(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-11 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_111`] = function renderList_111(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-12 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_112`] = function renderList_112(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-13 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_113`] = function renderList_113(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-14 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_114`] = function renderList_114(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-15 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_115`] = function renderList_115(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-16 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_116`] = function renderList_116(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-17 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_117`] = function renderList_117(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-18 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_118`] = function renderList_118(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-19 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_119`] = function renderList_119(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-20 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };

UI[`renderList_120`] = function renderList_120(containerId, items) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = ''; (items || []).forEach((item) => { const div = document.createElement('div'); div.className = 'surface-variant-1 p-2 rounded-8'; div.textContent = item && item.label ? item.label : String(item); container.appendChild(div); }); };
