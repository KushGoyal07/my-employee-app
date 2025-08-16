const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    f_Image: { type: String, required: true },
    f_Name: { type: String, required: true },
    f_Email: { type: String, required: true, unique: true },
    f_Mobile: { type: String, required: true },
    f_Designation: { type: String, enum: ['HR', 'Manager', 'Sales'], required: true },
    f_gender: { type: String, enum: ['M', 'F'], required: true },
    f_Course: { type: [String], enum: ['MCA', 'BCA', 'BSC'] },
    f_status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    f_Createdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('t_Employee', EmployeeSchema);
