const btnGenerar = document.getElementById('btnGenerar');
const numParrafosInput = document.getElementById('numParrafos');
const resultadoDiv = document.getElementById('resultado');

const textoLorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

btnGenerar.addEventListener('click', () => {
    const cantidad = parseInt(numParrafosInput.value);
    if (isNaN(cantidad) || cantidad < 1) {
        alert('Por favor ingresa un número válido mayor que 0.');
        return;
    }

    resultadoDiv.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < cantidad; i++) {
        const p = document.createElement('p');
        p.textContent = textoLorem;
        fragment.appendChild(p);
    }

    resultadoDiv.appendChild(fragment);
});
