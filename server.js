const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── MongoDB Connection Caching (critical for Vercel serverless) ─────────────
// In serverless environments each invocation may reuse the same Node process.
// We cache the connection promise so we never open multiple connections.
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    bufferCommands: false,
  });
  console.log('✅ MongoDB Connected');
  return cachedConnection;
}

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    res.status(503).json({ message: 'Database connection failed. Please try again.' });
  }
});
// ─────────────────────────────────────────────────────────────────────────────

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

// Start local dev server
if (process.env.NODE_ENV !== 'production') {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🏥 Hospital Management System running on http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Failed to start server:', err.message);
      process.exit(1);
    });
}

module.exports = app;