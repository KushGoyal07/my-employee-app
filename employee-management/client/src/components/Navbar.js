import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Admin Panel
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/dashboard">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/employees">Employee List</Button>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2 }}>
                        Welcome, {userName}
                    </Typography>
                    <Button color="inherit" variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;