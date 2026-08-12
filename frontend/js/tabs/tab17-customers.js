/**
 * tab17-customers.js - Customers Tab
 * Fence Depot Estimator
 */

const CustomersTab = {
    init() {
        console.log('customers tab initialized');
    },

    render() {
        const estimates = Storage.loadEstimates();
        const customers = {};
        estimates.forEach(e => {
            if (e.customer && e.customer.name) {
                customers[e.customer.name] = (customers[e.customer.name] || 0) + 1;
            }
        });
        return customers;
    }
};
