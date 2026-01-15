const btnClaro = document.getElementById('claro')
const btnOscuro = document.getElementById('oscuro')

function aplicarTema(tema) {
  document.body.className = tema
  sessionStorage.setItem('tema', tema)
}

btnClaro.onclick = () => aplicarTema('claro')
btnOscuro.onclick = () => aplicarTema('oscuro')

const tema = sessionStorage.getItem('tema')
if (tema) aplicarTema(tema)
