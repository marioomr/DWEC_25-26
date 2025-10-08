(function() {
  const tarjetas = document.querySelectorAll('.card');
  tarjetas.forEach(function(tarjeta) {
    const categoria = tarjeta.querySelector('.categoria');
    if (categoria && categoria.textContent === 'Desarrollo Web') {
      tarjeta.style.backgroundColor = '#f0f0f0';
    }
  });
})();