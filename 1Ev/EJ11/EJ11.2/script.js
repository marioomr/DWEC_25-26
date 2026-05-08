const WEBHOOK_URL = 'https://webhook.site/70af5508-0b46-4f72-8ed2-f3d7c56a67ac';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('commentForm');
const sendBtn = document.getElementById('sendBtn');
const alerts = document.getElementById('alerts');

function showAlert(msg, type = 'info', timeout = 4000) {
  alerts.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  if (timeout) setTimeout(() => { if (alerts.firstChild) alerts.firstChild.remove(); }, timeout);
}

function renderComment(c) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  const time = new Date(c.timestamp).toLocaleString();
  li.innerHTML = '<div class="d-flex w-100 justify-content-between"><h6 class="mb-1">' + escapeHtml(c.author) + '</h6><small class="text-muted">' + escapeHtml(time) + '</small></div><p class="mb-1">' + escapeHtml(c.text) + '</p>';
  commentsList.insertBefore(li, commentsList.firstChild);
}

function escapeHtml(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}

function loadInitialComments() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'comments_initial.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const arr = JSON.parse(xhr.responseText);
        arr.forEach(renderComment);
      } catch (e) {
        showAlert('Error al parsear comentarios iniciales', 'danger');
      }
    } else {
      showAlert('Error cargando comments_initial.json (status ' + xhr.status + ')', 'danger', 8000);
    }
  };
  xhr.send();
}

commentForm.addEventListener('submit', function(ev) {
  ev.preventDefault();
  const author = document.getElementById('author').value.trim();
  const text = document.getElementById('commentText').value.trim();
  if (!author || !text) {
    showAlert('Rellena autor y comentario', 'warning');
    return;
  }
  const commentObj = { author: author, text: text, timestamp: new Date().toISOString() };
  if (!WEBHOOK_URL) {
    renderComment(commentObj);
    commentForm.reset();
    showAlert('Envío simulado: comentario añadido localmente', 'success');
    return;
  }
  sendBtn.disabled = true;
  sendBtn.textContent = 'Enviando...';
  const xhr = new XMLHttpRequest();
  const postUrl = (CORS_PROXY ? (CORS_PROXY + WEBHOOK_URL) : WEBHOOK_URL);
  xhr.open('POST', postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar comentario';
    if (xhr.status >= 200 && xhr.status < 300) {
      renderComment(commentObj);
      commentForm.reset();
      showAlert('Comentario enviado y añadido (simulado)', 'success');
    } else {
      showAlert('Error al enviar comentario (status ' + xhr.status + ')', 'danger', 8000);
    }
  };
  xhr.onerror = function() {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar comentario';
    showAlert('Error de red al enviar comentario', 'danger', 8000);
  };
  xhr.send(JSON.stringify(commentObj));
});

document.addEventListener('DOMContentLoaded', function() {
  loadInitialComments();
});
