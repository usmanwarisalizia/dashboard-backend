const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
  schedule: [
    {
      day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
      startTime: String,
      endTime: String,
      maxPatients: { type: Number, default: 20 }
    }
  ],
  consultationFee: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalPatients: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
