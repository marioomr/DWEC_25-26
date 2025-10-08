(function() {
  const segundoEnlace = document.querySelector('.navegacion a:nth-child(2)');
  if (segundoEnlace && segundoEnlace.parentElement && segundoEnlace.parentElement.previousElementSibling) {
    segundoEnlace.parentElement.previousElementSibling.style.color = 'orange';
  }
})();