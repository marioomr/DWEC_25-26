const form = document.getElementById('form-buscar')
const emailInput = document.getElementById('email')
const mensaje = document.getElementById('mensaje')
const resultado = document.getElementById('resultado')

form.addEventListener('submit', async e => {
  e.preventDefault()
  mensaje.textContent = ''
  resultado.innerHTML = ''
  const email = emailInput.value.trim()
  if(!email || !email.includes('@')){
    mensaje.textContent = 'Introduce un email válido'
    return
  }
  mensaje.textContent = 'Buscando...'
  try{
    const resU = await fetch('../data/usuarios.json')
    const usuarios = await resU.json()
    const usuario = usuarios.find(u => u.email === email)
    if(!usuario){
      mensaje.textContent = 'Usuario no encontrado'
      return
    }
    const resP = await fetch('../data/pedidos.json')
    const pedidos = await resP.json()
    const pedidosUsuario = pedidos.filter(p => p.usuarioId === usuario.id)
    mensaje.textContent = ''
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `<h3>${usuario.nombre}</h3><p>Registrado: ${usuario.fechaRegistro || 'N/D'}</p>`
    resultado.appendChild(card)
    if(pedidosUsuario.length === 0){
      const p = document.createElement('p')
      p.textContent = 'Este usuario no tiene pedidos registrados'
      resultado.appendChild(p)
    } else {
      const ul = document.createElement('ul')
      pedidosUsuario.forEach(p => {
        const li = document.createElement('li')
        li.textContent = `ID: ${p.id} | Fecha: ${p.fecha} | Estado: ${p.estado}`
        ul.appendChild(li)
      })
      resultado.appendChild(ul)
    }
  }catch(e){
    mensaje.textContent = 'Error buscando datos'
  }
})
