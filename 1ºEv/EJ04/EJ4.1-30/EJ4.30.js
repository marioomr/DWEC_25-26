(function() {
  const seccionFormulario = document.getElementById('formulario-seccion');
  if (seccionFormulario) {
    const textarea = seccionFormulario.querySelector('textarea');
    if (textarea) {
      textarea.placeholder = 'Escribe aquí tu consulta';
    }
  }
})();