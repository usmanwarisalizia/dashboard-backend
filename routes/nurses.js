const express = require('express');
const router = express.Router();
const Nurse = require('../models/Nurse');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { department, status, shift, search } = req.query;
    let query = {};
    if (department) query.department = department;
    if (status) query.status = status;
    if (shift) query.shift = shift;
    if (search) query.name = { $regex: search, $options: 'i' };
    const nurses = await Nurse.find(query).sort({ createdAt: -1 });
    res.json(nurses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    res.json(nurse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const nurse = new Nurse(req.body);
    await nurse.save();
    res.status(201).json(nurse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const nurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    res.json(nurse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Nurse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nurse deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
