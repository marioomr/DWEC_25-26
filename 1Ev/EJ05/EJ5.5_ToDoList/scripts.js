document.getElementById('btn-anadir').addEventListener('click', () => {
  const input = document.getElementById('input-tarea');
  const texto = input.value.trim();

  if (texto !== '') {
    const ul = document.getElementById('lista-tareas');

    const li = document.createElement('li');
    li.textContent = texto;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('eliminar');

    li.appendChild(btnEliminar);
    ul.appendChild(li);

    input.value = '';
    input.focus();
  }
});


document.getElementById('lista-tareas').addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('eliminar')) {
    const li = e.target.parentNode;
    li.remove();
  }
});
