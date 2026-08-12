/**
 * ui.js - UI Helper Utilities
 * Fence Depot Estimator
 */

const UI = {
    /**
     * Show a toast notification
     */
    toast(message, type = 'info', duration = 3000) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: ${type === 'success' ? '#27AE60' : type === 'error' ? '#E74C3C' : '#1B2D4D'};
            color: white; padding: 14px 20px; border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex;
            align-items: center; gap: 10px; font-size: 14px; font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    },

    /**
     * Show loading overlay
     */
    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.querySelector('.loading-message').textContent = message;
            overlay.style.display = 'flex';
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'none';
    },

    /**
     * Animate a number counting up
     */
    animateNumber(element, target, prefix = '', suffix = '', duration = 1000) {
        const start = 0;
        const step = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.round(current).toLocaleString() + suffix;
        }, 16);
    },

    /**
     * Confirm dialog
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Format date
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric', month: 'long', day: 'numeric'
        }).format(new Date(date));
    },

    /**
     * Scroll to element
     */
    scrollTo(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
