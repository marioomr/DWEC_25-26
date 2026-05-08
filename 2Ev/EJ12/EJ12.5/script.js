const estado = document.getElementById('estado')
const selectUsuario = document.getElementById('usuario-select')
const dashboard = document.getElementById('dashboard')
let usuarios = []
let productos = []
let pedidos = []
let detalles = []

async function cargarDatosIniciales(){
  estado.textContent = 'Cargando datos maestros...'
  try{
    const [resU,resP,resPed,resDet] = await Promise.all([
      fetch('../data/usuarios.json'),
      fetch('../data/productos.json'),
      fetch('../data/pedidos.json'),
      fetch('../data/detalles_pedido.json')
    ])
    usuarios = await resU.json()
    productos = await resP.json()
    pedidos = await resPed.json()
    detalles = await resDet.json()
    estado.textContent = ''
    inicializarDashboard()
  }catch(e){
    estado.textContent = 'Error cargando datos maestros'
  }
}

function inicializarDashboard(){
  selectUsuario.innerHTML = '<option value="">-- Selecciona --</option>'
  usuarios.forEach(u => {
    const opt = document.createElement('option')
    opt.value = u.id
    opt.textContent = u.nombre
    selectUsuario.appendChild(opt)
  })
  selectUsuario.addEventListener('change', () => {
    const id = Number(selectUsuario.value)
    if(!id) { dashboard.innerHTML = ''; return }
    mostrarDashboardUsuario(id)
  })
}

function mostrarDashboardUsuario(usuarioId){
  dashboard.innerHTML = ''
  const usuario = usuarios.find(u => u.id === usuarioId)
  if(!usuario){ dashboard.textContent = 'Usuario no encontrado'; return }
  const cardUser = document.createElement('div')
  cardUser.className = 'card'
  cardUser.innerHTML = `<h3>${usuario.nombre}</h3><p>${usuario.email}</p><p>Registrado: ${usuario.fechaRegistro || 'N/D'}</p>`
  dashboard.appendChild(cardUser)
  const pedidosUsuario = pedidos.filter(p => p.usuarioId === usuarioId)
  if(pedidosUsuario.length === 0){
    const p = document.createElement('p')
    p.textContent = 'Este usuario no tiene pedidos'
    dashboard.appendChild(p)
    return
  }
  let gastoTotal = 0
  pedidosUsuario.forEach(p => {
    const detallesPedido = detalles.filter(d => d.pedidoId === p.id).map(d => {
      const prod = productos.find(pr => pr.id === d.productoId) || {}
      return {
        nombre: prod.nombre || 'Nombre no disponible',
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }
    })
    const totalPedido = detallesPedido.reduce((acc,item) => acc + item.cantidad * item.precioUnitario,0)
    gastoTotal += totalPedido
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `<h4>Pedido ${p.id} - ${p.fecha}</h4><p>Estado: ${p.estado}</p><p>Total: ${totalPedido.toFixed(2)} €</p>`
    const ul = document.createElement('ul')
    detallesPedido.forEach(d => {
      const li = document.createElement('li')
      li.textContent = `${d.cantidad} x ${d.nombre} - ${d.precioUnitario} €`
      ul.appendChild(li)
    })
    card.appendChild(ul)
    dashboard.appendChild(card)
  })
  const resumen = document.createElement('div')
  resumen.className = 'card'
  resumen.innerHTML = `<h3>Resumen</h3><p>Gasto total: ${gastoTotal.toFixed(2)} €</p>`
  dashboard.appendChild(resumen)
}

cargarDatosIniciales()
