function cambiarImagenPrincipal(indice) {
  const miniaturas = document.querySelectorAll('.miniatura');
  const imagenSeleccionada = miniaturas[indice];
  const srcImagen = imagenSeleccionada.getAttribute('src');

  const imagenPrincipal = document.getElementById('imagen-principal');
  imagenPrincipal.setAttribute('src', srcImagen);
  resaltarMiniatura(indice);
}

function resaltarMiniatura(indice) {
  const miniaturas = document.querySelectorAll('.miniatura');

  miniaturas.forEach((miniatura, i) => {
    if (i === indice) {
      miniatura.classList.add('activa');
    } else {
      miniatura.classList.remove('activa');
    }
  });
}
