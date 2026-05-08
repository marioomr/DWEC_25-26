const PRODUCTS_PATH = 'productos.json';
const filterCategory = document.getElementById('filterCategory');
const filterBrand = document.getElementById('filterBrand');
const sortPrice = document.getElementById('sortPrice');
const productList = document.getElementById('product-list');
const alerts = document.getElementById('alerts');

let products = [];
let filteredProducts = [];
/*
function showAlert(msg, type = 'danger', timeout = 4000) {
  alerts.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${escapeHtml(msg)}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  if (timeout) setTimeout(() => { if (alerts.firstChild) alerts.firstChild.remove(); }, timeout);
}
*/
function escapeHtml(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}

function populateFilters(items) {
  const categories = Array.from(new Set(items.map(p => p.category))).sort((a,b) => a.localeCompare(b));
  const brands = Array.from(new Set(items.map(p => p.brand))).sort((a,b) => a.localeCompare(b));
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCategory.appendChild(opt);
  });
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    filterBrand.appendChild(opt);
  });
}

function renderProducts(list) {
  productList.innerHTML = '';
  if (!list.length) {
    productList.innerHTML = '<div class="col-12"><p class="text-muted">No hay productos que coincidan.</p></div>';
    return;
  }
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(p.name)}</h5>
          <p class="card-text text-muted small mb-2">${escapeHtml(p.brand)} • ${escapeHtml(p.category)}</p>
          <p class="card-text flex-grow-1">${escapeHtml(p.description)}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <strong class="fs-5">${p.price.toLocaleString(undefined,{style:'currency',currency:'EUR'})}</strong>
            <span class="badge bg-${p.stock>0?'success':'secondary'}">${p.stock>0?('En stock: '+p.stock):'Agotado'}</span>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
}

function applyFiltersAndSort() {
  const cat = filterCategory.value;
  const brand = filterBrand.value;
  const sort = sortPrice.value;
  filteredProducts = products.filter(p => {
    if (cat && p.category !== cat) return false;
    if (brand && p.brand !== brand) return false;
    return true;
  });
  if (sort === 'asc') {
    filteredProducts.sort((a,b) => a.price - b.price);
  } else if (sort === 'desc') {
    filteredProducts.sort((a,b) => b.price - a.price);
  }
  renderProducts(filteredProducts);
}

function loadProducts() {
  fetch(PRODUCTS_PATH)
    .then(res => {
      if (!res.ok) throw new Error('Error cargando productos (status ' + res.status + ')');
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Formato de productos inválido');
      products = data;
      populateFilters(products);
      applyFiltersAndSort();
    })
    .catch(err => {
      showAlert(err.message, 'danger', 8000);
      productList.innerHTML = '<div class="col-12"><p class="text-muted">No se han podido cargar los productos.</p></div>';
    });
}

filterCategory.addEventListener('change', applyFiltersAndSort);
filterBrand.addEventListener('change', applyFiltersAndSort);
sortPrice.addEventListener('change', applyFiltersAndSort);

document.addEventListener('DOMContentLoaded', loadProducts);
