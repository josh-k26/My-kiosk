// ========== CHANGE THESE PRODUCTS ==========
const products = [
  { id: 1, name: "Bread (500g)", price: 60, image: "https://via.placeholder.com/300x200?text=Bread" },
  { id: 2, name: "Milk 500ml", price: 70, image: "https://via.placeholder.com/300x200?text=Milk" },
  { id: 3, name: "Cooking Oil 1L", price: 280, image: "https://via.placeholder.com/300x200?text=Oil" },
  { id: 4, name: "Sugar 1kg", price: 180, image: "https://via.placeholder.com/300x200?text=Sugar" },
  { id: 5, name: "Rice 1kg", price: 160, image: "https://via.placeholder.com/300x200?text=Rice" },
  { id: 6, name: "Soda 500ml", price: 50, image: "https://via.placeholder.com/300x200?text=Soda" },
  { id: 7, name: "Eggs (Tray)", price: 450, image: "https://via.placeholder.com/300x200?text=Eggs" },
  { id: 8, name: "Toilet Paper (4pcs)", price: 120, image: "https://via.placeholder.com/300x200?text=Tissue" },
];

// Your WhatsApp number (with country code, no + or spaces)
const WHATSAPP_NUMBER = "254705236288";   // ← CHANGE THIS to your number

// ========== CART LOGIC ==========
let cart = JSON.parse(localStorage.getItem("kioskCart")) || [];

function saveCart() {
  localStorage.setItem("kioskCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  alert(`${product.name} added to cart!`);
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ========== RENDER ==========
function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">KSh ${p.price}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#888;'>Your cart is empty</p>";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <small>KSh ${item.price} × ${item.qty}</small>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }
  document.getElementById("cart-total").textContent = getTotal();
}

// ========== CART TOGGLE ==========
function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  renderCart();
}

// ========== CHECKOUT ==========
function showCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("checkout-modal").classList.add("open");
  
  // Fill summary
  document.getElementById("summary-items").innerHTML = cart.map(item => 
    `<div>${item.name} × ${item.qty} = KSh ${item.price * item.qty}</div>`
  ).join("");
  document.getElementById("summary-total").textContent = getTotal();
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("open");
}

// ========== PLACE ORDER (WhatsApp) ==========
document.getElementById("order-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  let message = `*NEW ORDER from My Kiosk*%0A%0A`;
  message += `*Customer:* ${name}%0A`;
  message += `*Phone:* ${phone}%0A`;
  message += `*Address:* ${address}%0A`;
  if (notes) message += `*Notes:* ${notes}%0A`;
  message += `%0A*Items:*%0A`;

  cart.forEach(item => {
    message += `• ${item.name} × ${item.qty} = KSh ${item.price * item.qty}%0A`;
  });

  message += `%0A*Total: KSh ${getTotal()}*%0A%0APlease confirm and arrange delivery. Thank you!`;

  // Open WhatsApp
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.replace(/%0A/g, "\n"))}`, "_blank");

  // Clear cart after order
  cart = [];
  saveCart();
  closeCheckout();
  toggleCart();
  alert("Order sent! We will contact you shortly.");
});

// ========== START ==========
renderProducts();
updateCartCount();
