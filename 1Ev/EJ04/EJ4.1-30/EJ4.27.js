(function() {
  const todasLasTarjetas = document.querySelectorAll('.card');
  const tarjetasNoPremium = Array.prototype.filter.call(todasLasTarjetas, function(tarjeta) {
    return !tarjeta.classList.contains('premium');
  });
  tarjetasNoPremium.forEach(function(tarjeta) {
    tarjeta.style.border = '2px dotted black';
  });
})();