//script.js

// browser page functions

// home page functions

// profile page functions

// login page functions


// signup page functions
function tryCreateAccount(){
    //add more logic later, redirect to home
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const user = {name, email, password};

    localStorage.setItem("user", JSON.stringify(user));
    alert("Account Created");
    window.location.href = "login.html";
}
function tryLogin(){
    //add more logic later, redirect to home
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && email === storedUser.email && password  === storedUser.password){
        alert("Login sucessful");
        window.location.href = "profile.html";
    }
    else
        {
        alert("Invalid login");
    }
}
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const profileCard = document.querySelector(".profile-card");

    updateNavbar(); 

    loadCart();

    
    if (!user && window.location.pathname.includes("profile.html")) {
        window.location.href = "login.html";
        return;
    }

    if (user && profileCard) {
        profileCard.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    }
};

function searchItems() {
    const query = document.querySelector(".search-box input").value.toLowerCase();
    const items = document.querySelectorAll(".item-card");

    items.forEach(item => {
        const title = item.querySelector("h3").textContent.toLowerCase();
        item.style.display = title.includes(query) ? "block" : "none";
    });
}
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const authLink = document.getElementById("auth-link");

    if (!authLink) return;

    if (user) {
        authLink.innerHTML = `
            <span>Hi, ${user.name}</span>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        authLink.innerHTML = `<a href="login.html">Login</a>`;
    }

    updateCartCount();
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = document.getElementById("cart-link");

    if (!cartLink) return;

    let count = 0;
    cart.forEach(item => count += item.quantity);

    cartLink.textContent = "Cart (" + count + ")";
}
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " added to cart!");
}
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total-price");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalDisplay.textContent = "Total: $0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("item-card");

        div.innerHTML = `
            <img src="${item.image}" width="200">
            <h3>${item.name} × ${item.quantity}</h3>
            <p><strong>$${item.price * item.quantity}</strong></p>
            <button onclick="removeOne(${index})">Remove One</button>
            <button onclick="removeFromCart(${index})">Remove All</button>
        `;

        cartContainer.appendChild(div);
    });

    totalDisplay.textContent = "Total: $" + total;
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}
function removeOne(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}
function clearCart() {
    localStorage.removeItem("cart");
    location.reload();
}
function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    localStorage.removeItem("cart");
    alert("Order placed! Thanks for shopping with ShopSync.");
    location.reload();
}