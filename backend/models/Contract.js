const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  contractNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  total: { type: Number, required: true },
  signedAt: { type: Date },
  status: { type: String, default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
