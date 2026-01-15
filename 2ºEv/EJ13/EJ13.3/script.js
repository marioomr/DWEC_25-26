const API_URL = 'https://crudcrud.com/api/c629bac64a364e02a59092bfe10d4dbc/users';

const lista = document.getElementById('lista');
const loading = document.getElementById('loading');
const msg = document.getElementById('msg');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const gradesForm = document.getElementById('grades-form');
const gMath = document.getElementById('g-math');
const gHistory = document.getElementById('g-history');
const gScience = document.getElementById('g-science');
const gEnglish = document.getElementById('g-english');
const gArt = document.getElementById('g-art');
const saveGrades = document.getElementById('save-grades');
const clearGrades = document.getElementById('clear-grades');
const closeModal = document.getElementById('close-modal');

let users = [];
let activeUserId = null;

function showMsg(text, isErr=false){
  msg.textContent = text || '';
  msg.style.color = isErr ? '#d00' : '#080';
  if(text && !isErr) setTimeout(()=> msg.textContent = '', 3000);
}

async function load(){
  loading.style.display = '';
  try{
    const res = await fetch(API_URL);
    users = await res.json();
    render();
    loading.style.display = 'none';
  }catch{
    loading.style.display = 'none';
    showMsg('Error cargando usuarios', true);
  }
}

function render(){
  lista.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.className = 'card';
    const gradesHtml = u.calificaciones ? Object.entries(u.calificaciones).map(([k,v]) => `${k}: ${v}`).join(' | ') : '<em>Sin calificaciones</em>';
    li.innerHTML = `<div>
      <strong>${u.firstName} ${u.lastName}</strong><br>
      <small>${u.email}</small><br>
      <div>${gradesHtml}</div>
    </div>
    <div>
      <button class="grades" data-id="${u._id}">Calificaciones</button>
    </div>`;
    lista.appendChild(li);
  });
}

lista.addEventListener('click', (e) => {
  if(e.target.classList.contains('grades')){
    const id = e.target.dataset.id;
    openGradesModal(id);
  }
});

function openGradesModal(id){
  activeUserId = id;
  const u = users.find(x => x._id === id);
  modalTitle.textContent = `Calificaciones de ${u.firstName} ${u.lastName}`;
  const c = u.calificaciones || {};
  gMath.value = c['Matemáticas'] ?? '';
  gHistory.value = c['Historia'] ?? '';
  gScience.value = c['Ciencia'] ?? '';
  gEnglish.value = c['Inglés'] ?? '';
  gArt.value = c['Arte'] ?? '';
  modal.className = '';
}

closeModal.addEventListener('click', () => {
  modal.className = 'modal-hidden';
  activeUserId = null;
  gradesForm.reset();
});

gradesForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!activeUserId) return;
  const grades = {
    'Matemáticas': Number(gMath.value) || 0,
    'Historia': Number(gHistory.value) || 0,
    'Ciencia': Number(gScience.value) || 0,
    'Inglés': Number(gEnglish.value) || 0,
    'Arte': Number(gArt.value) || 0
  };
  for(const k of Object.keys(grades)){
    if(isNaN(grades[k]) || grades[k] < 0 || grades[k] > 10){
      showMsg('Calificaciones deben ser 0-10', true);
      return;
    }
  }
  const u = users.find(x => x._id === activeUserId);
  const payload = {
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    picture: u.picture || '',
    calificaciones: grades
  };
  try{
    await fetch(API_URL + '/' + activeUserId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    u.calificaciones = grades;
    render();
    showMsg('Calificaciones guardadas');
    modal.className = 'modal-hidden';
  }catch{
    showMsg('Error guardando calificaciones', true);
  }
});

clearGrades.addEventListener('click', async () => {
  if(!activeUserId) return;
  if(!confirm('Borrar calificaciones?')) return;
  const u = users.find(x => x._id === activeUserId);
  const payload = {
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    picture: u.picture || ''
  };
  try{
    await fetch(API_URL + '/' + activeUserId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    delete u.calificaciones;
    render();
    showMsg('Calificaciones borradas');
    modal.className = 'modal-hidden';
  }catch{
    showMsg('Error borrando calificaciones', true);
  }
});

load();
