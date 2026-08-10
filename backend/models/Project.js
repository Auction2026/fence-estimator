const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
