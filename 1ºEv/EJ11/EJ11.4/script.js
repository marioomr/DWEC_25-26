const userWidget = document.getElementById('user-widget');
const postsWidget = document.getElementById('posts-widget');
const spinner = document.getElementById('loading-spinner');
const userContent = document.getElementById('user-content');
const postsContent = document.getElementById('posts-content');

const USER_URL = 'https://jsonplaceholder.typicode.com/users/1';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?userId=1';

function showSpinner(show) {
  spinner.classList.toggle('d-none', !show);
}

function renderUser(user) {
  userContent.innerHTML = `
    <p class="mb-1"><strong>Nombre:</strong> ${escapeHtml(user.name)}</p>
    <p class="mb-1"><strong>Usuario:</strong> ${escapeHtml(user.username)}</p>
    <p class="mb-1"><strong>Email:</strong> <a href="mailto:${escapeHtml(user.email)}">${escapeHtml(user.email)}</a></p>
    <p class="mb-1"><strong>Teléfono:</strong> ${escapeHtml(user.phone)}</p>
    <p class="mb-1"><strong>Compañía:</strong> ${escapeHtml(user.company?.name || '')}</p>
    <p class="mb-0"><strong>Web:</strong> <a href="http://${escapeHtml(user.website)}" target="_blank" rel="noopener">${escapeHtml(user.website)}</a></p>
  `;
  userWidget.classList.remove('d-none');
}

function renderUserError(errMsg) {
  userContent.innerHTML = `<div class="alert alert-danger mb-0">Error cargando usuario: ${escapeHtml(errMsg)}</div>`;
  userWidget.classList.remove('d-none');
}

function renderPosts(posts) {
  postsContent.innerHTML = '';
  if (!posts || posts.length === 0) {
    postsContent.innerHTML = '<p class="text-muted mb-0">No hay posts.</p>';
    postsWidget.classList.remove('d-none');
    return;
  }
  posts.forEach(p => {
    const card = document.createElement('div');
    card.className = 'mb-3';
    card.innerHTML = `
      <h6 class="mb-1">${escapeHtml(p.title)}</h6>
      <p class="mb-0 text-muted small">${escapeHtml(p.body)}</p>
      <hr class="my-3">
    `;
    postsContent.appendChild(card);
  });
  postsWidget.classList.remove('d-none');
}

function renderPostsError(errMsg) {
  postsContent.innerHTML = `<div class="alert alert-danger mb-0">Error cargando posts: ${escapeHtml(errMsg)}</div>`;
  postsWidget.classList.remove('d-none');
}

function escapeHtml(s) {
  return String(s || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}

function loadAll() {
  showSpinner(true);
  userWidget.classList.add('d-none');
  postsWidget.classList.add('d-none');
  userContent.innerHTML = '';
  postsContent.innerHTML = '';

  const pUser = fetch(USER_URL).then(res => {
    if (!res.ok) throw new Error('status ' + res.status);
    return res.json();
  });

  const pPosts = fetch(POSTS_URL).then(res => {
    if (!res.ok) throw new Error('status ' + res.status);
    return res.json();
  });

  Promise.allSettled([pUser, pPosts]).then(results => {
    const userResult = results[0];
    const postsResult = results[1];

    let bothFailed = true;

    if (userResult.status === 'fulfilled') {
      try {
        renderUser(userResult.value);
        bothFailed = false;
      } catch (e) {
        renderUserError('Respuesta inválida.');
      }
    } else {
      renderUserError(userResult.reason && userResult.reason.message ? userResult.reason.message : 'Error desconocido');
    }

    if (postsResult.status === 'fulfilled') {
      try {
        const posts = Array.isArray(postsResult.value) ? postsResult.value : [];
        const sorted = posts.slice().sort((a,b) => (b.id || 0) - (a.id || 0));
        const last3 = sorted.slice(0,3);
        renderPosts(last3);
        bothFailed = bothFailed && false;
      } catch (e) {
        renderPostsError('Respuesta inválida.');
      }
    } else {
      renderPostsError(postsResult.reason && postsResult.reason.message ? postsResult.reason.message : 'Error desconocido');
    }

    showSpinner(false);

    if ((userResult.status === 'rejected') && (postsResult.status === 'rejected')) {
      const container = document.querySelector('.container');
      const errDiv = document.createElement('div');
      errDiv.className = 'alert alert-danger mt-3';
      errDiv.textContent = 'Ambas peticiones fallaron. Comprueba tu conexión o la disponibilidad de la API.';
      container.prepend(errDiv);
    }
  }).catch(e => {
    showSpinner(false);
    const container = document.querySelector('.container');
    const errDiv = document.createElement('div');
    errDiv.className = 'alert alert-danger mt-3';
    errDiv.textContent = 'Error inesperado al cargar los datos.';
    container.prepend(errDiv);
  });
}

document.addEventListener('DOMContentLoaded', loadAll);
