const Employee = require('../models/Employee');
const fs = require('fs');

exports.createEmployee = (req, res) => {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
    if (!req.file) {
        return res.status(400).json({ msg: 'Please upload an image.' });
    }
    Employee.findOne({ f_Email: f_Email }).then(employee => {
        if (employee) {
            return res.status(400).json({ msg: 'Email already exists.' });
        }

        const newEmployee = new Employee({
            f_Image: req.file.path,
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course
        });

        newEmployee.save()
            .then(employee => res.status(201).json(employee))
            .catch(err => {
                console.error(err);
                res.status(500).send('Server Error');
            });
    });
};

exports.getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'f_Createdate';
        const sortOrder = req.query.sortOrder || 'desc';

        const searchQuery = {
            $or: [
                { f_Name: { $regex: search, $options: 'i' } },
                { f_Email: { $regex: search, $options: 'i' } },
            ],
        };

        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;
        const totalEmployees = await Employee.countDocuments(searchQuery);
        
        const employees = await Employee.find(searchQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        res.json({
            employees,
            currentPage: page,
            totalPages: Math.ceil(totalEmployees / limit),
            totalEmployees
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_status } = req.body;
        const updatedFields = { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_status };

        if (req.file) {
            const employee = await Employee.findById(req.params.id);
            if (employee && employee.f_Image) {
                fs.unlink(employee.f_Image, err => { if (err) console.error("Error deleting old image:", err) });
            }
            updatedFields.f_Image = req.file.path;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.json(updatedEmployee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        if (employee.f_Image) {
            fs.unlink(employee.f_Image, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }
        
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};