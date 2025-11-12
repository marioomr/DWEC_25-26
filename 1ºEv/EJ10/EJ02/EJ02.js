function cargarXML(url) {
  return new Promise(function(resolve, reject){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject({status: xhr.status, url: url});
        }
      }
    };
    xhr.send();
  });
}

const tituloEl = () => document.getElementById('doc-titulo');
const fechaEl  = () => document.getElementById('doc-fecha');
const imgEl    = () => document.getElementById('doc-img');
const descEl   = () => document.getElementById('doc-desc');
const msgEl    = () => document.getElementById('mensaje');
const visitedUl= () => document.getElementById('visitados');
const btnPrev  = () => document.getElementById('btn-prev');
const btnNext  = () => document.getElementById('btn-next');
const btnUlt   = () => document.getElementById('btn-ultimo');
const btnClear = () => document.getElementById('limpiar-hist');

let currentFile = 'documento_ultimo.xml';

function renderDocumentoFromXML(xml, file) {
  const doc = xml.querySelector('documento');
  if (!doc) {
    showMessage('XML mal formado: no se encontró &lt;documento&gt;', 'danger');
    return;
  }

  const titulo = doc.querySelector('titulo')?.textContent ?? 'Sin título';
  const fecha  = doc.querySelector('fecha')?.textContent ?? '';
  const imagen = doc.querySelector('imagen')?.textContent ?? '';
  const descripcion = doc.querySelector('descripcion')?.textContent ?? '';
  const siguiente = doc.querySelector('siguiente')?.textContent ?? 'null';
  const anterior  = doc.querySelector('anterior')?.textContent ?? 'null';

  tituloEl().textContent = titulo;
  fechaEl().textContent = fecha;
  descEl().textContent = descripcion;

  if (imagen) {
    imgEl().src = imagen;
    imgEl().alt = titulo;
    imgEl().onerror = function(){ this.src = 'img/placeholder.png'; };
  } else {
    imgEl().src = 'img/placeholder.png';
    imgEl().alt = 'Sin imagen';
  }

  btnPrev().disabled = (anterior === 'null');
  btnNext().disabled = (siguiente === 'null');
  btnPrev().dataset.file = anterior;
  btnNext().dataset.file = siguiente;

  currentFile = file;

  addVisitedEntry(titulo, fecha, file);
  showMessage('', ''); 
}

function addVisitedEntry(titulo, fecha, file) {
  const ul = visitedUl();
  if (!ul) return;
  const exists = Array.from(ul.children).some(li => li.dataset.file === file);
  if (exists) return;
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${titulo} (${fecha})`;
  li.dataset.file = file;
  li.style.cursor = 'pointer';
  ul.insertBefore(li, ul.firstChild);
}

function showMessage(text, type='info') {
  const el = msgEl();
  if (!text) { el.innerHTML = ''; return; }
  const cls = type ? `alert alert-${type}` : 'alert alert-info';
  el.innerHTML = `<div class="${cls}">${text}</div>`;
}

function cargarDocumento(file) {
  showMessage('Cargando ' + file + '...', 'secondary');
  return cargarXML(file)
    .then(xml => {
      renderDocumentoFromXML(xml, file);
    })
    .catch(err => {
      showMessage(`Error ${err.status}: no se pudo cargar ${err.url}`, 'danger');
      console.error('Error cargando XML', err);
    });
}

function initDelegacionHistorial() {
  const ul = visitedUl();
  ul.addEventListener('click', function(e){
    const li = e.target.closest('li');
    if (!li) return;
    const file = li.dataset.file;
    if (file) cargarDocumento(file);
  });
}

function initUI() {
  btnPrev().addEventListener('click', function(){
    const file = this.dataset.file;
    if (file && file !== 'null') cargarDocumento(file);
  });
  btnNext().addEventListener('click', function(){
    const file = this.dataset.file;
    if (file && file !== 'null') cargarDocumento(file);
  });
  btnUlt().addEventListener('click', function(){
    cargarDocumento('documento_ultimo.xml');
  });
  btnClear().addEventListener('click', function(){
    const ul = visitedUl();
    ul.innerHTML = '';
    showMessage('Historial limpiado', 'info');
  });
}

document.addEventListener('DOMContentLoaded', function(){
  initUI();
  initDelegacionHistorial();
  cargarDocumento('documento_ultimo.xml');
});
