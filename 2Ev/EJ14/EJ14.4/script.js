let db = null

const estado = document.getElementById('estado')
const btnActualizar = document.getElementById('actualizar')

btnActualizar.disabled = true

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
  btnActualizar.disabled = false
  cargarCatalogo()
}

request.onerror = () => {
  estado.textContent = 'Error abriendo IndexedDB'
}

function cargarCatalogo() {
  estado.textContent = 'Comprobando catálogo local...'

  const tx = db.transaction('productos', 'readonly')
  const store = tx.objectStore('productos')
  const req = store.getAll()

  req.onsuccess = () => {
    if (req.result.length > 0) {
      estado.textContent = 'Productos cargados desde IndexedDB'
      mostrarProductos(req.result)
      return
    }
    cargarDesdeServidor()
  }

  req.onerror = () => {
    estado.textContent = 'Error leyendo IndexedDB'
  }
}

function cargarDesdeServidor() {
  estado.textContent = 'Cargando desde servidor...'

  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const tx = db.transaction('productos', 'readwrite')
      const store = tx.objectStore('productos')

      data.forEach(p => store.put(p))

      tx.oncomplete = () => {
        estado.textContent = 'Catálogo guardado en IndexedDB'
        mostrarProductos(data)
      }

      tx.onerror = () => {
        estado.textContent = 'Error guardando catálogo'
      }
    })
    .catch(() => {
      estado.textContent = 'Error cargando productos'
    })
}

function mostrarProductos(lista) {
  const cont = document.getElementById('productos')
  cont.innerHTML = ''

  lista.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: ${p.precio} €</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.categoria}</p>
    `
    cont.appendChild(div)
  })
}

btnActualizar.addEventListener('click', () => {
  if (!db) return

  estado.textContent = 'Forzando actualización...'

  const tx = db.transaction('productos', 'readwrite')
  tx.objectStore('productos').clear()

  tx.oncomplete = cargarDesdeServidor
  tx.onerror = () => {
    estado.textContent = 'Error borrando el catálogo'
  }
})
