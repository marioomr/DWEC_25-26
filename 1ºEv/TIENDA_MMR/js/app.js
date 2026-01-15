let products = [];
let categories = [];
let brands = [];
let users = [];
let cart = [];
let currentUser = null;
let exchangeRates = { EUR: 1, USD: 1.1, GBP: 0.85 };
let currentCurrency = "EUR";

const productsRow = document.getElementById("products-row");
const filterBrand = document.getElementById("filter-brand");
const filterCategory = document.getElementById("filter-category");
const searchInput = document.getElementById("search-input");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const currencySelect = document.getElementById("currency-select");
const alertsContainer = document.getElementById("alerts-container");

const modalProduct = new bootstrap.Modal("#modal-product");
const modalCart = new bootstrap.Modal("#modal-cart");
const modalLogin = new bootstrap.Modal("#modal-login");
const modalEdit = new bootstrap.Modal("#modal-edit");

async function loadJSON() {
  try {
    const [prodRes, catRes, brandRes, userRes] = await Promise.all([
      fetch("datos/productos.json"),
      fetch("datos/categorias.json"),
      fetch("datos/marcas.json"),
      fetch("datos/usuarios.json")
    ]);
    products = await prodRes.json();
    categories = await catRes.json();
    brands = await brandRes.json();
    users = await userRes.json();
    products.forEach(p => {
      const cat = categories.find(c => c.id === p.categoria_id);
      const br = brands.find(b => b.id === p.marca_id);
      p.category = cat ? cat.nombre : "";
      p.brand = br ? br.nombre : "";
    });
  } catch (e) {
    console.error("Error cargando JSON", e);
    products = [];
    categories = [];
    brands = [];
    users = [];
  }
}

function showAlert(message, type = "success") {
  if (!alertsContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
  toast.role = "alert";
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  alertsContainer.appendChild(toast);
  new bootstrap.Toast(toast, { delay: 2000 }).show();
}

function populateFilters() {
  filterBrand.innerHTML = `<option value="">Todas las marcas</option>`;
  filterCategory.innerHTML = `<option value="">Todas las categorías</option>`;
  brands.forEach(b => filterBrand.innerHTML += `<option value="${b.nombre}">${b.nombre}</option>`);
  categories.forEach(c => filterCategory.innerHTML += `<option value="${c.nombre}">${c.nombre}</option>`);
}

function renderProducts() {
  const b = filterBrand.value;
  const c = filterCategory.value;
  const t = searchInput.value.toLowerCase();
  productsRow.innerHTML = "";
  const filtered = products.filter(p => {
    if (b && p.brand !== b) return false;
    if (c && p.category !== c) return false;
    if (t && !(p.nombre.toLowerCase().includes(t) || p.descripcion.toLowerCase().includes(t))) return false;
    return true;
  });
  
  filtered.forEach(p => {
    const price = (p.precio * (exchangeRates[currentCurrency] || 1)).toFixed(2);
    const disabled = p.stock <= 0 || !currentUser ? "disabled" : "";
    productsRow.innerHTML += `
      <div class="col-md-4">
        <div class="card">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="text-muted">${p.brand} · ${p.category}</p>
            <p class="fw-bold">${price} ${currentCurrency}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" onclick="openDetails(${p.id})">Detalles</button>
              <button class="btn btn-success add-cart-btn" data-id="${p.id}" ${disabled}>Añadir</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  attachAddCartEvents();
}

function attachAddCartEvents() {
  const buttons = document.querySelectorAll(".add-cart-btn");
  buttons.forEach(btn => {
    btn.onclick = () => addToCart(Number(btn.dataset.id));
  });
}

function openDetails(id) {
  const p = products.find(x => x.id === id);
  document.getElementById("modal-product-title").textContent = p.nombre;
  document.getElementById("modal-product-image").src = p.imagen;
  document.getElementById("modal-product-desc").textContent = p.descripcion;
  const price = (p.precio * (exchangeRates[currentCurrency] || 1)).toFixed(2);
  document.getElementById("modal-product-price").textContent = `${price} ${currentCurrency}`;
  document.getElementById("modal-add-cart").onclick = () => {
    addToCart(p.id);
    modalProduct.hide();
  };
  modalProduct.show();
}

function addToCart(id) {
  if (!currentUser) return showAlert("Debes iniciar sesión para añadir productos", "danger");
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (p.stock <= 0) return showAlert("Producto sin stock", "danger");
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
  showAlert("Producto añadido al carrito");
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  let total = 0;
  let count = 0;
  cartItems.innerHTML = "";
  cart.forEach(i => {
    total += i.precio * i.qty;
    count += i.qty;
    const price = (i.precio * (exchangeRates[currentCurrency] || 1) * i.qty).toFixed(2);
    cartItems.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <span>${i.nombre}</span>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i.id}, -1)">-</button>
          <span>${i.qty}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
        <strong>${price} ${currentCurrency}</strong>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${i.id})">&times;</button>
      </div>`;
  });
  cartTotal.textContent = (total * (exchangeRates[currentCurrency] || 1)).toFixed(2) + ` ${currentCurrency}`;
  cartCount.textContent = count;
}

function saveCart() {
  if (currentUser) localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
}

function loadCart() {
  if (currentUser) {
    const saved = localStorage.getItem(`cart_${currentUser.id}`);
    cart = saved ? JSON.parse(saved) : [];
  } else cart = [];
}

function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return false;
  currentUser = user;
  loadCart();
  renderProducts();
  updateCartUI();
  return true;
}

function updateProfile(data) {
  Object.assign(currentUser, data);
  showAlert("Perfil actualizado");
}

async function fetchExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=EUR&symbols=EUR,USD,GBP");
    const data = await res.json();
    if (!data || !data.rates) throw new Error("API no devolvió tasas");
    exchangeRates = {
      EUR: data.rates.EUR ?? 1,
      USD: data.rates.USD ?? 1.1,
      GBP: data.rates.GBP ?? 0.85
    };
    renderProducts();
    updateCartUI();
  } catch (e) {
    console.error("Error cargando tasas de cambio", e);
    exchangeRates = { EUR: 1, USD: 1.1, GBP: 0.85 };
    renderProducts();
    updateCartUI();
  }
}

document.getElementById("btn-cart").onclick = () => modalCart.show();
document.getElementById("btn-login").onclick = () => modalLogin.show();
document.getElementById("btn-edit-profile").onclick = () => {
  modalLogin.hide();
  modalEdit.show();
};
document.getElementById("login-form").onsubmit = e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-pass").value;
  if (login(email, pass)) {
    modalLogin.hide();
    showAlert("Sesión iniciada");
  } else showAlert("Email o contraseña incorrectos", "danger");
};
document.getElementById("edit-form").onsubmit = e => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById("edit-name").value,
    apellidos: document.getElementById("edit-lastname").value,
    email: document.getElementById("edit-email").value,
    password: document.getElementById("edit-pass").value,
    telefono: document.getElementById("edit-phone").value
  };
  updateProfile(data);
  modalEdit.hide();
};
const clearBtn = document.getElementById("clear-cart-btn");
if (clearBtn) clearBtn.onclick = clearCart;

filterBrand.onchange = renderProducts;
filterCategory.onchange = renderProducts;
searchInput.oninput = renderProducts;
if (currencySelect) currencySelect.addEventListener("change", e => {
  currentCurrency = e.target.value;
  renderProducts();
  updateCartUI();
});

(async () => {
  await loadJSON();
  await fetchExchangeRates();
  populateFilters();
  renderProducts();
  updateCartUI();
})();
