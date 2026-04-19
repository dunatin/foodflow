// Initial Menu Items
const defaultMenuItems = [
    { id: 1, name: "Idly", price: 20, category: "food", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop" },
    { id: 2, name: "Dosa", price: 40, category: "food", image: "https://images.unsplash.com/photo-1613564834361-94cca5c8666c?w=400&h=300&fit=crop" },
    { id: 3, name: "Poori", price: 30, category: "food", image: "https://images.unsplash.com/photo-1626082919556-4feb7cbd6b2d?w=400&h=300&fit=crop" },
    { id: 4, name: "Burger", price: 35, category: "food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: 5, name: "Porotta", price: 25, category: "food", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop" },
    { id: 6, name: "Coffee", price: 15, category: "beverage", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop" },
    { id: 7, name: "Boost", price: 25, category: "beverage", image: "https://images.unsplash.com/photo-1571925350779-d7bb32794d32?w=400&h=300&fit=crop" },
    { id: 8, name: "Beef Curry", price: 120, category: "curry", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop" },
    { id: 9, name: "Veg Curry", price: 60, category: "curry", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
    { id: 10, name: "Chicken Curry", price: 100, category: "curry", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop" }
];

// Initialize
let menuItems = [];
let cart = [];
let editingItemId = null;
let orderCounter = 1;

// DOM Elements
const adminToggleBtn = document.getElementById('admin-toggle');
const customerView = document.getElementById('customer-view');
const adminView = document.getElementById('admin-view');
const menuGrid = document.getElementById('menu-grid');
const adminMenuGrid = document.getElementById('admin-menu-grid');
const menuForm = document.getElementById('menu-form');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const payNowBtn = document.getElementById('pay-now-btn');
const printBillBtn = document.getElementById('print-bill-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const qrModal = document.getElementById('qr-modal');
const qrCodeContainer = document.getElementById('qr-code-container');
const qrAmount = document.getElementById('qr-amount');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const closeModal = document.querySelector('.close');
const generateReportBtn = document.getElementById('generate-report-btn');
const exportReportBtn = document.getElementById('export-report-btn');
const salesReportContent = document.getElementById('sales-report-content');
const reportMonth = document.getElementById('report-month');

// Initialize Data
function init() {
    loadMenuItems();
    loadCart();
    renderMenu();
    renderAdminMenu();
    updateCartDisplay();
    setupEventListeners();
    
    // Set current month as default
    const now = new Date();
    reportMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Load Menu Items from localStorage
function loadMenuItems() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        menuItems = JSON.parse(stored);
    } else {
        menuItems = [...defaultMenuItems];
        saveMenuItems();
    }
}

// Save Menu Items to localStorage
function saveMenuItems() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Load Cart from localStorage
function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render Menu (Customer View)
function renderMenu() {
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${item.name}'">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price.toFixed(2)}</div>
        `;
        menuItem.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItem);
    });
}

// Render Admin Menu
function renderAdminMenu() {
    adminMenuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-menu-item';
        adminItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${item.name}'">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price.toFixed(2)}</div>
            <p><strong>Category:</strong> ${item.category}</p>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editItem(${item.id})">Edit</button>
                <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        adminMenuGrid.appendChild(adminItem);
    });
}

// Add to Cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.itemId === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            subtotal: item.price
        });
    }
    
    saveCart();
    updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        payNowBtn.disabled = true;
        printBillBtn.disabled = true;
        clearCartBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.subtotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
                <div style="font-weight: bold; margin-left: 1rem;">₹${item.subtotal.toFixed(2)}</div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        payNowBtn.disabled = false;
        printBillBtn.disabled = false;
        clearCartBtn.disabled = false;
    }
}

// Update Quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].subtotal = cart[index].quantity * cart[index].price;
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Clear Cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

// Calculate Total
function calculateTotal() {
    return cart.reduce((total, item) => total + item.subtotal, 0);
}

// Generate QR Code
function generateQRCode(amount, orderId) {
    qrCodeContainer.innerHTML = '';
    const paymentInfo = `UPI: restaurant@pay\nAmount: ₹${amount}\nOrder ID: ${orderId}`;
    
    QRCode.toCanvas(qrCodeContainer, paymentInfo, {
        width: 250,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) {
            console.error(error);
            qrCodeContainer.innerHTML = '<p>Error generating QR code</p>';
        }
    });
}

// Pay Now
function payNow() {
    const total = calculateTotal();
    const orderId = `ORD-${new Date().getFullYear()}-${String(orderCounter++).padStart(3, '0')}`;
    
    qrAmount.textContent = total.toFixed(2);
    generateQRCode(total.toFixed(2), orderId);
    qrModal.classList.add('active');
}

// Confirm Payment
function confirmPayment() {
    const total = calculateTotal();
    const orderId = `ORD-${new Date().getFullYear()}-${String(orderCounter++).padStart(3, '0')}`;
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        orderId: orderId,
        items: [...cart],
        total: total,
        date: new Date().toISOString(),
        status: 'paid'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Close modal
    qrModal.classList.remove('active');
    
    alert('Payment confirmed! Order ID: ' + orderId);
}

// Print Bill
function printBill() {
    const total = calculateTotal();
    const orderId = `ORD-${new Date().getFullYear()}-${String(orderCounter++).padStart(3, '0')}`;
    const now = new Date();
    
    document.getElementById('bill-date').textContent = now.toLocaleString();
    document.getElementById('bill-order-id').textContent = orderId;
    document.getElementById('bill-total').textContent = total.toFixed(2);
    
    const billItemsContainer = document.getElementById('bill-items');
    billItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const billItem = document.createElement('div');
        billItem.className = 'bill-item';
        billItem.innerHTML = `
            <div>
                <strong>${item.name}</strong> x ${item.quantity}
            </div>
            <div>₹${item.subtotal.toFixed(2)}</div>
        `;
        billItemsContainer.appendChild(billItem);
    });
    
    window.print();
}

// Menu Form Submit
menuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const image = document.getElementById('item-image').value || `https://via.placeholder.com/400x300?text=${name}`;
    
    if (editingItemId) {
        // Update existing item
        const item = menuItems.find(item => item.id === editingItemId);
        item.name = name;
        item.price = price;
        item.category = category;
        item.image = image;
        
        editingItemId = null;
        document.getElementById('form-title').textContent = 'Add New Menu Item';
        document.getElementById('submit-btn').textContent = 'Add Item';
        document.getElementById('cancel-btn').style.display = 'none';
    } else {
        // Add new item
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
        menuItems.push({
            id: newId,
            name: name,
            price: price,
            category: category,
            image: image
        });
    }
    
    saveMenuItems();
    renderMenu();
    renderAdminMenu();
    menuForm.reset();
    document.getElementById('item-id').value = '';
});

// Edit Item
function editItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;
    
    editingItemId = id;
    document.getElementById('item-id').value = id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-image').value = item.image;
    document.getElementById('form-title').textContent = 'Edit Menu Item';
    document.getElementById('submit-btn').textContent = 'Update Item';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(item => item.id !== id);
        saveMenuItems();
        renderMenu();
        renderAdminMenu();
    }
}

// Cancel Edit
document.getElementById('cancel-btn').addEventListener('click', () => {
    editingItemId = null;
    menuForm.reset();
    document.getElementById('item-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Menu Item';
    document.getElementById('submit-btn').textContent = 'Add Item';
    document.getElementById('cancel-btn').style.display = 'none';
});

// Generate Sales Report
function generateSalesReport() {
    const selectedMonth = reportMonth.value;
    if (!selectedMonth) {
        alert('Please select a month');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const [year, month] = selectedMonth.split('-');
    
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() == year && orderDate.getMonth() + 1 == month;
    });
    
    const totalSales = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = monthOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    let reportHTML = `
        <div class="report-stats">
            <div class="stat-card">
                <h3>₹${totalSales.toFixed(2)}</h3>
                <p>Total Sales</p>
            </div>
            <div class="stat-card">
                <h3>${totalOrders}</h3>
                <p>Total Orders</p>
            </div>
            <div class="stat-card">
                <h3>₹${avgOrderValue.toFixed(2)}</h3>
                <p>Average Order Value</p>
            </div>
        </div>
    `;
    
    if (monthOrders.length > 0) {
        reportHTML += `
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        monthOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const itemsSummary = order.items.map(item => `${item.name} (${item.quantity})`).join(', ');
            reportHTML += `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${orderDate.toLocaleDateString()}</td>
                    <td>${itemsSummary}</td>
                    <td>₹${order.total.toFixed(2)}</td>
                </tr>
            `;
        });
        
        reportHTML += `
                </tbody>
            </table>
        `;
    } else {
        reportHTML += '<p>No orders found for the selected month.</p>';
    }
    
    salesReportContent.innerHTML = reportHTML;
}

// Export Report as CSV
function exportReport() {
    const selectedMonth = reportMonth.value;
    if (!selectedMonth) {
        alert('Please select a month');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const [year, month] = selectedMonth.split('-');
    
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() == year && orderDate.getMonth() + 1 == month;
    });
    
    if (monthOrders.length === 0) {
        alert('No orders found for the selected month');
        return;
    }
    
    let csv = 'Order ID,Date,Items,Total\n';
    monthOrders.forEach(order => {
        const orderDate = new Date(order.date);
        const itemsSummary = order.items.map(item => `${item.name} (${item.quantity})`).join('; ');
        csv += `"${order.orderId}","${orderDate.toLocaleDateString()}","${itemsSummary}",${order.total.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Setup Event Listeners
function setupEventListeners() {
    adminToggleBtn.addEventListener('click', () => {
        if (customerView.classList.contains('active')) {
            customerView.classList.remove('active');
            adminView.classList.add('active');
            adminToggleBtn.textContent = 'Customer View';
        } else {
            adminView.classList.remove('active');
            customerView.classList.add('active');
            adminToggleBtn.textContent = 'Admin Panel';
        }
    });
    
    payNowBtn.addEventListener('click', payNow);
    printBillBtn.addEventListener('click', printBill);
    clearCartBtn.addEventListener('click', clearCart);
    confirmPaymentBtn.addEventListener('click', confirmPayment);
    
    closeModal.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.remove('active');
        }
    });
    
    generateReportBtn.addEventListener('click', generateSalesReport);
    exportReportBtn.addEventListener('click', exportReport);
}

// Initialize on load
init();
