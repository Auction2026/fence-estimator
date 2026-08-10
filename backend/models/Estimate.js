const mongoose = require('mongoose');

const EstimateSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  fenceSpecsId: { type: mongoose.Schema.Types.ObjectId, ref: 'FenceSpecs' },
  breakdown: { type: Object, default: {} },
  subtotal: { type: Number, default: 0 },
  overhead: { type: Number, default: 0 },
  margin: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Estimate', EstimateSchema);
