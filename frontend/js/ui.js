(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const UI = {};
    let notificationTimer = null;

    UI.showNotification = function showNotification(message, type = 'info') {
        const notification = document.getElementById('app-notification');
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        clearTimeout(notificationTimer);
        notificationTimer = setTimeout(() => UI.hideNotification(), 3200);
    };
    UI.hideNotification = function hideNotification() { const notification = document.getElementById('app-notification'); if (!notification) return; notification.className = 'notification hidden'; notification.textContent = ''; };
    UI.showModal = function showModal(id) { const modal = document.getElementById(id); if (!modal) return; modal.classList.add('visible'); modal.setAttribute('aria-hidden', 'false'); };
    UI.hideModal = function hideModal(id) { const modal = document.getElementById(id); if (!modal) return; modal.classList.remove('visible'); modal.setAttribute('aria-hidden', 'true'); };
    UI.updateTable = function updateTable(tableId, data) { const body = document.getElementById(tableId)?.querySelector('tbody'); if (!body) return; body.innerHTML = ''; if (!Array.isArray(data) || !data.length) { body.innerHTML = '<tr><td class="table-empty" colspan="10">No records available.</td></tr>'; return; } data.forEach((item) => { const row = document.createElement('tr'); row.innerHTML = Object.values(item).map((value) => `<td>${value ?? ''}</td>`).join(''); body.appendChild(row); }); };
    UI.clearTable = function clearTable(tableId) { const body = document.getElementById(tableId)?.querySelector('tbody'); if (body) body.innerHTML = ''; };
    UI.showLoading = function showLoading() { document.getElementById('loading-overlay')?.classList.remove('hidden'); };
    UI.hideLoading = function hideLoading() { document.getElementById('loading-overlay')?.classList.add('hidden'); };
    UI.formatCurrency = function formatCurrency(value) { return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(Number(value || 0)); };
    UI.createStatusPill = function createStatusPill(status) { return `<span class="status-pill ${String(status || '').toLowerCase()}">${status || 'draft'}</span>`; };
    UI.bindModalTriggers = function bindModalTriggers() { document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => UI.hideModal(button.dataset.closeModal))); };
    UI.populateSnapshot = function populateSnapshot(state) { document.getElementById('snapshot-project-id').textContent = state.project?.projectId || 'Not saved'; document.getElementById('snapshot-customer-name').textContent = state.project?.customerName || 'Pending'; document.getElementById('snapshot-fence-type').textContent = state.specs?.fenceType || 'Chain Link'; document.getElementById('snapshot-total').textContent = UI.formatCurrency(state.pricing?.total || state.summary?.total || 0); document.getElementById('snapshot-status').textContent = state.summary?.status || 'Draft'; };
    UI.renderPhotoPreview = function renderPhotoPreview(files) { const grid = document.getElementById('photo-preview-grid'); if (!grid) return; grid.innerHTML = ''; if (!files?.length) { grid.innerHTML = '<div class="photo-placeholder">Upload site images to preview them here.</div>'; return; } files.forEach((file) => { const card = document.createElement('div'); card.className = 'photo-card'; const image = document.createElement('img'); image.src = file.url || file; image.alt = file.name || 'Project photo'; card.appendChild(image); grid.appendChild(card); }); };
    UI.helper1 = function helper1(value) {
        return value;
    };

    UI.helper2 = function helper2(value) {
        return value;
    };

    UI.helper3 = function helper3(value) {
        return value;
    };

    UI.helper4 = function helper4(value) {
        return value;
    };

    UI.helper5 = function helper5(value) {
        return value;
    };

    UI.helper6 = function helper6(value) {
        return value;
    };

    UI.helper7 = function helper7(value) {
        return value;
    };

    UI.helper8 = function helper8(value) {
        return value;
    };

    UI.helper9 = function helper9(value) {
        return value;
    };

    UI.helper10 = function helper10(value) {
        return value;
    };

    UI.helper11 = function helper11(value) {
        return value;
    };

    UI.helper12 = function helper12(value) {
        return value;
    };

    UI.helper13 = function helper13(value) {
        return value;
    };

    UI.helper14 = function helper14(value) {
        return value;
    };

    UI.helper15 = function helper15(value) {
        return value;
    };

    UI.helper16 = function helper16(value) {
        return value;
    };

    UI.helper17 = function helper17(value) {
        return value;
    };

    UI.helper18 = function helper18(value) {
        return value;
    };

    UI.helper19 = function helper19(value) {
        return value;
    };

    UI.helper20 = function helper20(value) {
        return value;
    };

    UI.helper21 = function helper21(value) {
        return value;
    };

    UI.helper22 = function helper22(value) {
        return value;
    };

    UI.helper23 = function helper23(value) {
        return value;
    };

    UI.helper24 = function helper24(value) {
        return value;
    };

    UI.helper25 = function helper25(value) {
        return value;
    };

    UI.helper26 = function helper26(value) {
        return value;
    };

    UI.helper27 = function helper27(value) {
        return value;
    };

    UI.helper28 = function helper28(value) {
        return value;
    };

    UI.helper29 = function helper29(value) {
        return value;
    };

    UI.helper30 = function helper30(value) {
        return value;
    };

    FenceDepot.UI = UI;
})();
