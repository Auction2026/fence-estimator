const mongoose = require('mongoose');

const SignOffSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  completedAt: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  signature: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SignOff', SignOffSchema);
