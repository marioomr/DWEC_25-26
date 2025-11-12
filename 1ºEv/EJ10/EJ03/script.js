(function() {
  const XML_PATH = 'personal.xml'; 

  const codigoInput = document.getElementById('codigo');
  const claveInput  = document.getElementById('clave');
  const codigoHint  = document.getElementById('codigoHint');
  const claveHint   = document.getElementById('claveHint');
  const accederBtn  = document.getElementById('acceder');
  const form        = document.getElementById('accesoForm');

  let agenteValido = false;
  let claveValida = false;
  let agenteXMLNode = null;

  function actualizarBoton() {
    accederBtn.disabled = !(agenteValido && claveValida);
  }

  function resetClaveState() {
    claveValida = false;
    claveHint.textContent = '';
    claveInput.value = '';
    actualizarBoton();
  }

  codigoInput.addEventListener('blur', function() {
    const codigo = codigoInput.value.trim();
    agenteValido = false;
    agenteXMLNode = null;
    codigoHint.textContent = '';

    if (!codigo) {
      codigoHint.textContent = 'Introduce un código de agente.';
      resetClaveState();
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', XML_PATH, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        const xml = xhr.responseXML;
        if (!xml) {
          codigoHint.textContent = 'Error leyendo el archivo XML.';
          resetClaveState();
          return;
        }

        const selector = 'agente[codigo="' + codigo + '"]';
        const agente = xml.querySelector(selector);

        if (agente) {
          const nombre = agente.querySelector('nombre').textContent.trim();
          codigoHint.textContent = 'Bienvenido, ' + nombre;
          agenteValido = true;
          agenteXMLNode = agente;
        } else {
          codigoHint.textContent = 'Código de agente no reconocido';
          agenteValido = false;
          agenteXMLNode = null;
          resetClaveState();
        }
      } else {
        codigoHint.textContent = 'Error al cargar ' + XML_PATH + ' (status ' + xhr.status + ')';
        resetClaveState();
      }
      actualizarBoton();
    };
    xhr.send();
  });

  codigoInput.addEventListener('input', function() {
    agenteValido = false;
    agenteXMLNode = null;
    codigoHint.textContent = '';
    resetClaveState();
  });

  claveInput.addEventListener('blur', function() {
    claveHint.textContent = '';

    if (!agenteValido || !agenteXMLNode) {
      claveHint.textContent = 'Primero valida un código de agente.';
      claveValida = false;
      actualizarBoton();
      return;
    }

    const introducida = claveInput.value.trim();
    const claveReal = agenteXMLNode.querySelector('clave').textContent.trim();

    if (introducida === claveReal) {
      claveHint.textContent = 'Clave correcta';
      claveValida = true;
    } else {
      claveHint.textContent = 'Clave incorrecta';
      claveValida = false;
    }
    actualizarBoton();
  });

  claveInput.addEventListener('input', function() {
    if (claveValida) {
      claveValida = false;
      claveHint.textContent = '';
      actualizarBoton();
    }
  });

  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    if (agenteValido && claveValida) {
      alert('Acceso concedido.');
    } else {
      alert('Acceso denegado.');
    }
  });

  actualizarBoton();
})();
