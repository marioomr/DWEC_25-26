function crearFecha(entrada) {
  let fecha;

  if (typeof entrada === "number") {
    fecha = new Date(entrada);
  }
  else if (typeof entrada === "string") {
    fecha = new Date(entrada);
  }
  else if (
    typeof entrada === "object" &&
    entrada !== null &&
    "año" in entrada &&
    "mes" in entrada &&
    "dia" in entrada
  ) {
    fecha = new Date(
      entrada.año,
      entrada.mes - 1,
      entrada.dia
    );
  }

  if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
    return null;
  }

  return fecha;
}

function posponerEvento(fecha, dias) {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
}

async function cargarEventos() {
  const response = await fetch("eventos.json");
  const datos = await response.json();

  const eventos = [];

  datos.forEach(e => {
    const fecha = crearFecha(e.fecha);
    if (fecha) {
      e.fechaObj = fecha;
      e.intervaloId = null;
      eventos.push(e);
    }
  });

  eventos.sort((a, b) => a.fechaObj - b.fechaObj);

  const contenedor = document.getElementById("eventos");

  function renderizarEvento(evento) {
    let eventoDiv = document.getElementById("evento-" + eventos.indexOf(evento));
    
    if (!eventoDiv) {
      eventoDiv = document.createElement("div");
      eventoDiv.id = "evento-" + eventos.indexOf(evento);
      eventoDiv.className = "evento";
      contenedor.appendChild(eventoDiv);
    }

    eventoDiv.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = evento.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = evento.descripcion;

    const fechaTexto = document.createElement("p");

    const contador = document.createElement("div");
    contador.className = "contador";

    const inputDias = document.createElement("input");
    inputDias.type = "number";
    inputDias.placeholder = "Días a posponer";

    const boton = document.createElement("button");
    boton.textContent = "Posponer";

    boton.addEventListener("click", () => {
      const dias = Number(inputDias.value);
      if (!isNaN(dias) && dias > 0) {
        if (evento.intervaloId) {
          clearInterval(evento.intervaloId);
          evento.intervaloId = null;
        }
        evento.fechaObj = posponerEvento(evento.fechaObj, dias);
        inputDias.value = "";
        renderizarEvento(evento);
      }
    });

    eventoDiv.append(
      titulo,
      descripcion,
      fechaTexto,
      contador,
      inputDias,
      boton
    );

    function actualizar() {
      fechaTexto.textContent =
        "Fecha: " + evento.fechaObj.toLocaleString();

      const ahora = Date.now();
      const diferencia = evento.fechaObj.getTime() - ahora;

      if (diferencia <= 0) {
        contador.textContent = "FINALIZADO";
        eventoDiv.classList.add("finalizado");
        return;
      }

      eventoDiv.classList.remove("finalizado");

      const totalSeg = Math.floor(diferencia / 1000);

      const dias = Math.floor(totalSeg / 86400);
      const horas = Math.floor((totalSeg % 86400) / 3600);
      const minutos = Math.floor((totalSeg % 3600) / 60);
      const segundos = totalSeg % 60;

      contador.textContent =
        `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }

    actualizar();
    
    if (evento.intervaloId) {
      clearInterval(evento.intervaloId);
    }
    
    evento.intervaloId = setInterval(actualizar, 1000);
  }

  eventos.forEach(renderizarEvento);
}

cargarEventos();