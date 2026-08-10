const mongoose = require('mongoose');

const FenceSpecsSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  fenceType: { type: String, required: true },
  heightFt: { type: Number, required: true, min: 1 },
  linearFeet: { type: Number, required: true, min: 1 },
  color: { type: String, default: 'galvanized' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('FenceSpecs', FenceSpecsSchema);
