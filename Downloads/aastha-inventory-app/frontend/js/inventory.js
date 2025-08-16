let items = [];
let editMode = false;
const ADMIN_PASSWORD = "admin123"; // Change this in production

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchItems();
});

// Fetch inventory items
async function fetchItems() {
  try {
    const response = await fetch('http://localhost:5000/api/inventory?_=' + Date.now(), {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch items');
    
    items = await response.json();
    renderItems();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load inventory. Please try again.');
  }
}

// Render items to DOM
function renderItems() {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = items.map((item, index) => `
    <div class="item-card" data-id="${item._id}">
      <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>Quantity: <span id="qty-${index}">${item.quantity}</span></p>
        <p>Price: ₹${item.price.toFixed(2)}</p>
        ${editMode ? `
          <div class="edit-controls">
            <input type="number" id="qtyChange-${index}" placeholder="Amount" min="1">
            <button onclick="changeQty('${item._id}', ${index}, 'add')">+</button>
            <button onclick="changeQty('${item._id}', ${index}, 'subtract')">−</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Toggle edit mode
function toggleEdit() {
  if (!editMode) {
    document.getElementById('passwordModal').style.display = 'block';
  } else {
    editMode = false;
    document.getElementById('toggleEdit').textContent = '🔒';
    renderItems();
  }
}

// Verify password
function verifyPassword() {
  const password = document.getElementById('adminPassword').value;
  if (password === ADMIN_PASSWORD) {
    editMode = true;
    document.getElementById('toggleEdit').textContent = '🔓';
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    renderItems();
  } else {
    document.getElementById('passwordError').style.display = 'block';
  }
}

// Change quantity
async function changeQty(id, index, operation) {
  const amountInput = document.getElementById(`qtyChange-${index}`);
  const amount = parseInt(amountInput.value);
  
  // Proper validation with complete error checking
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid positive number');
    amountInput.focus();
    return;
  }

  try {
    let newQty = items[index].quantity;
    newQty = operation === 'add' ? newQty + amount : newQty - amount;
    
    if (newQty < 0) {
      alert('Quantity cannot be negative');
      return;
    }

    const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({ quantity: newQty })
    });

    if (!response.ok) throw new Error(await response.text());
    
    items[index].quantity = newQty;
    renderItems();
  } catch (error) {
    console.error('Update failed:', error);
    alert(`Update failed: ${error.message}`);
  }
}
// Search functionality
function searchItem() {
  const term = document.getElementById('search').value.toLowerCase();
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(term)
  );
  
  document.getElementById('itemList').innerHTML = filtered.map((item, index) => `
    <div class="item-card">
      <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: ₹${item.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
// Add to your existing inventory.js
async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

    if (!response.ok) throw new Error('Delete failed');
    
    // Remove from local array and re-render
    items = items.filter(item => item._id !== id);
    renderItems();
    alert('Item deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete item');
  }
}

// Update renderItems() to include delete button
function renderItems() {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = items.map((item, index) => `
    <div class="item-card" data-id="${item._id}">
      <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>Quantity: <span id="qty-${index}">${item.quantity}</span></p>
        <p>Price: ₹${item.price.toFixed(2)}</p>
        ${editMode ? `
          <div class="edit-controls">
            <input type="number" id="qtyChange-${index}" placeholder="Amount" min="1">
            <button onclick="changeQty('${item._id}', ${index}, 'add')">+</button>
            <button onclick="changeQty('${item._id}', ${index}, 'subtract')">−</button>
            <button class="delete-btn" onclick="deleteItem('${item._id}')">🗑️ Delete</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}