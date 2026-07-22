require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Admin.deleteOne({ email: 'admin@hospital.com' });
  await Admin.create({ name: 'Admin', email: 'admin@hospital.com', password: 'admin123', role: 'admin' });
  console.log('✅ Admin reset: admin@hospital.com / admin123');
  await mongoose.disconnect();
}

seed().catch(console.error);
