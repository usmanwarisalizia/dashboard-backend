const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serverless MongoDB Connection Middleware (Yeh zaroori hai!)
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Timeout buffering band karne ke liye
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB Connected inside request');
    next();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/nurses', require('./routes/nurses'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/chat', require('./routes/chat'));

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(__dirname, 'public', 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).json({ message: 'API Server Running on Vercel 🚀' });
  }
});

// Local development ke liye app.listen (Vercel isay ignore karega)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`🏥 Hospital Management System running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;