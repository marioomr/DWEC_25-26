(function() {
  const botonPremium = document.getElementById('btn-info-premium');
  if (botonPremium) {
    botonPremium.addEventListener('click', function() {
      alert('Información exclusiva para miembros premium');
    });
  }
})();