const usuarios = [
    { nombre: 'Ana', edad: 25 },
    { nombre: 'Luis', edad: 30 },
    { nombre: 'María', edad: 28 },
    { nombre: 'Carlos', edad: 35 }
];

function construirTabla(arrayObjetos) {
    const contenedor = document.getElementById('contenedor-tabla');

    contenedor.innerHTML = '';

    const fragment = document.createDocumentFragment();

    const tabla = document.createElement('table');


    const thead = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');

    const claves = Object.keys(arrayObjetos[0]);
    claves.forEach(clave => {
        const th = document.createElement('th');
        th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
        filaEncabezado.appendChild(th);
    });
    thead.appendChild(filaEncabezado);
    tabla.appendChild(thead);


    const tbody = document.createElement('tbody');

    arrayObjetos.forEach(obj => {
        const fila = document.createElement('tr');
        claves.forEach(clave => {
            const td = document.createElement('td');
            td.textContent = obj[clave];
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    fragment.appendChild(tabla);

    contenedor.appendChild(fragment);
}

construirTabla(usuarios);
