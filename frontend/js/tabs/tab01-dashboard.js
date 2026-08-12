/**
 * tab01-dashboard.js - Dashboard Tab
 * Fence Depot Estimator
 */

const DashboardTab = {
    init() {
        this.loadStats();
    },

    loadStats() {
        const estimates = Storage.loadEstimates();
        const thisMonth = estimates.filter(e => {
            const d = new Date(e.savedAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const el = id => document.getElementById(id);
        if (el('dashEstimatesCount')) el('dashEstimatesCount').textContent = estimates.length;
        if (el('dashMonthCount')) el('dashMonthCount').textContent = thisMonth.length;
    }
};
