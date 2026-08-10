const mongoose = require('mongoose');

const ChangeOrderSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  description: { type: String, required: true },
  deltaAmount: { type: Number, required: true },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ChangeOrder', ChangeOrderSchema);
