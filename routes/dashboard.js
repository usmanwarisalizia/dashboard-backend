const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Nurse = require('../models/Nurse');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Department = require('../models/Department');

router.get('/stats', async (req, res) => {
  try {
    const [totalDoctors, totalNurses, totalPatients, totalAppointments,
      activeDoctors, admittedPatients, todayAppointments, departments] = await Promise.all([
      Doctor.countDocuments(),
      Nurse.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Doctor.countDocuments({ status: 'active' }),
      Patient.countDocuments({ status: 'admitted' }),
      Appointment.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      Department.countDocuments()
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 }).limit(5);

    const recentPatients = await Patient.find()
      .populate('assignedDoctor', 'name')
      .sort({ createdAt: -1 }).limit(5);

    res.json({
      totalDoctors, totalNurses, totalPatients, totalAppointments,
      activeDoctors, admittedPatients, todayAppointments, departments,
      recentAppointments, recentPatients
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
