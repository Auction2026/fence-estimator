/**
 * storage.js - Local Storage Utilities
 * Fence Depot Estimator
 */

const Storage = {
    // Save data to localStorage
    save(key, data) {
        try {
            localStorage.setItem('fde_' + key, JSON.stringify(data));
        } catch (e) {
            console.error('Storage save error:', e);
        }
    },

    // Load data from localStorage
    load(key) {
        try {
            const data = localStorage.getItem('fde_' + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },

    // Remove a key
    remove(key) {
        localStorage.removeItem('fde_' + key);
    },

    // Clear all app data
    clearAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('fde_'));
        keys.forEach(k => localStorage.removeItem(k));
    },

    // Save current estimate
    saveEstimate(estimate) {
        const estimates = this.load('estimates') || [];
        estimate.id = Date.now();
        estimate.savedAt = new Date().toISOString();
        estimates.unshift(estimate);
        this.save('estimates', estimates.slice(0, 50)); // Keep last 50
        return estimate.id;
    },

    // Load all saved estimates
    loadEstimates() {
        return this.load('estimates') || [];
    },

    // Load estimate by ID
    loadEstimateById(id) {
        const estimates = this.loadEstimates();
        return estimates.find(e => e.id === id) || null;
    },

    // Save settings
    saveSettings(settings) {
        this.save('settings', settings);
    },

    // Load settings
    loadSettings() {
        return this.load('settings') || {
            laborRate: 30,
            laborMarkup: 50,
            taxRate: 13,
            profitMargin: 35,
            units: 'imperial',
            currency: 'CAD'
        };
    },

    // Get next estimate number
    getNextEstimateNumber() {
        const year = new Date().getFullYear();
        const key = 'estimateSeq_' + year;
        const seq = (this.load(key) || 0) + 1;
        this.save(key, seq);
        return `${year}-${String(seq).padStart(4, '0')}`;
    }
};
