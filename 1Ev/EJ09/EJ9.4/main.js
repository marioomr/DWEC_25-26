let popupWindow = null;

function openPopup() {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.focus();
    return;
  }

  const width = 400;
  const height = 300;

  const left = (window.screen.width / 2) - (width / 2);
  const top = 100;

  popupWindow = window.open(
    'popup.html',
    'popupWindow',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  if (!popupWindow) {
    alert('El navegador ha bloqueado la ventana emergente. Habilítala manualmente.');
  }
}

setTimeout(openPopup, 5000);

const openBtn = document.getElementById('open-popup');
const closeBtn = document.getElementById('close-popup');

openBtn.addEventListener('click', openPopup);

closeBtn.addEventListener('click', () => {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  }
});
