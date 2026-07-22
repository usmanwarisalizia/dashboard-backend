const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  type: { type: String, enum: ['consultation', 'follow-up', 'emergency', 'checkup'], default: 'consultation' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  symptoms: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  prescription: { type: String, default: '' },
  notes: { type: String, default: '' },
  fee: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
