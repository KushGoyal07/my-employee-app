import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CreateEmployee from './pages/CreateEmployee';
import EditEmployee from './pages/EditEmployee';
import Navbar from './components/Navbar';
import { Container, CssBaseline } from '@mui/material'; // Import components

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? <>{children}</> : <Navigate to="/login" />;
};

const MainLayout = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  return (
    <>
      {showNavbar && <Navbar />}
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* Use Container for layout */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/create-employee" element={<PrivateRoute><CreateEmployee /></PrivateRoute>} />
          <Route path="/edit-employee/:id" element={<PrivateRoute><EditEmployee /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
};

function App() {
  return (
    <Router>
      <CssBaseline /> {/* Add CssBaseline for consistent styling */}
      <MainLayout />
    </Router>
  );
}

export default App;