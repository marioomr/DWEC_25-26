async function cargarLogs() {
  try {
    const response = await fetch('logs.txt');
    if (!response.ok) throw new Error('No se pudo cargar logs.txt');

    const texto = await response.text();
    const lineas = texto.split('\n');

    const tbody = document.getElementById('tablaLogs');
    const totalDiv = document.getElementById('total');

    let consumoTotal = 0;
    let registros = [];

    lineas.forEach(linea => {
      if (!linea.trim()) return;

      linea = linea.trim();

      const idInicio = linea.indexOf('ID:') + 3;
      const idFin = linea.indexOf(' |');
      const idCompleto = linea.slice(idInicio, idFin);
      const idSesion = idCompleto.slice(idCompleto.indexOf('-') + 1);

      const userMatch = linea.match(/user:\s*([^|]+)/i);
      const usuario = userMatch[1].trim().toLowerCase();

      const consumoMatch = linea.match(/consumo:\s*([\deE.+-]+)\s*bytes/i);
      const bytes = parseFloat(consumoMatch[1]);
      const mb = bytes / (1024 * 1024);

      const mbFixed = parseFloat(mb.toFixed(2));
      consumoTotal += mbFixed;

      const esError = linea.includes('ERROR');

      registros.push({
        idSesion,
        usuario,
        mb: mbFixed,
        esError
      });
    });

    registros.forEach(reg => {
      const tr = document.createElement('tr');
      if (reg.esError) tr.classList.add('error');

      tr.innerHTML = `
        <td>${reg.idSesion}</td>
        <td>${reg.usuario}</td>
        <td>${reg.mb.toFixed(2)}</td>
      `;

      tbody.appendChild(tr);
    });

    const totalFormateado = parseFloat(consumoTotal.toFixed(2));
    totalDiv.innerHTML = `Consumo total: <span>${totalFormateado.toFixed(2)} MB</span>`;

  } catch (error) {
    console.error(error);
    alert('Error cargando los logs: ' + error.message);
    document.getElementById('total').innerHTML = 'Error: No se pudieron cargar los datos';
  }
}

cargarLogs();