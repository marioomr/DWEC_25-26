// CONFIG: Pon aquí tu webhook de prueba (p.ej. https://webhook.site/xxxx-xxxx)
const WEBHOOK_URL = 'https://webhook.site/2b507972-b6b3-48c5-bd9a-891fa0815073'; 
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; 

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const alerts = document.getElementById('alerts');

const userIdEl = document.getElementById('userId');
const firstNameEl = document.getElementById('firstName');
const lastNameEl = document.getElementById('lastName');
const emailEl = document.getElementById('email');
const phoneEl = document.getElementById('phone');
const streetEl = document.getElementById('street');
const cityEl = document.getElementById('city');
const zipCodeEl = document.getElementById('zipCode');
const countryEl = document.getElementById('country');
const themeEl = document.getElementById('theme');
const languageEl = document.getElementById('language');
const notificationsEl = document.getElementById('notifications');
const hobbiesEl = document.getElementById('hobbies');

let userData = null;
let editing = false;

function showAlert(message, type = 'success', timeout = 4000) {
  alerts.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  if (timeout) {
    setTimeout(() => {
      if (alerts.firstChild) alerts.firstChild.remove();
    }, timeout);
  }
}

function setFieldsDisabled(disabled) {
  const els = [firstNameEl, lastNameEl, emailEl, phoneEl, streetEl, cityEl, zipCodeEl, countryEl, themeEl, languageEl, notificationsEl, hobbiesEl];
  els.forEach(e => e.disabled = disabled);
}

function cargarDatos() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'user_data.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        userData = JSON.parse(xhr.responseText);
      } catch (e) {
        showAlert('Error parseando user_data.json', 'danger');
        return;
      }
      rellenarInterfaz();
    } else {
      showAlert('Error cargando user_data.json (status ' + xhr.status + ')', 'danger', 8000);
    }
  };
  xhr.send();
}

function rellenarInterfaz() {
  if (!userData) return;
  userIdEl.value = userData.id || '';
  firstNameEl.value = (userData.personalInfo && userData.personalInfo.firstName) || '';
  lastNameEl.value = (userData.personalInfo && userData.personalInfo.lastName) || '';
  emailEl.value = (userData.personalInfo && userData.personalInfo.email) || '';
  phoneEl.value = (userData.personalInfo && userData.personalInfo.phone) || '';
  streetEl.value = (userData.address && userData.address.street) || '';
  cityEl.value = (userData.address && userData.address.city) || '';
  zipCodeEl.value = (userData.address && userData.address.zipCode) || '';
  countryEl.value = (userData.address && userData.address.country) || '';
  themeEl.value = (userData.preferences && userData.preferences.theme) || 'light';
  languageEl.value = (userData.preferences && userData.preferences.language) || 'es';
  notificationsEl.checked = !!(userData.preferences && userData.preferences.notifications);
  hobbiesEl.value = (Array.isArray(userData.hobbies) ? userData.hobbies.join(', ') : '') || '';
  setFieldsDisabled(true);
  editing = false;
  editBtn.classList.remove('d-none');
  saveBtn.classList.add('d-none');
}

editBtn.addEventListener('click', function () {
  editing = true;
  setFieldsDisabled(false);
  editBtn.classList.add('d-none');
  saveBtn.classList.remove('d-none');
});

saveBtn.addEventListener('click', function () {
  if (!userData) return;
  const updated = {
    id: userIdEl.value,
    personalInfo: {
      firstName: firstNameEl.value.trim(),
      lastName: lastNameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim()
    },
    address: {
      street: streetEl.value.trim(),
      city: cityEl.value.trim(),
      zipCode: zipCodeEl.value.trim(),
      country: countryEl.value.trim()
    },
    preferences: {
      theme: themeEl.value,
      notifications: !!notificationsEl.checked,
      language: languageEl.value
    },
    hobbies: hobbiesEl.value.split(',').map(h => h.trim()).filter(Boolean)
  };

  if (!WEBHOOK_URL) {
    userData = updated;
    rellenarInterfaz();
    showAlert('Simulación: datos preparados y "enviados" (no hay WEBHOOK_URL configurado).', 'info', 5000);
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = 'Guardando...';

  const xhr = new XMLHttpRequest();
  const postUrl = (CORS_PROXY ? (CORS_PROXY + WEBHOOK_URL) : WEBHOOK_URL);
  xhr.open('POST', postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar cambios';
    if (xhr.status >= 200 && xhr.status < 300) {
      userData = updated;
      rellenarInterfaz();
      showAlert('Cambios guardados correctamente (respuesta recibida).', 'success');
    } else {
      showAlert('Error al guardar cambios (status ' + xhr.status + '). Comprueba el webhook y el CORS proxy.', 'danger', 8000);
    }
  };

  xhr.onerror = function () {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar cambios';
    showAlert('Error de red al enviar los datos.', 'danger', 8000);
  };

  xhr.send(JSON.stringify(updated));
});

document.addEventListener('DOMContentLoaded', function () {
  cargarDatos();
});
