document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
  renderProductos(productos);

  document.getElementById("busqueda").addEventListener("input", filtrar);
  document.getElementById("categoria").addEventListener("change", filtrar);
  document.getElementById("precioMax").addEventListener("input", e => {
    document.getElementById("valorRango").textContent = e.target.value;
    filtrar();
  });
  document.querySelectorAll('input[name="orden"]').forEach(r => r.addEventListener("change", filtrar));
});

function cargarCategorias() {
  const select = document.getElementById("categoria");
  const cats = ["Todas", ...new Set(productos.map(p => p.categoria))];
  select.innerHTML = cats.map(c => `<option>${c}</option>`).join("");
}

function filtrar() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const categoria = document.getElementById("categoria").value;
  const max = parseFloat(document.getElementById("precioMax").value);
  const orden = document.querySelector('input[name="orden"]:checked').value;

  let filtrados = productos
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .filter(p => categoria === "Todas" || p.categoria === categoria)
    .filter(p => p.precio <= max);

  if (orden === "asc") filtrados.sort((a, b) => a.precio - b.precio);
  if (orden === "desc") filtrados.sort((a, b) => b.precio - a.precio);
  if (orden === "nombre") filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

  renderProductos(filtrados);
}

function renderProductos(lista) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";
  if (lista.length === 0) {
    cont.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  lista.forEach(p => {
    cont.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card">
          <img src="${p.imagen}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${p.categoria}</p>
            <p><strong>${p.precio} €</strong></p>
          </div>
        </div>
      </div>`;
  });
}
