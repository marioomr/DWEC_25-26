const inputFiltro = document.getElementById('filtro');
const listaCiudades = document.getElementById('lista-ciudades');

function filtrarPorPais(texto) {
  const items = listaCiudades.querySelectorAll('li');
  const textoLower = texto.toLowerCase();

  items.forEach(li => {
    const pais = li.getAttribute('data-pais').toLowerCase();
    if (pais.includes(textoLower)) {
      li.style.display = '';
    } else {
      li.style.display = 'none'; 
    }
  });
}

inputFiltro.addEventListener('input', (e) => {
  filtrarPorPais(e.target.value.trim());
});
