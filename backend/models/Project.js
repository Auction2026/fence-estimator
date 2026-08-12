const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, lowercase: true },
  status: { type: String, default: 'draft' },
  estimateTotal: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
