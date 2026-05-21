let productos = []

fetch('data/productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data
    mostrarProductos()
    mostrarCarrito()
  })
  .catch(() => {
    document.getElementById('productos').textContent = 'Error cargando productos'
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
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: ${p.precio} €</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.categoria}</p>
      <button>Añadir al carrito</button>
    `
    div.querySelector('button').addEventListener('click', () => añadir(p.id))
    cont.appendChild(div)
  })
}

function mostrarCarrito() {
  const div = document.getElementById('carrito')
  const carrito = obtenerCarrito()
  div.innerHTML = ''

  if (carrito.length === 0) {
    div.textContent = 'Carrito vacío'
    return
  }

  carrito.forEach(item => {
    const prod = productos.find(p => p.id === item.id)
    if (!prod) return
    const p = document.createElement('p')
    p.textContent = `${prod.nombre} x ${item.cantidad}`
    div.appendChild(p)
  })
}

document.getElementById('vaciar').addEventListener('click', () => {
  localStorage.removeItem('carrito')
  mostrarCarrito()
})
