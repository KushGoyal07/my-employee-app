require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aastha_inventory')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Auto-create admin
const User = require('./models/User');
async function createAdmin() {
  if (!await User.findOne({ username: 'admin' })) {
    const hashedPass = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashedPass });
    console.log('Admin user created');
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/billing', require('./routes/billing'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  createAdmin();
});