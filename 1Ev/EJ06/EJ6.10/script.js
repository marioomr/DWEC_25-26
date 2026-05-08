let carrito = [];

const botones = document.querySelectorAll('.añadir');
const listaCarrito = document.getElementById('lista-carrito');
const totalElemento = document.getElementById('total');
const botonVaciar = document.getElementById('vaciar');

botones.forEach(boton => {
  boton.addEventListener('click', (e) => {
    const producto = e.target.closest('.producto');
    const nombre = producto.querySelector('.nombre').textContent;
    const precioTexto = producto.querySelector('.precio').textContent;
    const precio = parseFloat(precioTexto.replace('Precio: ', '').replace('€', '').trim());

    añadirAlCarrito(nombre, precio);
  });
});

botonVaciar.addEventListener('click', vaciarCarrito);

function añadirAlCarrito(nombre, precio) {
  const productoExistente = carrito.find(item => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

function renderizarCarrito() {
  listaCarrito.innerHTML = '';

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} (x${item.cantidad}) - ${(item.precio * item.cantidad).toFixed(2)} €`;
    listaCarrito.appendChild(li);
  });
}

function calcularTotal() {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function actualizarCarrito() {
  renderizarCarrito();
  const total = calcularTotal();
  totalElemento.textContent = total.toFixed(2);
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}