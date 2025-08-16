import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
    const [formData, setFormData] = useState({ f_userName: '', f_Pwd: '' });
    const navigate = useNavigate();
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userName', res.data.userName);
            navigate('/dashboard');
        } catch (err) { alert(err.response.data.msg || 'An error occurred.'); }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }}/>
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Sign in
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="f_userName"
                        label="Username"
                        name="f_userName"
                        autoComplete="username"
                        autoFocus
                        value={formData.f_userName}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="f_Pwd"
                        label="Password"
                        type="password"
                        id="f_Pwd"
                        autoComplete="current-password"
                        value={formData.f_Pwd}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
export default Login;