


const CRUDCRUD_ID = '0634417fbc494b108c5c6a6dccd6a55d';
const API_URL = `https://crudcrud.com/api/${CRUDCRUD_ID}/users`;

const initialUsers = [
  {"firstName":"Alice","lastName":"Smith","email":"alice.smith@example.com","picture":"https://randomuser.me/api/portraits/women/1.jpg"},
  {"firstName":"Bob","lastName":"Johnson","email":"bob.johnson@example.com","picture":"https://randomuser.me/api/portraits/men/2.jpg"},
  {"firstName":"Charlie","lastName":"Brown","email":"charlie.brown@example.com","picture":"https://randomuser.me/api/portraits/men/3.jpg"},
  {"firstName":"Diana","lastName":"Prince","email":"diana.prince@example.com","picture":"https://randomuser.me/api/portraits/women/4.jpg"},
  {"firstName":"Eve","lastName":"Adams","email":"eve.adams@example.com","picture":"https://randomuser.me/api/portraits/women/5.jpg"},
  {"firstName":"Frank","lastName":"White","email":"frank.white@example.com","picture":"https://randomuser.me/api/portraits/men/6.jpg"},
  {"firstName":"Grace","lastName":"Taylor","email":"grace.taylor@example.com","picture":"https://randomuser.me/api/portraits/women/7.jpg"},
  {"firstName":"Henry","lastName":"Moore","email":"henry.moore@example.com","picture":"https://randomuser.me/api/portraits/men/8.jpg"},
  {"firstName":"Ivy","lastName":"Clark","email":"ivy.clark@example.com","picture":"https://randomuser.me/api/portraits/women/9.jpg"},
  {"firstName":"Jack","lastName":"Lewis","email":"jack.lewis@example.com","picture":"https://randomuser.me/api/portraits/men/10.jpg"}
];

const mensajes = document.getElementById('mensajes');
const btnCargarInicial = document.getElementById('btn-cargar-inicial');
const tablaBody = document.querySelector('#tabla-usuarios tbody');
const loading = document.getElementById('loading');
const form = document.getElementById('user-form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const picture = document.getElementById('picture');
const submitBtn = document.getElementById('submit-btn');
const cancelEdit = document.getElementById('cancel-edit');

let editingId = null;

function checkResponse(response){
  if(!response.ok){
    throw new Error('Error HTTP ' + response.status);
  }
  return response;
}

function showMessage(text, isError){
  mensajes.textContent = text || '';
  mensajes.style.color = isError ? '#d00' : '#080';
  if(text && !isError){
    setTimeout(()=>{ mensajes.textContent = '' },3000);
  }
}

function fetchUsers(){
  loading.style.display = '';
  fetch(API_URL).then(checkResponse).then(r => r.json()).then(data => {
    loading.style.display = 'none';
    renderUsers(data);
  }).catch(err => {
    loading.style.display = 'none';
    showMessage('Error cargando usuarios. Revisa que el endpoint de CrudCrud siga activo.', true);
  });
}

function renderUsers(users){
  tablaBody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><img class="avatar" src="${u.picture}" alt=""></td>
      <td>${u.firstName} ${u.lastName}</td>
      <td>${u.email}</td>
      <td>
        <button data-id="${u._id}" class="edit">Editar</button>
        <button data-id="${u._id}" class="delete">Eliminar</button>
      </td>`;
    tablaBody.appendChild(tr);
  });
}

function uploadInitialUsers(users){
  showMessage('Subiendo usuarios iniciales...');
  Promise.all(users.map(user =>
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(user)
    }).then(checkResponse).then(r => r.json())
  )).then(() => {
    showMessage('Usuarios iniciales cargados');
    fetchUsers();
  }).catch(() => {
    showMessage('Error subiendo usuarios. Revisa que el endpoint de CrudCrud siga activo.', true);
  });
}

btnCargarInicial.addEventListener('click', () => {
  uploadInitialUsers(initialUsers);
});

tablaBody.addEventListener('click', (e) => {
  if(e.target.classList.contains('edit')){
    const id = e.target.dataset.id;
    fetch(API_URL + '/' + id).then(checkResponse).then(r=>r.json()).then(u=>{
      editingId = id;
      firstName.value = u.firstName || '';
      lastName.value = u.lastName || '';
      email.value = u.email || '';
      picture.value = u.picture || '';
      submitBtn.textContent = 'Guardar cambios';
      cancelEdit.hidden = false;
    }).catch(()=> showMessage('Error cargando usuario', true));
  }
  if(e.target.classList.contains('delete')){
    const id = e.target.dataset.id;
    if(!confirm('¿Estás seguro?')) return;
    const row = e.target.closest('tr');
    row.remove();
    fetch(API_URL + '/' + id, { method:'DELETE' }).then(checkResponse).then(()=> {
      showMessage('Usuario eliminado');
      fetchUsers();
    }).catch(()=> {
      showMessage('Error eliminando. Reintentando cargar lista', true);
      fetchUsers();
    });
  }
});

cancelEdit.addEventListener('click', () => {
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Guardar';
  cancelEdit.hidden = true;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    picture: picture.value.trim()
  };
  if(!payload.firstName || !payload.lastName || !payload.email){
    showMessage('Completa los campos', true);
    return;
  }
  if(editingId){
    fetch(API_URL + '/' + editingId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(checkResponse).then(()=> {
      showMessage('Usuario actualizado');
      editingId = null;
      form.reset();
      submitBtn.textContent = 'Guardar';
      cancelEdit.hidden = true;
      fetchUsers();
    }).catch(()=> showMessage('Error actualizando', true));
  } else {
    const tempId = 'tmp-' + Date.now();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td></td><td>${payload.firstName} ${payload.lastName}</td><td>${payload.email}</td><td>Enviando...</td>`;
    tablaBody.prepend(tr);
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(checkResponse).then(()=> {
      showMessage('Usuario añadido');
      fetchUsers();
    }).catch(()=> {
      tr.remove();
      showMessage('Error añadiendo usuario', true);
      fetchUsers();
    });
  }
});

fetchUsers();
