const CRUDCRUD_ID = '0634417fbc494b108c5c6a6dccd6a55d';
const API_URL = `https://crudcrud.com/api/${CRUDCRUD_ID}/users`;

const lista = document.getElementById('lista');
const loading = document.getElementById('loading');
const msg = document.getElementById('msg');
const buscar = document.getElementById('buscar');
const form = document.getElementById('user-form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const picture = document.getElementById('picture');
const errFirst = document.getElementById('err-firstName');
const errLast = document.getElementById('err-lastName');
const errEmail = document.getElementById('err-email');
const errPicture = document.getElementById('err-picture');
const submitBtn = document.getElementById('submit-btn');
const cancelEdit = document.getElementById('cancel-edit');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const gradesForm = document.getElementById('grades-form');
const gMath = document.getElementById('g-math');
const gHistory = document.getElementById('g-history');
const gScience = document.getElementById('g-science');
const gEnglish = document.getElementById('g-english');
const gArt = document.getElementById('g-art');
const clearGrades = document.getElementById('clear-grades');
const closeModal = document.getElementById('close-modal');

let users = [];
let editingId = null;
let activeUserId = null;
let inRequest = false;

function showMsg(text, isErr=false){
  msg.textContent = text || '';
  msg.style.color = isErr ? '#d00' : '#080';
  if(text && !isErr) setTimeout(()=> msg.textContent = '', 3000);
}

function checkResponse(response){
  if(!response.ok){
    throw new Error('Error HTTP ' + response.status);
  }
  return response;
}

function setLoading(active){
  inRequest = active;
  loading.style.display = active ? '' : 'none';
  validateForm();
  render();
}

function validateForm(){
  let ok = true;
  errFirst.textContent = firstName.value.trim() ? '' : 'Requerido';
  if(errFirst.textContent) ok = false;
  errLast.textContent = lastName.value.trim() ? '' : 'Requerido';
  if(errLast.textContent) ok = false;
  errEmail.textContent = /\S+@\S+\.\S+/.test(email.value) ? '' : 'Email inválido';
  if(errEmail.textContent) ok = false;
  try {
    new URL(picture.value);
    errPicture.textContent = '';
  } catch {
    errPicture.textContent = 'URL inválida';
    ok = false;
  }
  submitBtn.disabled = !ok || inRequest;
  return ok;
}

async function load(){
  inRequest = true;
  loading.style.display = '';
  try{
    const res = await fetch(API_URL);
    checkResponse(res);
    users = await res.json();
    render();
  }catch{
    showMsg('Error cargando usuarios. Revisa que el endpoint de CrudCrud siga activo.', true);
  } finally {
    inRequest = false;
    loading.style.display = 'none';
    validateForm();
  }
}

function render(){
  lista.innerHTML = '';
  const filtro = buscar.value.trim().toLowerCase();
  users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(filtro)).forEach(u => {
    const li = document.createElement('li');
    li.className = 'card';
    const gradesHtml = u.calificaciones ? Object.entries(u.calificaciones).map(([k,v]) => `${k}: ${v}`).join(' | ') : '<em>Sin calificaciones</em>';
    li.innerHTML = `<img class="avatar" src="${u.picture}" alt="">
    <div style="flex:1">
      <strong>${u.firstName} ${u.lastName}</strong><br>
      <small>${u.email}</small><br>
      <div>${gradesHtml}</div>
    </div>
    <div>
      <button class="edit" data-id="${u._id}" ${inRequest ? 'disabled' : ''}>Editar</button>
      <button class="delete" data-id="${u._id}" ${inRequest ? 'disabled' : ''}>Eliminar</button>
      <button class="grades" data-id="${u._id}" ${inRequest ? 'disabled' : ''}>Calificaciones</button>
    </div>`;
    lista.appendChild(li);
  });
}

function userPayloadFromForm(){
  return {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    picture: picture.value.trim()
  };
}

