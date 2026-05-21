let draggedCard = null;
const placeholder = document.createElement('div');
placeholder.className = 'placeholder';

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('dragstart', e => {
    draggedCard = card;
    card.classList.add('dragging');

    const taskData = {
      id: card.id,
      status: card.getAttribute('data-status')
    };

    e.dataTransfer.setData('application/json', JSON.stringify(taskData));
    e.dataTransfer.effectAllowed = 'move';
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    placeholder.remove();
  });
});

document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    column.classList.add('dragover');

    const afterElement = getDragAfterElement(column, e.clientY);
    if (afterElement == null) {
      column.appendChild(placeholder);
    } else {
      column.insertBefore(placeholder, afterElement);
    }
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('dragover');
  });

  column.addEventListener('drop', e => {
    e.preventDefault();
    column.classList.remove('dragover');

    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const card = document.getElementById(data.id);
    const newStatus = column.getAttribute('data-status');

    card.setAttribute('data-status', newStatus);
    column.insertBefore(card, placeholder);
    placeholder.remove();

    addDragListenerToCard(card);
  });
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll('.card:not(.dragging)')];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function addDragListenerToCard(card) {
  card.addEventListener('dragstart', e => {
    draggedCard = card;
    card.classList.add('dragging');

    const taskData = {
      id: card.id,
      status: card.getAttribute('data-status')
    };

    e.dataTransfer.setData('application/json', JSON.stringify(taskData));
    e.dataTransfer.effectAllowed = 'move';
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    placeholder.remove();
  });
}
