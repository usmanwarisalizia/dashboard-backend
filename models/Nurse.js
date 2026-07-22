const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
  shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
  schedule: [
    {
      day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
      startTime: String,
      endTime: String
    }
  ],
  assignedWard: { type: String, default: '' },
  salary: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Nurse', NurseSchema);
