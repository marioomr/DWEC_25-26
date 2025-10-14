const contenedorPestanas = document.getElementById('contenedor-pestanas');
const contenedorContenidos = document.getElementById('contenedor-contenidos');

contenedorPestanas.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    
    const contenidos = contenedorContenidos.querySelectorAll('.contenido');
    contenidos.forEach(div => div.classList.add('oculto'));

    
    const botones = contenedorPestanas.querySelectorAll('button');
    botones.forEach(btn => btn.classList.remove('pestana-activa'));

    
    const idContenido = e.target.getAttribute('data-id');
    const contenidoMostrar = document.getElementById(idContenido);
    if (contenidoMostrar) {
      contenidoMostrar.classList.remove('oculto');
    }

    
    e.target.classList.add('pestana-activa');
  }
});
