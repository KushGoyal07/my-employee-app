import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Paper, Box, Button, TextField, Typography, MenuItem, Radio, RadioGroup, 
    FormControlLabel, FormControl, FormLabel, Checkbox, FormGroup 
} from '@mui/material';

function EditEmployee() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        f_Name: '', f_Email: '', f_Mobile: '', f_Designation: 'HR',
        f_gender: '', f_Course: [], f_status: 'Active', f_Image: null
    });
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
                const empData = res.data;
                setFormData({
                    ...formData,
                    f_Name: empData.f_Name,
                    f_Email: empData.f_Email,
                    f_Mobile: empData.f_Mobile,
                    f_Designation: empData.f_Designation,
                    f_gender: empData.f_gender,
                    f_Course: empData.f_Course || [],
                    f_status: empData.f_status,
                });
                setCurrentImage(empData.f_Image);
            } catch (error) { console.error("Failed to fetch employee data", error); }
        };
        fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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
            if (key === 'f_Course') {
                formData[key].forEach(val => data.append(key, val));
            } else if (formData[key] !== null) { // Don't append null image
                data.append(key, formData[key]);
            }
        });

        try {
            await axios.put(`http://localhost:5000/api/employees/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Employee Updated Successfully');
            navigate('/employees');
        } catch (error) { alert(error.response?.data?.msg || 'Failed to update employee'); }
    };

    return (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Edit Employee Details</Typography>
            <TextField label="Full Name" name="f_Name" value={formData.f_Name} onChange={handleChange} required fullWidth />
            <TextField label="Email Address" type="email" name="f_Email" value={formData.f_Email} onChange={handleChange} required fullWidth />
            <TextField label="Mobile Number" type="tel" name="f_Mobile" value={formData.f_Mobile} onChange={handleChange} required fullWidth />
            <TextField select label="Designation" name="f_Designation" value={formData.f_Designation} onChange={handleChange} fullWidth>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
            </TextField>
            <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row name="f_gender" value={formData.f_gender} onChange={handleChange}>
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Courses</FormLabel>
                <FormGroup row>
                    <FormControlLabel control={<Checkbox checked={formData.f_Course.includes('MCA')} onChange={handleChange} name="f_Course" value="MCA" />} label="MCA" />
                    <FormControlLabel control={<Checkbox checked={formData.f_Course.includes('BCA')} onChange={handleChange} name="f_Course" value="BCA" />} label="BCA" />
                    <FormControlLabel control={<Checkbox checked={formData.f_Course.includes('BSC')} onChange={handleChange} name="f_Course" value="BSC" />} label="BSC" />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset">
                 <FormLabel component="legend">Status</FormLabel>
                 <RadioGroup row name="f_status" value={formData.f_status} onChange={handleChange}>
                    <FormControlLabel value="Active" control={<Radio />} label="Active" />
                    <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
            </FormControl>
            <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                <Button variant="contained" component="label">
                    Upload New Image
                    <input type="file" hidden name="f_Image" onChange={handleFileChange} accept=".png,.jpg,.jpeg" />
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Current: {currentImage.split(/[\\/]/).pop()}
                    {formData.f_Image && ` | New: ${formData.f_Image.name}`}
                </Typography>
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Employee
            </Button>
        </Paper>
    );
}
export default EditEmployee;