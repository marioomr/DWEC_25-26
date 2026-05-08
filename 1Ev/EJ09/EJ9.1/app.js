const pages = {
  inicio: '<h1>Página de Inicio</h1><p>Bienvenido a nuestra web.</p>',
  productos: '<h1>Productos</h1><p>Descubre nuestra gama de productos...</p>',
  contacto: '<h1>Contacto</h1><p>Contacta con nosotros a través de este formulario.</p>'
};

const content = document.getElementById('content');
const links = document.querySelectorAll('nav a');

function loadPage(pathname, push = true) {
  const route = pathname.replace('/', '') || 'inicio';
  const html = pages[route] || '<h1>404</h1><p>Página no encontrada.</p>';
  content.innerHTML = html;

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '/' + route);
  });

  if (push) {
    history.pushState({ route }, '', '/' + route);
  }
}

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    loadPage(href);
  });
});

window.addEventListener('popstate', event => {
  const route = event.state?.route || 'inicio';
  loadPage('/' + route, false);
});

const initialPath = location.pathname.replace('/', '') || 'inicio';
const validRoutes = Object.keys(pages);

if (!validRoutes.includes(initialPath)) {
  loadPage('/inicio', false);
} else {
  loadPage(location.pathname, false);
}
