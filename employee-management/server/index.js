require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Seeding Function to Create a Default Admin User ---
const seedAdminUser = async () => {
    try {
        // Check if any users exist
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found. Seeding default admin user...');
            // If no users exist, create a new one
            const defaultAdmin = new User({
                f_userName: 'admin',
                f_Pwd: 'admin123' // The password will be hashed automatically by the model
            });
            await defaultAdmin.save();
            console.log('Default admin user created successfully!');
        } else {
            console.log('Database already has users. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Call the seeding function after a successful connection
        seedAdminUser();
    })
    .catch(err => console.error(err));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));