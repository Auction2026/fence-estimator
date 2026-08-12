/**
 * controllers/projectController.js - Project/Estimate Controller
 * Fence Depot Estimator Backend
 */

const getModels = () => {
    const server = require('../server');
    return {
        Estimate: server.Estimate,
        Customer: server.Customer,
        InventoryItem: server.InventoryItem
    };
};

const projectController = {
    // ========== ESTIMATES ==========

    async listEstimates(req, res) {
        try {
            const { Estimate } = getModels();
            const estimates = await Estimate.find()
                .populate('customerId', 'name phone email')
                .sort({ createdAt: -1 })
                .limit(100);
            res.json(estimates);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getEstimate(req, res) {
        try {
            const { Estimate } = getModels();
            const estimate = await Estimate.findById(req.params.id)
                .populate('customerId');
            if (!estimate) return res.status(404).json({ error: 'Estimate not found.' });
            res.json(estimate);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createEstimate(req, res) {
        try {
            const { Estimate } = getModels();
            const estimate = new Estimate({
                ...req.body,
                createdBy: req.userId
            });
            await estimate.save();
            res.status(201).json(estimate);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async updateEstimate(req, res) {
        try {
            const { Estimate } = getModels();
            const estimate = await Estimate.findByIdAndUpdate(
                req.params.id,
                { ...req.body, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
            if (!estimate) return res.status(404).json({ error: 'Estimate not found.' });
            res.json(estimate);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteEstimate(req, res) {
        try {
            const { Estimate } = getModels();
            const estimate = await Estimate.findByIdAndDelete(req.params.id);
            if (!estimate) return res.status(404).json({ error: 'Estimate not found.' });
            res.json({ message: 'Estimate deleted.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // ========== CUSTOMERS ==========

    async listCustomers(req, res) {
        try {
            const { Customer } = getModels();
            const customers = await Customer.find().sort({ name: 1 }).limit(200);
            res.json(customers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getCustomer(req, res) {
        try {
            const { Customer } = getModels();
            const customer = await Customer.findById(req.params.id);
            if (!customer) return res.status(404).json({ error: 'Customer not found.' });
            res.json(customer);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createCustomer(req, res) {
        try {
            const { Customer } = getModels();
            const customer = new Customer(req.body);
            await customer.save();
            res.status(201).json(customer);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async updateCustomer(req, res) {
        try {
            const { Customer } = getModels();
            const customer = await Customer.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!customer) return res.status(404).json({ error: 'Customer not found.' });
            res.json(customer);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // ========== INVENTORY ==========

    async listInventory(req, res) {
        try {
            const { InventoryItem } = getModels();
            const items = await InventoryItem.find({ isActive: true }).sort({ plu: 1 });
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getInventoryItem(req, res) {
        try {
            const { InventoryItem } = getModels();
            const item = await InventoryItem.findOne({ plu: req.params.plu });
            if (!item) return res.status(404).json({ error: 'Item not found.' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = projectController;
