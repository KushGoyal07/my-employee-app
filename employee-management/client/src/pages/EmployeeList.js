import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Paper, Box, Button, TextField, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, TableSortLabel, Avatar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'f_Createdate', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);

    const fetchEmployees = useCallback(async () => {
        try {
            const params = { page: currentPage, limit: 5, search: query, sortBy: sortConfig.key, sortOrder: sortConfig.direction };
            const res = await axios.get('http://localhost:5000/api/employees', { params });
            setEmployees(res.data.employees);
            setTotalPages(res.data.totalPages);
            setTotalEmployees(res.data.totalEmployees);
        } catch (error) { console.error("Error fetching employees", error); }
    }, [currentPage, query, sortConfig]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:5000/api/employees/${id}`);
                fetchEmployees();
                alert('Employee deleted successfully');
            } catch (error) { alert('Failed to delete employee'); }
        }
    };

    const handleSearch = (e) => { e.preventDefault(); setQuery(searchTerm); setCurrentPage(1); };
    const handleSort = (key) => {
        const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Employee List ({totalEmployees})</Typography>
                <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/create-employee">
                    Create Employee
                </Button>
            </Box>
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                <TextField fullWidth label="Search by Name or Email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Box>
            
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell sortDirection={sortConfig.key === 'f_Name' ? sortConfig.direction : false}>
                                <TableSortLabel active={sortConfig.key === 'f_Name'} direction={sortConfig.direction} onClick={() => handleSort('f_Name')}>Name</TableSortLabel>
                            </TableCell>
                            <TableCell>Email & Mobile</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell sortDirection={sortConfig.key === 'f_Createdate' ? sortConfig.direction : false}>
                                <TableSortLabel active={sortConfig.key === 'f_Createdate'} direction={sortConfig.direction} onClick={() => handleSort('f_Createdate')}>Date Joined</TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map(emp => (
                            <TableRow key={emp._id}>
                                <TableCell><Avatar src={`http://localhost:5000/${emp.f_Image.replace(/\\/g, '/')}`} /></TableCell>
                                <TableCell>{emp.f_Name}</TableCell>
                                <TableCell>{emp.f_Email}<br/>{emp.f_Mobile}</TableCell>
                                <TableCell>{emp.f_Designation}</TableCell>
                                <TableCell>{emp.f_Course.join(', ')}</TableCell>
                                <TableCell>{new Date(emp.f_Createdate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton component={RouterLink} to={`/edit-employee/${emp._id}`} color="primary"><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(emp._id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                <Typography sx={{ mx: 2 }}>Page {currentPage} of {totalPages}</Typography>
                <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>Next</Button>
            </Box>
        </Paper>
    );
}
export default EmployeeList;