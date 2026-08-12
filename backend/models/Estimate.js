const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  materials: { type: Number, default: 0 },
  labor: { type: Number, default: 0 },
  equipment: { type: Number, default: 0 },
  permits: { type: Number, default: 0 },
  extras: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Estimate', estimateSchema);
