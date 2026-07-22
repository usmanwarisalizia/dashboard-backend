const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  totalBeds: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  icon: { type: String, default: 'fa-hospital' }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
