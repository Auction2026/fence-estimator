const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  uom: { type: String, default: 'each' },
  unitCost: { type: Number, required: true, min: 0 },
  quantityOnHand: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
