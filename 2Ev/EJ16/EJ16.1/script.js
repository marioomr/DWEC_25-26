async function cargarLogs() {
try {
const response = await fetch('logs.txt');
if (!response.ok) throw new Error('No se pudo cargar logs.txt');


const texto = await response.text();
const lineas = texto.split('\n');


const tbody = document.getElementById('tablaLogs');
const totalDiv = document.getElementById('total');


let consumoTotal = 0;


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
const bytes = Number(consumoMatch[1]);
const mb = bytes / (1024 * 1024);


const mbFixed = Number(mb.toFixed(2));
consumoTotal += mbFixed;


const esError = linea.includes('ERROR');


const tr = document.createElement('tr');
if (esError) tr.classList.add('error');


tr.innerHTML = `
<td>${idSesion}</td>
<td>${usuario}</td>
<td>${mbFixed.toFixed(2)}</td>
`;


tbody.appendChild(tr);
});


totalDiv.textContent = `Consumo total: ${consumoTotal.toFixed(2)} MB`;


} catch (error) {
console.error(error);
alert('Error cargando los logs');
}
}


cargarLogs();