const API_BASE = "https://DIN_BACKEND_URL_HÄR"; // Fylls i senare

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    document.getElementById("cartCount").textContent = cart.length;
}

function renderProducts(products) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image_url}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.price} kr</p>
            <button onclick="addToCart('${p.id}')">Lägg i kundvagn</button>
        `;
        container.appendChild(div);
    });
}

async function loadProducts() {
    const res = await fetch(`${API_BASE}/api/products`);
    const data = await res.json();
    renderProducts(data);
}

function addToCart(id) {
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function showCart() {
    const modal = document.getElementById("cartModal");
    const list = document.getElementById("cartItems");
    list.innerHTML = "";

    cart.forEach(id => {
        const li = document.createElement("li");
        li.textContent = id;
        list.appendChild(li);
    });

    modal.classList.remove("hidden");
}

async function checkout() {
    const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
    });

    const data = await res.json();
    window.location.href = data.checkout_url;
}

document.getElementById("cartBtn").onclick = showCart;
document.getElementById("closeCart").onclick = () => {
    document.getElementById("cartModal").classList.add("hidden");
};
document.getElementById("checkoutBtn").onclick = checkout;

updateCartCount();
loadProducts();

