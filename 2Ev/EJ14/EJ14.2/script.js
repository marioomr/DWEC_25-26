let productos = []

fetch('data/productos.json')
  .then(r => r.json())
  .then(data => {
    productos = data
    mostrarProductos()
    mostrarCarrito()
  })

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || []
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

function añadir(id) {
  const carrito = obtenerCarrito()
  const item = carrito.find(p => p.id === id)

  if (item) item.cantidad++
  else carrito.push({ id, cantidad: 1 })

  guardarCarrito(carrito)
  mostrarCarrito()
}

function mostrarProductos() {
  const cont = document.getElementById('productos')
  cont.innerHTML = ''

  productos.forEach(p => {
    cont.innerHTML += `
      <div class="card">
        ${p.nombre} - ${p.precio} €
        <button onclick="añadir(${p.id})">Añadir</button>
      </div>
    `
  })
}

function mostrarCarrito() {
  const div = document.getElementById('carrito')
  div.innerHTML = ''

  obtenerCarrito().forEach(i => {
    const prod = productos.find(p => p.id === i.id)
    div.innerHTML += `<p>${prod.nombre} x ${i.cantidad}</p>`
  })
}

document.getElementById('vaciar').onclick = () => {
  localStorage.removeItem('carrito')
  mostrarCarrito()
}
