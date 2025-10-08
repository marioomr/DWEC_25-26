(function() {
  const cards = document.querySelectorAll('.card');
  const tercerCard = cards[2]; 
  if(tercerCard){
    const h2React = tercerCard.querySelector('h2');
    const parrafoOculto = tercerCard.querySelector('.oculto');
    if (h2React && parrafoOculto) {
      h2React.addEventListener('click', function() {
        parrafoOculto.classList.remove('oculto');
      });
    }
  }
})();