function resetUserForm(){
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Guardar';
  cancelEdit.hidden = true;
  validateForm();
}

buscar.addEventListener('input', render);
form.addEventListener('input', validateForm);

cancelEdit.addEventListener('click', resetUserForm);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!validateForm()) return;
  const payload = userPayloadFromForm();
  setLoading(true);
  if(editingId){
    const user = users.find(u => u._id === editingId);
    const backup = {...user};
    Object.assign(user, payload);
    render();
    try{
      const cleanPayload = user.calificaciones ? {...payload, calificaciones: user.calificaciones} : payload;
      const res = await fetch(API_URL + '/' + editingId, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(cleanPayload)
      });
      checkResponse(res);
      showMsg('Usuario actualizado');
      resetUserForm();
    }catch{
      Object.assign(user, backup);
      render();
      showMsg('Error actualizando usuario', true);
    } finally {
      setLoading(false);
    }
    return;
  }
  const optimistic = {_id:'opt-'+Date.now(), ...payload};
  users.unshift(optimistic);
  render();
  try{
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    checkResponse(res);
    const saved = await res.json();
    users = users.map(u => u._id === optimistic._id ? saved : u);
    showMsg('Usuario añadido correctamente');
    form.reset();
  }catch{
    users = users.filter(u => u._id !== optimistic._id);
    showMsg('Error añadiendo usuario', true);
  } finally {
    setLoading(false);
  }
});

lista.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if(e.target.classList.contains('edit')){
    const u = users.find(x => x._id === id);
    if(!u) return;
    editingId = id;
    firstName.value = u.firstName || '';
    lastName.value = u.lastName || '';
    email.value = u.email || '';
    picture.value = u.picture || '';
    submitBtn.textContent = 'Guardar cambios';
    cancelEdit.hidden = false;
    validateForm();
  }
  if(e.target.classList.contains('delete')){
    if(!confirm('¿Estás seguro?')) return;
    const backup = users.slice();
    users = users.filter(u => u._id !== id);
    setLoading(true);
    try{
      const res = await fetch(API_URL + '/' + id, { method: 'DELETE' });
      checkResponse(res);
      showMsg('Usuario eliminado');
    }catch{
      users = backup;
      showMsg('Error eliminando usuario', true);
    } finally {
      setLoading(false);
    }
  }
  if(e.target.classList.contains('grades')){
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

function closeGradesModal(){
  modal.className = 'modal-hidden';
  activeUserId = null;
  gradesForm.reset();
}

closeModal.addEventListener('click', closeGradesModal);

gradesForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!activeUserId) return;
  const grades = {
    'Matemáticas': Number(gMath.value),
    'Historia': Number(gHistory.value),
    'Ciencia': Number(gScience.value),
    'Inglés': Number(gEnglish.value),
    'Arte': Number(gArt.value)
  };
  for(const k of Object.keys(grades)){
    if(!Number.isFinite(grades[k]) || grades[k] < 0 || grades[k] > 10){
      showMsg('Calificaciones deben ser números entre 0 y 10', true);
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
  setLoading(true);
  try{
    const res = await fetch(API_URL + '/' + activeUserId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    checkResponse(res);
    u.calificaciones = grades;
    showMsg('Calificaciones guardadas');
    closeGradesModal();
  }catch{
    showMsg('Error guardando calificaciones', true);
  } finally {
    setLoading(false);
  }
});

clearGrades.addEventListener('click', async () => {
  if(!activeUserId) return;
  if(!confirm('¿Borrar calificaciones?')) return;
  const u = users.find(x => x._id === activeUserId);
  const payload = {
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    picture: u.picture || ''
  };
  setLoading(true);
  try{
    const res = await fetch(API_URL + '/' + activeUserId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    checkResponse(res);
    delete u.calificaciones;
    showMsg('Calificaciones borradas');
    closeGradesModal();
  }catch{
    showMsg('Error borrando calificaciones', true);
  } finally {
    setLoading(false);
  }
});

load();
