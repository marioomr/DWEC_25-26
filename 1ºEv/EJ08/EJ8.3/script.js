let itinerario = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarFiltros();
  renderActividades(actividades);
  document.getElementById("formFiltros").addEventListener("input", aplicarFiltros);
  document.getElementById("reservaForm").addEventListener("submit", validarFormulario);
});

function cargarFiltros() {
  const destinos = ["Todos", ...new Set(actividades.map(a => a.destino))];
  document.getElementById("destino").innerHTML = destinos.map(d => `<option>${d}</option>`).join("");

  const tipos = [...new Set(actividades.map(a => a.tipo))];
  document.getElementById("tipos").innerHTML = tipos.map(t => 
    `<label><input type="checkbox" value="${t}" class="form-check-input me-1">${t}</label><br>`
  ).join("");

  document.getElementById("precio").addEventListener("input", e => {
    document.getElementById("valRango").textContent = e.target.value;
    aplicarFiltros();
  });
}

function aplicarFiltros() {
  const dest = document.getElementById("destino").value;
  const tiposSel = [...document.querySelectorAll('#tipos input:checked')].map(c => c.value);
  const max = parseFloat(document.getElementById("precio").value);

  let filtradas = actividades
    .filter(a => dest === "Todos" || a.destino === dest)
    .filter(a => tiposSel.length === 0 || tiposSel.includes(a.tipo))
    .filter(a => a.precio <= max);

  renderActividades(filtradas);
}

function renderActividades(lista) {
  const cont = document.getElementById("listaActividades");
  cont.innerHTML = "";
  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay actividades disponibles.</p>";
    return;
  }

  lista.forEach(a => {
    cont.innerHTML += `
      <div class="col-md-6 mb-3">
        <div class="card">
          <img src="${a.imagen}" class="card-img-top">
          <div class="card-body">
            <h5>${a.nombre}</h5>
            <p>${a.destino} - ${a.tipo}</p>
            <p><strong>${a.precio} €</strong> | ${a.duracionHoras}h</p>
            <button class="btn btn-success btn-sm" onclick="añadir(${a.id})">Añadir</button>
          </div>
        </div>
      </div>`;
  });
}

function añadir(id) {
  const act = actividades.find(a => a.id === id);
  if (!itinerario.includes(act)) itinerario.push(act);
  actualizarResumen();
}

function quitar(id) {
  itinerario = itinerario.filter(a => a.id !== id);
  actualizarResumen();
}

function actualizarResumen() {
  const lista = document.getElementById("itinerario");
  lista.innerHTML = itinerario.map(a => 
    `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${a.nombre} - ${a.precio}€
      <button class="btn btn-danger btn-sm" onclick="quitar(${a.id})">X</button>
    </li>`
  ).join("");

  const total = itinerario.reduce((s,a)=>s+a.precio,0);
  const dur = itinerario.reduce((s,a)=>s+a.duracionHoras,0);
  document.getElementById("total").textContent = total;
  document.getElementById("duracion").textContent = dur;
  document.getElementById("numAct").textContent = itinerario.length;

  const seguroDiv = document.getElementById("seguroDiv");
  const seguro = document.getElementById("seguro");
  if (total > 1000) {
    seguroDiv.style.display = "block";
    seguro.required = true;
  } else {
    seguroDiv.style.display = "none";
    seguro.required = false;
  }
}

function validarFormulario(e) {
  e.preventDefault();
  const errores = [];
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const fecha = document.getElementById("fecha").value;
  const codigo = document.getElementById("codigo").value.trim();
  const seguro = document.getElementById("seguro").checked;
  const total = parseFloat(document.getElementById("total").textContent);

  if (itinerario.length === 0) errores.push("El itinerario no puede estar vacío.");
  if (!nombre) errores.push("Introduce tu nombre completo.");
  if (!email.includes("@")) errores.push("Email no válido.");
  if (!fecha || new Date(fecha) < new Date()) errores.push("La fecha no puede ser pasada.");
  if (total > 1000 && !seguro) errores.push("Debes contratar el seguro de viaje.");
  if (codigo && !/^[A-Z]{4}\d{2}$/.test(codigo)) errores.push("Código de descuento inválido (ej: ABCD25).");

  const divErr = document.getElementById("errores");
  if (errores.length > 0) {
    divErr.innerHTML = errores.join("<br>");
  } else {
    divErr.innerHTML = "";
    alert("Reserva confirmada correctamente ✅");
    e.target.reset();
    itinerario = [];
    actualizarResumen();
  }
}
