let db = null
let productos = []

const request = indexedDB.open('tiendaDB', 3)

request.onupgradeneeded = e => {
  const database = e.target.result

  if (!database.objectStoreNames.contains('productos')) {
    database.createObjectStore('productos', { keyPath: 'id' })
  }

  if (!database.objectStoreNames.contains('carrito')) {
    database.createObjectStore('carrito', { keyPath: 'productoId' })
  }
}

request.onsuccess = e => {
  db = e.target.result
  iniciarApp()
}

request.onerror = () => {
  document.getElementById('productos').textContent = 'Error abriendo IndexedDB'
}

function iniciarApp() {
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
}

function añadirAlCarrito(productoId) {
  const tx = db.transaction('carrito', 'readwrite')
  const store = tx.objectStore('carrito')
  const req = store.get(productoId)

  req.onsuccess = () => {
    if (req.result) {
      req.result.cantidad++
      store.put(req.result)
      return
    }
    store.add({ productoId, cantidad: 1 })
  }

  tx.oncomplete = mostrarCarrito
}

function cambiarCantidad(productoId, cambio) {
  const tx = db.transaction('carrito', 'readwrite')
  const store = tx.objectStore('carrito')
  const req = store.get(productoId)

  req.onsuccess = () => {
    const item = req.result
    if (!item) return

    item.cantidad += cambio

    if (item.cantidad <= 0) {
      store.delete(productoId)
    } else {
      store.put(item)
    }
  }

  tx.oncomplete = mostrarCarrito
}

function eliminar(productoId) {
  const tx = db.transaction('carrito', 'readwrite')
  tx.objectStore('carrito').delete(productoId)
  tx.oncomplete = mostrarCarrito
}

function mostrarCarrito() {
  const tx = db.transaction('carrito', 'readonly')
  const store = tx.objectStore('carrito')
  const req = store.getAll()

  req.onsuccess = () => {
    const div = document.getElementById('carrito')
    div.innerHTML = ''

    if (req.result.length === 0) {
      div.textContent = 'Carrito vacío'
      return
    }

    req.result.forEach(item => {
      const prod = productos.find(p => p.id === item.productoId)
      if (!prod) return

      const fila = document.createElement('div')
      fila.className = 'carrito-item'
      fila.innerHTML = `
        ${prod.nombre} x ${item.cantidad}
        <button>+</button>
        <button>-</button>
        <button>x</button>
      `

      const botones = fila.querySelectorAll('button')
      botones[0].addEventListener('click', () => cambiarCantidad(item.productoId, 1))
      botones[1].addEventListener('click', () => cambiarCantidad(item.productoId, -1))
      botones[2].addEventListener('click', () => eliminar(item.productoId))

      div.appendChild(fila)
    })
  }
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
    div.querySelector('button').addEventListener('click', () => añadirAlCarrito(p.id))
    cont.appendChild(div)
  })
}
