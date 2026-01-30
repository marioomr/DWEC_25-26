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
      entrada.mes,
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
      eventos.push(e);
    }
  });

  eventos.sort((a, b) => a.fechaObj - b.fechaObj);

  const contenedor = document.getElementById("eventos");

  eventos.forEach(evento => {

    const div = document.createElement("div");
    div.className = "evento";

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
      if (!isNaN(dias)) {
        evento.fechaObj = posponerEvento(evento.fechaObj, dias);
        inputDias.value = "";
        actualizar();
      }
    });

    div.append(
      titulo,
      descripcion,
      fechaTexto,
      contador,
      inputDias,
      boton
    );

    contenedor.appendChild(div);

    function actualizar() {
      fechaTexto.textContent =
        "Fecha: " + evento.fechaObj.toLocaleString();

      const ahora = Date.now();
      const diferencia = evento.fechaObj.getTime() - ahora;

      if (diferencia <= 0) {
        contador.textContent = "Evento finalizado";
        div.classList.add("finalizado");
        return;
      }

      div.classList.remove("finalizado");

      const totalSeg = Math.floor(diferencia / 1000);

      const dias = Math.floor(totalSeg / 86400);
      const horas = Math.floor((totalSeg % 86400) / 3600);
      const minutos = Math.floor((totalSeg % 3600) / 60);
      const segundos = totalSeg % 60;

      contador.textContent =
        `${dias} : ${horas} : ${minutos} : ${segundos}`;
    }

    actualizar();
    setInterval(actualizar, 1000);
  });
}

cargarEventos();