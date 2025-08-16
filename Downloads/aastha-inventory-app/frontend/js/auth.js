// frontend/js/auth.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) throw new Error('Login failed');
    
    const { token } = await res.json();
    localStorage.setItem('token', token);
    window.location.href = 'inventory.html';
  } catch (err) {
    alert(err.message);
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
function logout() {
    // Clear any user session data
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
}