function getCookie(nombre) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(nombre + '='))
    ?.split('=')[1]
}

function setCookie(nombre, valor, dias) {
  const fecha = new Date()
  fecha.setTime(fecha.getTime() + dias * 86400000)
  document.cookie = `${nombre}=${valor};expires=${fecha.toUTCString()};path=/`
}

const ultima = getCookie('ultimaVisita')

if (ultima) {
  const banner = document.createElement('div')
  banner.id = 'banner'
  banner.innerHTML = `
    Bienvenido de nuevo. Tu última visita fue el ${decodeURIComponent(ultima)}
    <button>Cerrar</button>
  `
  banner.querySelector('button').onclick = () => banner.remove()
  document.body.prepend(banner)
}

setCookie('ultimaVisita', encodeURIComponent(new Date().toLocaleString()), 30)
