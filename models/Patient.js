const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  bloodGroup: { type: String, default: '' },
  address: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  medicalHistory: [{ condition: String, date: Date, notes: String }],
  status: { type: String, enum: ['active', 'admitted', 'discharged', 'critical'], default: 'active' },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  ward: { type: String, default: '' },
  admissionDate: { type: Date },
  dischargeDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
