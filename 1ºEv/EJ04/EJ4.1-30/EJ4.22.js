(function() {
  const formulario = document.getElementById('formulario-contacto');
  if (formulario) {
    formulario.addEventListener('submit', function(event) {
      event.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const mensaje = document.getElementById('mensaje').value;
      console.log('EJ 22: Nombre:', nombre, 'Mensaje:', mensaje);
    });
  }
})();