document.getElementById('btn-ordenar').addEventListener('click', () => {
    const ul = document.getElementById('lista-desordenada');
    const nodeList = ul.querySelectorAll('li');

    const arrayLi = Array.from(nodeList);

    arrayLi.sort((a, b) => a.textContent.localeCompare(b.textContent));

    ul.innerHTML = '';

    arrayLi.forEach(li => ul.appendChild(li));
});
