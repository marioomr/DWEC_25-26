(function () {
    const XML_PATH = 'recetas.xml';

    const baseSelect = document.getElementById('baseSelect');
    const mezclaSelect = document.getElementById('mezclaSelect');
    const sintetizarBtn = document.getElementById('sintetizarBtn');
    const resNombre = document.getElementById('resNombre');
    const resDescripcion = document.getElementById('resDescripcion');
    const historialEl = document.getElementById('historial');

    let recetas = [];
    let basesUnicas = new Set();
    let mezclasUnicas = new Set();

    function mostrarResultado(nombre, desc) {
        resNombre.textContent = nombre || '';
        resDescripcion.textContent = desc || '';
    }

    function poblarSelects() {
        function limpiar(select) {
            while (select.options.length > 1) select.remove(1);
        }
        limpiar(baseSelect);
        limpiar(mezclaSelect);

        const bases = Array.from(basesUnicas).sort((a, b) => a.localeCompare(b));
        const mezclas = Array.from(mezclasUnicas).sort((a, b) => a.localeCompare(b));

        bases.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.textContent = b;
            baseSelect.appendChild(opt);
        });

        mezclas.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            mezclaSelect.appendChild(opt);
        });
    }

    function cargarRecetas(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', XML_PATH, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                const xml = xhr.responseXML;
                if (!xml) {
                    alert('Error: respuesta no contiene XML válido.');
                    return;
                }
                const nodos = xml.querySelectorAll('aleacion');
                recetas = [];
                basesUnicas = new Set();
                mezclasUnicas = new Set();

                nodos.forEach(node => {
                    const baseNode = node.querySelector('base');
                    const mezclaNode = node.querySelector('mezcla');
                    const resultadoNode = node.querySelector('resultado');
                    const descNode = node.querySelector('descripcion');

                    if (!baseNode || !mezclaNode || !resultadoNode) return;

                    const r = {
                        base: baseNode.textContent.trim(),
                        mezcla: mezclaNode.textContent.trim(),
                        resultado: resultadoNode.textContent.trim(),
                        descripcion: descNode ? descNode.textContent.trim() : ''
                    };
                    recetas.push(r);
                    basesUnicas.add(r.base);
                    mezclasUnicas.add(r.mezcla);
                });

                poblarSelects();
                if (typeof callback === 'function') callback();
            } else {
                alert('Error cargando recetas.xml (status ' + xhr.status + ').');
            }
        };
        xhr.send();
    }
    function buscarReceta(base, mezcla) {
        if (!base || !mezcla) return null;
        base = base.trim();
        mezcla = mezcla.trim();
        for (let i = 0; i < recetas.length; i++) {
            const r = recetas[i];
            if ((r.base === base && r.mezcla === mezcla) || (r.base === mezcla && r.mezcla === base)) {
                return r;
            }
        }
        return null;
    }

    function anadirHistorial(base, mezcla, resultado) {
        const li = document.createElement('li');
        li.textContent = `${base} + ${mezcla} = ${resultado}`;
        li.setAttribute('data-base', base);
        li.setAttribute('data-mezcla', mezcla);
        li.style.cursor = 'pointer';
        li.addEventListener('click', function () {
            const b = li.getAttribute('data-base');
            const m = li.getAttribute('data-mezcla');
            selectOptionByValue(baseSelect, b);
            selectOptionByValue(mezclaSelect, m);
            const receta = buscarReceta(b, m);
            if (receta) {
                mostrarResultado(receta.resultado, receta.descripcion);
            } else {
                mostrarResultado('', 'Receta no encontrada en los datos cargados.');
            }
        });
        historialEl.appendChild(li);
    }

    function selectOptionByValue(selectEl, value) {
        for (let i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value === value) {
                selectEl.selectedIndex = i;
                return true;
            }
        }
        return false;
    }

    sintetizarBtn.addEventListener('click', function () {
        const base = baseSelect.value;
        const mezcla = mezclaSelect.value;

        if (!base || !mezcla) {
            mostrarResultado('', 'Selecciona ambos materiales.');
            return;
        }

        const receta = buscarReceta(base, mezcla);
        if (receta) {
            mostrarResultado(receta.resultado, receta.descripcion);
            anadirHistorial(receta.base, receta.mezcla, receta.resultado);
        } else {
            mostrarResultado('', 'Combinación no válida. No se ha producido ninguna aleación.');
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        cargarRecetas();
    });

})();
