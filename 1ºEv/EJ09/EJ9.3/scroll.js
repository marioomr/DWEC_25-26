const progressBar = document.getElementById('progress-bar');
const btnTop = document.getElementById('btn-top');

function updateScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrolled + '%';

  if (scrollTop > window.innerHeight) {
    btnTop.classList.add('visible');
  } else {
    btnTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateScroll);

btnTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

updateScroll();
