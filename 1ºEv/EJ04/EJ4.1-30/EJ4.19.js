(function() {
  const primerInfo = document.querySelector('.info');
  if (primerInfo && primerInfo.parentElement) {
    const imagen = primerInfo.parentElement.firstElementChild;
    console.log('EJ 19:', imagen);
  }
})();