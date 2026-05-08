let db = null
let productos = []

/*************************
 * Abrir IndexedDB
 *************************/
const request = indexedDB.open('tiendaDB', 2)

request.onupgradeneeded = e => {
  const database = e.target.result
  if (!database.objectStoreNames.contains('carrito')) {
    database.createObjectStore('carrito', { keyPath: 'productoId' })
  }
}

request.onsuccess = e => {
  db = e.target.result
  iniciarApp()
}

request.onerror = () => {
  console.error('Error al abrir IndexedDB')
}

/*************************
 * Iniciar app SOLO cuando DB esté lista
 *************************/
function iniciarApp() {
  fetch('data/productos.json')
    .then(r => r.json())
    .then(data => {
      productos = data
      mostrarProductos()
      mostrarCarrito()
    })
}

/*************************
 * AÑADIR AL CARRITO (get / add / put)
 *************************/
function añadirAlCarrito(productoId) {
  const tx = db.transaction('carrito', 'readwrite')
  const store = tx.objectStore('carrito')
  const req = store.get(productoId)

  req.onsuccess = () => {
    if (req.result) {
      req.result.cantidad++
      store.put(req.result)
    } else {
      store.add({ productoId, cantidad: 1 })
    }
  }

  tx.oncomplete = mostrarCarrito
}

/*************************
 * CAMBIAR CANTIDAD (+ / -)
 *************************/
function cambiarCantidad(productoId, cambio) {
  const tx = db.transaction('carrito', 'readwrite')
  const store = tx.objectStore('carrito')
  const req = store.get(productoId)

  req.onsuccess = () => {
    const item = req.result
    item.cantidad += cambio

    if (item.cantidad <= 0) {
      store.delete(productoId)
    } else {
      store.put(item)
    }
  }

  tx.oncomplete = mostrarCarrito
}

/*************************
 * ELIMINAR PRODUCTO (delete)
 *************************/
function eliminar(productoId) {
  const tx = db.transaction('carrito', 'readwrite')
  tx.objectStore('carrito').delete(productoId)
  tx.oncomplete = mostrarCarrito
}

/*************************
 * MOSTRAR CARRITO
 *************************/
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

      div.innerHTML += `
        <div>
          ${prod.nombre} x ${item.cantidad}
          <button onclick="cambiarCantidad(${item.productoId}, 1)">+</button>
          <button onclick="cambiarCantidad(${item.productoId}, -1)">-</button>
          <button onclick="eliminar(${item.productoId})">x</button>
        </div>
      `
    })
  }
}

/*************************
 * MOSTRAR PRODUCTOS
 *************************/
function mostrarProductos() {
  const cont = document.getElementById('productos')
  cont.innerHTML = ''

  productos.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      ${p.nombre} - ${p.precio} €
      <button>Añadir al carrito</button>
    `
    div.querySelector('button').onclick = () => añadirAlCarrito(p.id)
    cont.appendChild(div)
  })
}
