let availableItems = [];
let selectedItems = [];

async function loadItems() {
  try {
    const res = await fetch('http://localhost:5000/api/inventory', {
      headers: { 'Authorization': localStorage.getItem('token') }
    });
    availableItems = await res.json();
  } catch (err) {
    console.error('Failed to load items:', err);
  }
}

function showSearchResults() {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = availableItems.map(item => `
    <div class="search-item" onclick="addToBill('${item._id}')">
      <img src="${item.image || 'https://via.placeholder.com/40'}" alt="${item.name}">
      <span>${item.name} (₹${item.price})</span>
    </div>
  `).join('');
  searchResults.style.display = 'block';
}

function searchBillItems() {
  const term = document.getElementById('billSearch').value.toLowerCase();
  const results = document.getElementById('searchResults');
  
  results.innerHTML = availableItems
    .filter(item => item.name.toLowerCase().includes(term))
    .map(item => `
      <div class="search-item" onclick="addToBill('${item._id}')">
        <img src="${item.image || 'https://via.placeholder.com/40'}" alt="${item.name}">
        <span>${item.name} (₹${item.price}, Stock: ${item.quantity})</span>
      </div>
    `).join('');
}

function addToBill(itemId) {
  const item = availableItems.find(i => i._id === itemId);
  if (!item) return;

  const existingItem = selectedItems.find(i => i.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedItems.push({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }

  renderBillItems();
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('billSearch').value = '';
}

function renderBillItems() {
  const container = document.getElementById('bill-items');
  container.innerHTML = selectedItems.map(item => `
    <div class="bill-item">
      <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
      <div class="bill-item-details">
        <h3>${item.name}</h3>
        <p>₹${item.price} × 
          <input type="number" value="${item.quantity}" min="1" 
                 onchange="updateQuantity('${item.id}', this.value)">
        </p>
      </div>
      <button class="remove-btn" onclick="removeItem('${item.id}')">×</button>
    </div>
  `).join('');
}

function updateQuantity(itemId, newQty) {
  const item = selectedItems.find(i => i.id === itemId);
  if (item) item.quantity = parseInt(newQty);
}

function removeItem(itemId) {
  selectedItems = selectedItems.filter(i => i.id !== itemId);
  renderBillItems();
}

// Initialize
loadItems();
async function generateBill() {
  if (selectedItems.length === 0) {
    alert("Please add items to generate a bill");
    return;
  }

  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  // Create bill HTML
  const billHTML = `
    <div class="bill-template">
      <header class="bill-header">
        <img src="asthalogo.jpg" alt="Astha Electronics" class="bill-logo">
        <div class="shop-info">
          <h1>Astha Electronics</h1>
          <p>0, 0, 0, BASTI ROAD, MANER PATNA, Patna, Bihar,801108 City</p>
          <p>GSTIN: 22AAAAA0000A1Z5</p>
        </div>
      </header>
      
      <div class="bill-details">
        <div class="bill-meta">
          <p><strong>Bill No:</strong> ${Math.floor(Math.random() * 1000)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <table class="bill-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${selectedItems.map(item => `
            <tr>
              <td>
                <div class="item-with-img">
                  <img src="${item.image || 'https://via.placeholder.com/40'}" alt="${item.name}">
                  ${item.name}
                </div>
              </td>
              <td>₹${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="bill-totals">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="totals-row">
          <span>GST (18%):</span>
          <span>₹${tax.toFixed(2)}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Total:</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
      </div>
      
      <footer class="bill-footer">
        <p>Thank you for your business!</p>
        <p>Terms: Goods once sold will not be taken back</p>
      </footer>
      
      <div class="bill-actions">
        <button onclick="printBill()">Print Bill</button>
        <button onclick="saveBill()">Save Bill</button>
      </div>
    </div>
  `;

  // Display bill
  document.getElementById('bill-result').innerHTML = billHTML;
  
  // Optional: Save to database
  try {
    await fetch('http://localhost:5000/api/billing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({
        items: selectedItems,
        subtotal,
        tax,
        total
      })
    });
  } catch (err) {
    console.error('Failed to save bill:', err);
  }
}

function printBill() {
  const printContent = document.querySelector('.bill-template').outerHTML;
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  renderBillItems(); // Restore the view
}

async function saveBill() {
  // Implement PDF generation or other save functionality
  alert('Bill saved to database!');
}

async function loadHistory() {
    try {
        // Get the billing history from your backend
        const response = await fetch('/api/bills/history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load history');
        
        const history = await response.json();
        displayHistory(history);
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('billing-history').innerHTML = 
            '<p class="error">Error loading history. Please try again.</p>';
    }
}

function displayHistory(history) {
    const historyContainer = document.getElementById('billing-history');
    historyContainer.innerHTML = '';

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No billing history found</p>';
        return;
    }

    historyContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Bill No.</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${history.map(bill => `
                    <tr>
                        <td>${bill.invoiceNumber}</td>
                        <td>${new Date(bill.date).toLocaleDateString()}</td>
                        <td>${bill.customerName || 'Walk-in'}</td>
                        <td>₹${bill.totalAmount.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}