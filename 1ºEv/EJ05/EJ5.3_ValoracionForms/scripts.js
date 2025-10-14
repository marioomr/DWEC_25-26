function generarInformeDeValidacion() {
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');
  const informe = document.getElementById('informe-errores');

  
  informe.innerHTML = '';

  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();

  let errores = [];

  if (nombre.length <= 3) {
    errores.push("El nombre debe tener más de 3 caracteres.");
  }

  if (!email.includes('@')) {
    errores.push("El email debe contener un '@'.");
  }

  if (errores.length > 0) {
    errores.forEach(textoError => {
      const p = document.createElement('p');
      p.textContent = textoError;
      informe.appendChild(p);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = "Formulario válido";
    p.classList.add('valido');
    informe.appendChild(p);
  }
}
