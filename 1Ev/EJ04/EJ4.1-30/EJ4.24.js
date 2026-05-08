(function() {
  const titulosCursos = document.querySelectorAll('.card h2');
  titulosCursos.forEach(function(titulo) {
    titulo.textContent = `[CURSO] ${titulo.textContent}`;
  });
})();