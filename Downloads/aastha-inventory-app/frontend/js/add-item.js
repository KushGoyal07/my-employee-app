document.addEventListener('DOMContentLoaded', () => {
    // Password protection
    const ADMIN_PASSWORD = "admin123"; // Change this to your preferred password
    const passwordModal = document.getElementById('passwordModal');
    const addForm = document.getElementById('add-form');
    
    // Show password modal on page load
    passwordModal.style.display = 'block';
    addForm.style.display = 'none';

    // Password verification
    window.verifyPassword = function() {
        const password = document.getElementById('adminPassword').value;
        if (password === ADMIN_PASSWORD) {
            passwordModal.style.display = 'none';
            addForm.style.display = 'block';
            document.getElementById('passwordError').style.display = 'none';
        } else {
            document.getElementById('passwordError').style.display = 'block';
        }
    };

    // Add item function
    window.addItem = async function() {
        // Get form values
        const name = document.getElementById('item-name').value.trim();
        const quantity = parseInt(document.getElementById('item-qty').value);
        const price = parseFloat(document.getElementById('item-price').value);
        const image = document.getElementById('item-image').value.trim() || 'https://via.placeholder.com/60';

        // Validation
        if (!name || isNaN(quantity) || isNaN(price) || quantity < 0 || price <= 0) {
            alert('Please fill all fields with valid values:\n- Name cannot be empty\n- Quantity must be ≥ 0\n- Price must be > 0');
            return;
        }

        try {
            // Make API request
            const response = await fetch('http://localhost:5000/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ name, quantity, price, image })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add item');
            }

            // Success handling
            alert('Item added successfully!');
            
            // Clear form
            document.getElementById('item-name').value = '';
            document.getElementById('item-qty').value = '';
            document.getElementById('item-price').value = '';
            document.getElementById('item-image').value = '';

            // Optionally redirect to inventory
            // window.location.href = 'inventory.html';

        } catch (error) {
            console.error('Add item error:', error);
            alert('Error: ' + error.message);
        }
    };

    // Logout function
    window.logout = function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    };
});