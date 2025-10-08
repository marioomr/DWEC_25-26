(function() {
  const footer = document.getElementById('footer-principal');
  if (footer && footer.previousElementSibling) {
    footer.previousElementSibling.style.border = '2px solid red';
  }
})();