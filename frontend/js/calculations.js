/**
 * calculations.js - Fence Material Calculation Engine
 * Fence Depot Estimator
 */

const Calculations = {
    // Labour rates per foot by fence type
    LABOR_RATES: {
        'chain-link': 8.50,
        'vinyl': 12.00,
        'wood': 10.00,
        'ornamental': 15.00,
        'farm': 6.00
    },

    // Posts per foot by fence type
    POSTS_PER_FOOT: {
        'chain-link': 1 / 10,  // 1 post per 10 feet
        'vinyl': 1 / 8,
        'wood': 1 / 8,
        'ornamental': 1 / 8,
        'farm': 1 / 10
    },

    /**
     * Calculate chain link materials
     */
    chainLink(footage, height, gaugeName) {
        const posts = Math.ceil(footage / 10) + 1;
        const rails = Math.ceil(footage / 21) * (height >= 6 ? 2 : 1);
        const meshRolls = Math.ceil(footage / 50);
        const tensionWire = Math.ceil(footage / 250);
        const tensionBars = Math.ceil(footage / 50) * 2;
        const braceBands = posts * 2;
        const caps = posts;
        const ties = Math.ceil(footage * 0.5);
        const gates = 0; // Added separately

        return {
            posts, rails, meshRolls, tensionWire,
            tensionBars, braceBands, caps, ties, gates
        };
    },

    /**
     * Calculate vinyl fence materials
     */
    vinyl(footage, height, style) {
        const panels = Math.ceil(footage / 8);
        const posts = panels + 1;
        const postCaps = posts;
        const rails = panels * (height >= 6 ? 3 : 2);
        const postSleeves = posts;

        return { panels, posts, postCaps, rails, postSleeves };
    },

    /**
     * Calculate wood fence materials
     */
    wood(footage, height, style) {
        const pickets = Math.ceil(footage * (style === 'privacy' ? 1.5 : 1));
        const posts = Math.ceil(footage / 8) + 1;
        const rails = Math.ceil(footage / 8) * (height >= 6 ? 3 : 2);
        const bags = Math.ceil(posts * 1.5); // Concrete bags
        const screws = Math.ceil(footage * 3); // Screws per foot

        return { pickets, posts, rails, bags, screws };
    },

    /**
     * Estimate labour cost
     */
    laborCost(footage, fenceType, settings) {
        const ratePerFoot = this.LABOR_RATES[fenceType] || 10;
        const base = footage * ratePerFoot;
        const markup = (settings?.laborMarkup || 50) / 100;
        return base * (1 + markup);
    },

    /**
     * Calculate total with tax
     */
    totalWithTax(subtotal, settings) {
        const tax = (settings?.taxRate || 13) / 100;
        return subtotal * (1 + tax);
    },

    /**
     * Calculate profit
     */
    profit(total, settings) {
        const margin = (settings?.profitMargin || 35) / 100;
        return total * margin;
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    }
};
