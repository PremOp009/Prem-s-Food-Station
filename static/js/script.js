
/* =========================================
   1. GLOBAL LOGIC (Runs everywhere) 🌍
========================================= */

// --- CART STATE MANAGEMENT ---
// Load cart from LocalStorage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// --- TOGGLE CART FUNCTION ---
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');

    // Debugging Check
    if (!sidebar) {
        alert("ERROR: The Cart Sidebar HTML is missing! Make sure <div id='cart-sidebar'> is in your HTML file.");
        return;
    }

    // Toggle the class
    sidebar.classList.toggle('open');

    // Refresh the items inside
    renderCart();
}
// 2. Add to Cart Function
function addToCart(title, price, img) {
    // Add item to array
    cart.push({ title, price, img });

    // Save to LocalStorage (Persistence!)
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update Badge
    updateCartCount();

    // Optional: Auto-open cart to show user
    toggleCart();
}

// 3. Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 4. Update Badge Count
function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = cart.length;
}

// 5. Render Cart Items (The Loop)
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    // Clear current HTML
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-msg">Your cart is empty. 😢</p>';
        totalSpan.innerText = '₹0';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        // Parse price (remove '₹' and convert to number)
        const priceNum = parseInt(item.price.replace('₹', ''));
        total += priceNum;

        // Add HTML for item
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <span>${item.price}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
            </div>
        `;
    });

    totalSpan.innerText = '₹' + total;
}

// 6. Checkout Placeholder
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
    } else {
        alert(`Order placed! Total: ₹${document.getElementById('cart-total').innerText.replace('₹', '')}`);
        cart = []; // Clear cart
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
        toggleCart();
    }
}

// Initialize Count on Load
updateCartCount();

// --- EXISTING NAVBAR & MOBILE MENU CODE ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });
}

// Navbar Scroll
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 6px 30px rgba(0,0,0,0.15)";
    } else {
        navbar.style.boxShadow = "0 6px 25px rgba(0,0,0,0.08)";
    }
});


/* =========================================
   2. HOME PAGE SPECIFIC 🏠
========================================= */
const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) {
    // Dynamic Greeting
    const heroText = document.querySelector('.hero-content p');
    const hour = new Date().getHours();
    let greeting = "Craving something fire? We got you. 🔥";

    if (hour < 12) greeting = "Good Morning! Start with flavor! ☕";
    else if (hour < 18) greeting = "Good Afternoon! Power lunch time! 🍔";
    else greeting = "Good Evening! Treat yourself tonight! 🍕";

    heroText.textContent = greeting;

    exploreBtn.addEventListener("click", () => {
        window.location.href = "menu.html";
    });
}


/* =========================================
   3. MENU PAGE SPECIFIC 🍔
========================================= */
const menuGrid = document.getElementById('menu-grid');

if (menuGrid) {
    // --- DATABASE ---
    const menuData = [
        { title: "Thepla", desc: "Power of Travelling", price: "₹119", img: "https://rakskitchen.net/wp-content/uploads/2009/05/methi-thepla.jpg" },
        { title: "Vada", desc: "Prem's Sprecial Vada", price: "₹75", img: "https://www.recipeingujarati.com/wp-content/uploads/2022/08/bajri-na-lot-na-vada-recipe-in-gujarati-.jpg" },
        {title: "Muthiya", desc: "Crushing Baked.", price: "₹175", img: "https://www.spiceupthecurry.com/wp-content/uploads/2012/05/muthia-recipe-1.jpg" },
        { title: "Bhaji Pav", desc: "Tasty and spicy", price: "₹189", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwum_fE01g0yFrHjdBDo0jUBwRKW7RFyPoA&s" },
        { title: "Paneer Butter Masala", desc: "Smoky paneer cubes.", price: "₹299", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI38pCuzj-b23JE0jr4oXaLmvIW9JZr7wXuQ&s" },
        { title: "Khaman", desc: "Gujarati Special", price: "₹120", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeZtCo6ri9X2Bf7RtR3IXn4iRtBMpexqUEXg&s" },
        { title: "Dhokla", desc: "Chilli dhokla.", price: "₹119", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO49XaDUl_E54SFApp_AaySPMi5pLnTBpFZw&s" },
         
        // ... (Add your other items back here!)
    ];

    // --- RENDER MENU ---
    menuGrid.innerHTML = menuData.map(item => `
        <div class="food-card">
            <div class="card-img" style="background-image: url('${item.img}');"></div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">
                    <span class="price">${item.price}</span>
                    <button class="order-btn" onclick="addToCart('${item.title}', '${item.price}', '${item.img}')">Add +</button>
                </div>
            </div>
        </div>
    `).join('');
}

/* =====================
   CHECKOUT LOGIC 💰
===================== */

// 1. Triggered by the "Checkout" button in the Sidebar
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some food first. 🍔");
        return;
    }

    // Get the total price from the sidebar
    const currentTotal = document.getElementById('cart-total').innerText;

    // Set it inside the Modal
    document.getElementById('modal-total').innerText = currentTotal;

    // Close the Cart Sidebar first (for cleaner look)
    toggleCart();

    // Open the Modal
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');
}

// 2. Close Modal Function
function closeModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

// 3. Place order function (Send data to python server)
async function placeOrder(event) {
    event.preventDefault();

    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const total = document.getElementById('modal-total').innerText;
    const submitBtn = document.querySelector('.confirm-btn');

    // Show loading state
    submitBtn.innerText = "Processing... ⏳";
    submitBtn.disabled = true;

    // Prepare data packet
    const orderData = {
        name: name,
        address: address,
        cart: cart, // Sending the whole cart array
        total: total
    };

    try {
        // Send to Python Server (Make sure app.py is running!)
       // OLD: const response = await fetch('http://127.0.0.1:5000/place_order', { ...

// NEW (Example):
const response = await fetch('https://prem-food-backend.onrender.com/place_order', { 
    method: 'POST',
    // ... rest of code
});

        const result = await response.json();

        if (response.ok) {
            alert(`🎉 Success! Email sent to Mr. Prem.\n\nOrder for ${name} confirmed!`);
            
            // Clear Data
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            closeModal();
            document.getElementById('checkout-form').reset();
        } else {
            alert("❌ Server Error: " + result.error);
        }

    } catch (error) {
        alert("❌ Error: Is your Python server running? 🐍");
        console.error(error);
    } finally {
        submitBtn.innerText = "Place Order ✅";
        submitBtn.disabled = false;
    }
}