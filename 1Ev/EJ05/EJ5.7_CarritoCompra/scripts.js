const listaProductos = document.getElementById('lista-productos');
const carrito = document.getElementById('carrito');
const totalSpan = document.getElementById('total');

listaProductos.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-anadir')) {
    const liProducto = e.target.parentNode;
    const nuevoProducto = liProducto.cloneNode(true);

    const btn = nuevoProducto.querySelector('button');
    btn.textContent = 'Quitar';
    btn.classList.remove('btn-anadir');
    btn.classList.add('btn-quitar');

    carrito.appendChild(nuevoProducto);
    calcularTotal();
  }
});

carrito.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-quitar')) {
    const li = e.target.parentNode;
    li.remove();
    calcularTotal();
  }
});

function calcularTotal() {
  let total = 0;
  const items = carrito.querySelectorAll('li');
  items.forEach(item => {
    const precio = parseFloat(item.getAttribute('data-price'));
    if (!isNaN(precio)) {
      total += precio;
    }
  });
  totalSpan.textContent = total.toFixed(2);
}
