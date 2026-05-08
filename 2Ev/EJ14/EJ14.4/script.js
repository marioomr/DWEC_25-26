let db = null

const estado = document.getElementById('estado')
const btnActualizar = document.getElementById('actualizar')
btnActualizar.disabled = true   // 👈 desactivado hasta que DB esté lista

/*************************
 * Abrir IndexedDB
 *************************/
const request = indexedDB.open('tiendaDB', 2)

request.onupgradeneeded = e => {
  const database = e.target.result

  if (!database.objectStoreNames.contains('productos')) {
    database.createObjectStore('productos', { keyPath: 'id' })
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

/*************************
 * LÓGICA PRINCIPAL (a,b,c,d)
 *************************/
function cargarCatalogo() {
  estado.textContent = 'Comprobando catálogo local...'

  const tx = db.transaction('productos', 'readonly')
  const store = tx.objectStore('productos')
  const req = store.getAll()

  req.onsuccess = () => {
    if (req.result.length > 0) {
      estado.textContent = 'Productos cargados desde IndexedDB'
      mostrarProductos(req.result)     // c
    } else {
      cargarDesdeServidor()            // d
    }
  }
}

/*************************
 * FETCH + GUARDAR
 *************************/
function cargarDesdeServidor() {
  estado.textContent = 'Cargando desde servidor...'

  fetch('data/productos.json')
    .then(r => r.json())
    .then(data => {
      const tx = db.transaction('productos', 'readwrite')
      const store = tx.objectStore('productos')
      data.forEach(p => store.put(p))

      tx.oncomplete = () => {
        estado.textContent = 'Catálogo guardado en IndexedDB'
        mostrarProductos(data)
      }
    })
}

/*************************
 * MOSTRAR PRODUCTOS
 *************************/
function mostrarProductos(lista) {
  const cont = document.getElementById('productos')
  cont.innerHTML = ''

  lista.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <strong>${p.nombre}</strong><br>
      Precio: ${p.precio} €<br>
      Categoría: ${p.categoria}
    `
    cont.appendChild(div)
  })
}

/*************************
 * FORZAR ACTUALIZACIÓN
 *************************/
btnActualizar.onclick = () => {
  if (!db) return   // seguridad extra

  estado.textContent = 'Forzando actualización...'

  const tx = db.transaction('productos', 'readwrite')
  tx.objectStore('productos').clear()

  tx.oncomplete = cargarDesdeServidor
}
