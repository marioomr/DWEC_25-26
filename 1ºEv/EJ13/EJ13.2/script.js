const API_URL = 'https://crudcrud.com/api/c629bac64a364e02a59092bfe10d4dbc/users';

const msg = document.getElementById('msg');
const lista = document.getElementById('lista');
const loading = document.getElementById('loading');
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

let usersCache = [];
let editingId = null;
let inRequest = false;

function showMsg(text, isError=false){
  msg.textContent = text;
  msg.style.color = isError ? '#d00' : '#080';
  if(!isError && text) setTimeout(()=> msg.textContent = '', 3000);
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

async function getUsers(){
  loading.style.display = '';
  try{
    const res = await fetch(API_URL);
    const data = await res.json();
    usersCache = data;
    renderUsers(usersCache);
    loading.style.display = 'none';
  }catch(e){
    loading.style.display = 'none';
    showMsg('Error cargando usuarios', true);
  }
}

function renderUsers(list){
  lista.innerHTML = '';
  const filtro = buscar.value.trim().toLowerCase();
  const filtered = list.filter(u => {
    const name = (u.firstName + ' ' + u.lastName).toLowerCase();
    return name.includes(filtro);
  });
  filtered.forEach(u => {
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `<img class="avatar" src="${u.picture}" alt="">
      <div style="flex:1">
        <strong>${u.firstName} ${u.lastName}</strong><br>
        <small>${u.email}</small>
      </div>
      <div>
        <button class="edit" data-id="${u._id}">Editar</button>
        <button class="delete" data-id="${u._id}">Eliminar</button>
      </div>`;
    lista.appendChild(li);
  });
}

buscar.addEventListener('input', () => renderUsers(usersCache));

form.addEventListener('input', validateForm);

cancelEdit.addEventListener('click', () => {
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Guardar';
  cancelEdit.hidden = true;
  validateForm();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!validateForm()) return;
  const payload = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    picture: picture.value.trim()
  };
  inRequest = true;
  validateForm();
  if(editingId){
    const prev = usersCache.find(u => u._id === editingId);
    const prevCopy = {...prev};
    Object.assign(prev, payload);
    renderUsers(usersCache);
    try{
      await fetch(API_URL + '/' + editingId, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      showMsg('Usuario actualizado');
      editingId = null;
      form.reset();
      submitBtn.textContent = 'Guardar';
      cancelEdit.hidden = true;
    }catch{
      Object.assign(prev, prevCopy);
      showMsg('Error actualizando', true);
      renderUsers(usersCache);
    } finally {
      inRequest = false;
      validateForm();
    }
  } else {
    const optimistic = {_id:'opt-'+Date.now(), ...payload};
    usersCache.unshift(optimistic);
    renderUsers(usersCache);
    try{
      const res = await fetch(API_URL, {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const saved = await res.json();
      usersCache = usersCache.map(u => u._id === optimistic._id ? saved : u);
      showMsg('Usuario añadido');
      form.reset();
      renderUsers(usersCache);
    }catch{
      usersCache = usersCache.filter(u => u._id !== optimistic._id);
      showMsg('Error añadiendo usuario', true);
      renderUsers(usersCache);
    } finally {
      inRequest = false;
      validateForm();
    }
  }
});

lista.addEventListener('click', async (e) => {
  if(e.target.classList.contains('edit')){
    const id = e.target.dataset.id;
    const u = usersCache.find(x => x._id === id);
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
    const id = e.target.dataset.id;
    if(!confirm('¿Estás seguro?')) return;
    const removed = usersCache.filter(u => u._id !== id);
    const backup = usersCache.slice();
    usersCache = removed;
    renderUsers(usersCache);
    try{
      await fetch(API_URL + '/' + id, { method: 'DELETE' });
      showMsg('Usuario eliminado');
    }catch{
      usersCache = backup;
      renderUsers(usersCache);
      showMsg('Error eliminando', true);
    }
  }
});

getUsers();
