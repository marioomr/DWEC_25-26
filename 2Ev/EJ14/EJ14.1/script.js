const btnClaro = document.getElementById('claro')
const btnOscuro = document.getElementById('oscuro')
const contenedor = document.getElementById('productos')

function aplicarTema(tema) {
  document.body.className = tema
  sessionStorage.setItem('tema', tema)
}

function mostrarProductos(productos) {
  contenedor.innerHTML = ''
  productos.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: ${p.precio} €</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.categoria}</p>
    `
    contenedor.appendChild(div)
  })
}

function cargarProductos() {
  contenedor.textContent = 'Cargando...'
  fetch('data/productos.json')
    .then(res => res.json())
    .then(mostrarProductos)
    .catch(() => {
      contenedor.textContent = 'Error cargando productos'
    })
}

btnClaro.addEventListener('click', () => aplicarTema('claro'))
btnOscuro.addEventListener('click', () => aplicarTema('oscuro'))

aplicarTema(sessionStorage.getItem('tema') || 'claro')
cargarProductos()
