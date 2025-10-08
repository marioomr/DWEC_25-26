(function() {
  const numCursos = document.querySelectorAll('.card').length;
  const enlaceContacto = document.querySelector('.navegacion a:last-child');
  if (enlaceContacto) {
    enlaceContacto.textContent = `Contacto (${numCursos} Cursos)`;
  }
})();