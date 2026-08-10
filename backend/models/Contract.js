const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  estimateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate', required: true },
  terms: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  priceLocked: { type: Boolean, default: true },
  signedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Contract', ContractSchema);
