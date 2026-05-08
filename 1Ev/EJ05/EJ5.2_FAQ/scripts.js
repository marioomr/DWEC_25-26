function revelarRespuesta(h2) {
  ocultarTodasLasRespuestas();
  const pRespuesta = h2.nextElementSibling;
  if(pRespuesta) {
    pRespuesta.classList.remove('oculto');
  }
}

function ocultarTodasLasRespuestas() {
  const respuestas = document.querySelectorAll('ul li p');
  respuestas.forEach(p => p.classList.add('oculto'));
}
