import React from 'react';

function Dashboard() {
    const userName = localStorage.getItem('userName');
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Welcome to the Admin Panel, {userName || 'Guest'}!</h2>
        </div>
    );
}
export default Dashboard;
