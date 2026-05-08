const estado = document.getElementById('estado')
const panel = document.getElementById('panel')

async function cargarPanel(){
  estado.textContent = 'Cargando datos del panel...'
  try{
    const [resPedidos,resDetalles,resProductos] = await Promise.all([
      fetch('../data/pedidos.json'),
      fetch('../data/detalles_pedido.json'),
      fetch('../data/productos.json')
    ])
    const pedidos = await resPedidos.json()
    const detalles = await resDetalles.json()
    const productos = await resProductos.json()
    const pedidosEnriquecidos = combinarDatos(pedidos,detalles,productos)
    estado.textContent = ''
    mostrarPanel(pedidosEnriquecidos)
  }catch(e){
    estado.textContent = 'Error cargando datos'
  }
}

function combinarDatos(pedidos,detalles,productos){
  return pedidos.map(p => {
    const dets = detalles.filter(d => d.pedidoId === p.id).map(d => {
      const prod = productos.find(pr => pr.id === d.productoId) || {}
      return {
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        nombreProducto: prod.nombre || 'Nombre no disponible'
      }
    })
    const totalPedido = dets.reduce((acc,item) => acc + item.cantidad * item.precioUnitario,0)
    return {...p, detalles: dets, totalPedido}
  })
}

function mostrarPanel(listado){
  panel.innerHTML = ''
  if(listado.length === 0){
    panel.innerHTML = '<p>No hay pedidos</p>'
    return
  }
  listado.forEach(p => {
    const div = document.createElement('div')
    div.className = 'card'
    const total = p.totalPedido.toFixed(2)
    div.innerHTML = `<h3>Pedido ${p.id} - ${p.fecha}</h3>
      <p>Estado: ${p.estado}</p>
      <p>Total: ${total} €</p>`
    const ul = document.createElement('ul')
    p.detalles.forEach(d => {
      const li = document.createElement('li')
      li.textContent = `${d.cantidad} x ${d.nombreProducto} - ${d.precioUnitario} €`
      ul.appendChild(li)
    })
    div.appendChild(ul)
    panel.appendChild(div)
  })
}

cargarPanel()
