const viewportEl = document.getElementById('viewport');
const outerEl = document.getElementById('outer');
const positionEl = document.getElementById('position');
const resolutionEl = document.getElementById('resolution');
const availableEl = document.getElementById('available');
const connectionEl = document.getElementById('connection');
const indicatorEl = document.getElementById('indicator');

let lastX = window.screenX;
let lastY = window.screenY;

function updateInfo() {
  viewportEl.textContent = `${window.innerWidth} x ${window.innerHeight}`;
  outerEl.textContent = `${window.outerWidth} x ${window.outerHeight}`;
  positionEl.textContent = `${window.screenX}, ${window.screenY}`;
  resolutionEl.textContent = `${screen.width} x ${screen.height}`;
  availableEl.textContent = `${screen.availWidth} x ${screen.availHeight}`;
  updateConnectionStatus();
}

function updateConnectionStatus() {
  const online = navigator.onLine;
  connectionEl.textContent = online ? 'Online' : 'Offline';
  indicatorEl.style.backgroundColor = online ? 'green' : 'red';
}

window.addEventListener('resize', updateInfo);

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

setInterval(() => {
  if (window.screenX !== lastX || window.screenY !== lastY) {
    lastX = window.screenX;
    lastY = window.screenY;
    positionEl.textContent = `${lastX}, ${lastY}`;
  }
}, 250);

updateInfo();
