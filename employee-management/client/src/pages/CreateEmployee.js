import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Button, TextField, Typography, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, FormGroup } from '@mui/material';

function CreateEmployee() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        f_Name: '', f_Email: '', f_Mobile: '', f_Designation: 'HR',
        f_gender: '', f_Course: [], f_Image: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(p => ({ ...p, f_Course: checked ? [...p.f_Course, value] : p.f_Course.filter(c => c !== value) }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => setFormData({ ...formData, f_Image: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'f_Course') formData[key].forEach(val => data.append(key, val));
            else data.append(key, formData[key]);
        });
        try {
            await axios.post('http://localhost:5000/api/employees', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Employee Created Successfully');
            navigate('/employees');
        } catch (error) { alert(error.response.data.msg || 'Failed to create employee'); }
    };

    return (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Create New Employee</Typography>
            <TextField label="Full Name" name="f_Name" onChange={handleChange} required fullWidth />
            <TextField label="Email Address" type="email" name="f_Email" onChange={handleChange} required fullWidth />
            <TextField label="Mobile Number" type="tel" name="f_Mobile" onChange={handleChange} required fullWidth />
            <TextField select label="Designation" name="f_Designation" value={formData.f_Designation} onChange={handleChange} fullWidth>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
            </TextField>
            <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row name="f_gender" onChange={handleChange}>
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Courses</FormLabel>
                <FormGroup row>
                    <FormControlLabel control={<Checkbox onChange={handleChange} name="f_Course" value="MCA" />} label="MCA" />
                    <FormControlLabel control={<Checkbox onChange={handleChange} name="f_Course" value="BCA" />} label="BCA" />
                    <FormControlLabel control={<Checkbox onChange={handleChange} name="f_Course" value="BSC" />} label="BSC" />
                </FormGroup>
            </FormControl>
            <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden name="f_Image" onChange={handleFileChange} required accept=".png,.jpg,.jpeg" />
            </Button>
            {formData.f_Image && <Typography variant="body2">{formData.f_Image.name}</Typography>}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Paper>
    );
}
export default CreateEmployee;