(function () {
    let fragmentoActual = null;
    let letraSeleccionada = null;
    let intentos = 0;

    const btnEmpezar = document.getElementById('empezar');
    const textoEl = document.getElementById('texto');
    const pistaEl = document.getElementById('pista');
    const intentosEl = document.getElementById('intentos');
    const alfabetoEl = document.getElementById('alfabeto');

    function actualizarIntentos() {
        intentosEl.textContent = `Intentos: ${intentos}`;
    }

    function flashRojo(el) {
        if (!el || !el.style) return;
        const orig = el.style.transition;
        el.style.transition = 'background-color 0.15s';
        const prev = el.style.backgroundColor;
        el.style.backgroundColor = 'salmon';
        setTimeout(() => {
            el.style.backgroundColor = prev || '';
            el.style.transition = orig || '';
        }, 300);
    }
    function cargarFragmento(ruta) {
        if (!ruta || ruta.toLowerCase() === 'null' || ruta.trim() === '') {
            fragmentoActual = null;
            textoEl.textContent = '¡Has completado todos los fragmentos! Gracias por jugar.';
            pistaEl.textContent = '';
            letraSeleccionada = null;
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', ruta, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                const xml = xhr.responseXML;
                if (!xml) {
                    textoEl.textContent = 'Error: la respuesta no contiene XML válido.';
                    pistaEl.textContent = '';
                    fragmentoActual = null;
                    return;
                }

                const texto = (xml.querySelector('texto') && xml.querySelector('texto').textContent) || '';
                const pista = (xml.querySelector('pista') && xml.querySelector('pista').textContent) || '';
                const selector = (xml.querySelector('selector_solucion') && xml.querySelector('selector_solucion').textContent) || '';
                const letra = (xml.querySelector('letra_clave') && xml.querySelector('letra_clave').textContent) || null;
                const siguiente = (xml.querySelector('siguiente_fragmento') && xml.querySelector('siguiente_fragmento').textContent) || null;

                fragmentoActual = {
                    texto: texto.trim(),
                    pista: pista.trim(),
                    selector_solucion: selector.trim(),
                    letra_clave: letra ? letra.trim().toUpperCase() : null,
                    siguiente: siguiente ? siguiente.trim() : null
                };

                textoEl.textContent = fragmentoActual.texto || '(sin texto)';
                pistaEl.textContent = fragmentoActual.pista || '(sin pista)';
                letraSeleccionada = null;

                const marcas = document.querySelectorAll('.letra.seleccionada');
                marcas.forEach(n => n.classList.remove('seleccionada'));
            } else {
                textoEl.textContent = `Error cargando ${ruta} (status ${xhr.status})`;
                pistaEl.textContent = '';
                fragmentoActual = null;
            }
        };
        xhr.send();
    }

    btnEmpezar.addEventListener('click', function () {
        intentos = 0;
        actualizarIntentos();
        cargarFragmento('fragmento1.xml');
    });

    document.addEventListener('click', function (ev) {
        const t = ev.target;

        if (t.classList && t.classList.contains('letra')) {
            const letra = (t.getAttribute('data-letra') || t.textContent || '').toUpperCase().trim();
            if (!letra) return;
            const prev = document.querySelectorAll('.letra.seleccionada');
            prev.forEach(n => n.classList.remove('seleccionada'));
            t.classList.add('seleccionada');
            letraSeleccionada = letra;
            return;
        }

        if (!fragmentoActual) return;

        if (t.closest && (t.closest('#alfabeto') || t.closest('#empezar'))) {
            return;
        }

        let coincide = false;
        try {
            if (fragmentoActual.selector_solucion && t.matches) {
                coincide = t.matches(fragmentoActual.selector_solucion);
            }
        } catch (e) {
            coincide = false;
        }

        if (coincide) {
            const letraNecesaria = fragmentoActual.letra_clave;
            if (letraNecesaria && letraSeleccionada === letraNecesaria) {
                textoEl.textContent = '¡Correcto! Cargando siguiente fragmento...';
                pistaEl.textContent = '';
                setTimeout(() => {
                    if (fragmentoActual.siguiente && fragmentoActual.siguiente.toLowerCase() !== 'null' && fragmentoActual.siguiente.trim() !== '') {
                        cargarFragmento(fragmentoActual.siguiente);
                    } else {
                        cargarFragmento(null);
                    }
                }, 400);
            } else {
                intentos++;
                actualizarIntentos();
                flashRojo(t);
            }
        } else {
            intentos++;
            actualizarIntentos();
            flashRojo(t);
        }
    });

})();
