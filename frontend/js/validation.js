/**
 * validation.js - Form Validation Utilities
 * Fence Depot Estimator
 */

const Validation = {
    /**
     * Validate customer info fields
     */
    customerInfo(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Customer name must be at least 2 characters.');
        }

        if (!data.phone || !/^\+?[\d\s\-().]{7,15}$/.test(data.phone)) {
            errors.push('Please enter a valid phone number.');
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Please enter a valid email address.');
        }

        if (!data.address || data.address.trim().length < 5) {
            errors.push('Please enter a valid job site address.');
        }

        return errors;
    },

    /**
     * Validate fence dimensions
     */
    dimensions(data) {
        const errors = [];

        if (!data.footage || isNaN(data.footage) || data.footage <= 0) {
            errors.push('Linear footage must be a positive number.');
        }

        if (data.footage > 10000) {
            errors.push('Linear footage seems too large. Please verify.');
        }

        if (!data.height) {
            errors.push('Please select a fence height.');
        }

        if (!data.fenceType) {
            errors.push('Please select a fence type.');
        }

        return errors;
    },

    /**
     * Validate gate info
     */
    gates(data) {
        const errors = [];

        if (data.gates) {
            data.gates.forEach((gate, i) => {
                if (!gate.width || isNaN(gate.width) || gate.width <= 0) {
                    errors.push(`Gate ${i + 1}: Width must be a positive number.`);
                }
                if (gate.width > 40) {
                    errors.push(`Gate ${i + 1}: Width over 40ft requires special order.`);
                }
            });
        }

        return errors;
    },

    /**
     * Show errors in UI
     */
    showErrors(errors, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (errors.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.innerHTML = errors.map(e => `<div class="error-item">⚠️ ${e}</div>`).join('');
        container.style.display = 'block';
    },

    /**
     * Clear errors
     */
    clearErrors(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }
};
