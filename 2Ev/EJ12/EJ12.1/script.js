const contenedor = document.getElementById('contenedor-productos')
const selectCategoria = document.getElementById('categoria')
const btnAsc = document.getElementById('orden-asc')
const btnDesc = document.getElementById('orden-desc')
const estado = document.getElementById('estado')
let productos = []
let productosMostrados = []

async function cargarProductos(){
  estado.textContent = 'Cargando...'
  try{
    const res = await fetch('../data/productos.json')
    productos = await res.json()
    productosMostrados = [...productos]
    poblarCategorias()
    mostrarProductos(productosMostrados)
    estado.textContent = ''
  }catch(e){
    estado.textContent = 'Error cargando productos'
  }
}

function mostrarProductos(listado){
  contenedor.innerHTML = ''
  if(listado.length === 0){
    contenedor.innerHTML = '<p>No hay productos para mostrar</p>'
    return
  }
  listado.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `<h3>${p.nombre}</h3>
      <p>Precio: ${p.precio} €</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.categoria}</p>`
    contenedor.appendChild(div)
  })
}

function poblarCategorias(){
  const categorias = Array.from(new Set(productos.map(p => p.categoria))).sort()
  categorias.forEach(c => {
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    selectCategoria.appendChild(opt)
  })
}

selectCategoria.addEventListener('change', () => {
  const cat = selectCategoria.value
  productosMostrados = cat === 'Todas' ? [...productos] : productos.filter(p => p.categoria === cat)
  mostrarProductos(productosMostrados)
})

btnAsc.addEventListener('click', () => {
  productosMostrados.sort((a,b) => a.precio - b.precio)
  mostrarProductos(productosMostrados)
})

btnDesc.addEventListener('click', () => {
  productosMostrados.sort((a,b) => b.precio - a.precio)
  mostrarProductos(productosMostrados)
})

cargarProductos()
