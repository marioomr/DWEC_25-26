(function() {
  const enlacesNav = document.querySelectorAll('.navegacion a');
  Array.prototype.forEach.call(enlacesNav, function(enlace) {
    enlace.setAttribute('data-tipo', 'enlace-nav');
  });
})();