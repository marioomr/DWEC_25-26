const QUESTIONS_PATH = 'questions.json';

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const loadError = document.getElementById('loadError');

const questionText = document.getElementById('questionText');
const optionsForm = document.getElementById('optionsForm');
const progressEl = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const scoreText = document.getElementById('scoreText');
const detailedResults = document.getElementById('detailedResults');

let questions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = {};

function escapeHtml(s) {
  return String(s || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}

function loadQuestions() {
  return fetch(QUESTIONS_PATH)
    .then(res => {
      if (!res.ok) throw new Error('Error cargando preguntas (status ' + res.status + ')');
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || !data.length) throw new Error('Formato de preguntas inválido o vacío');
      return data;
    });
}

function startQuiz() {
  startScreen.classList.add('d-none');
  resultsScreen.classList.add('d-none');
  questionScreen.classList.remove('d-none');
  currentIndex = 0;
  score = 0;
  userAnswers = {};
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  progressEl.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
  questionText.innerHTML = escapeHtml(q.text);
  optionsForm.innerHTML = '';
  q.options.forEach(opt => {
    const id = `opt_${q.questionId}_${opt.id}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'form-check';
    wrapper.innerHTML = `
      <input class="form-check-input" type="radio" name="option" id="${id}" value="${escapeHtml(opt.id)}" ${userAnswers[q.questionId] === opt.id ? 'checked' : ''}>
      <label class="form-check-label" for="${id}">${escapeHtml(opt.text)}</label>
    `;
    optionsForm.appendChild(wrapper);
  });
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente';
}

function recordAnswer() {
  const q = questions[currentIndex];
  const selected = optionsForm.querySelector('input[name="option"]:checked');
  if (selected) {
    userAnswers[q.questionId] = selected.value;
  } else {
    delete userAnswers[q.questionId];
  }
}

function calculateScoreAndShowResults() {
  score = 0;
  detailedResults.innerHTML = '';
  questions.forEach(q => {
    const userA = userAnswers[q.questionId] || null;
    const correct = q.correctAnswer;
    const correctBool = userA === correct;
    if (correctBool) score++;
    const card = document.createElement('div');
    card.className = 'card mb-3';
    let header = `<div class="card-body">`;
    header += `<h6 class="card-title">${escapeHtml(q.text)}</h6>`;
    header += `<p class="mb-1"><strong>Tu respuesta:</strong> ${userA ? escapeHtml(userA) : '<em>No respondida</em>'} - <strong>Correcta:</strong> ${escapeHtml(correct)}</p>`;
    if (!correctBool) {
      header += `<p class="mb-0 text-muted"><strong>Explicación:</strong> ${escapeHtml(q.explanation || '')}</p>`;
    }
    header += `</div>`;
    card.innerHTML = header;
    detailedResults.appendChild(card);
  });
  scoreText.textContent = `Has acertado ${score} de ${questions.length} preguntas.`;
  questionScreen.classList.add('d-none');
  resultsScreen.classList.remove('d-none');
}

startBtn.addEventListener('click', function () {
  startBtn.disabled = true;
  loadError.textContent = '';
  loadQuestions()
    .then(data => {
      questions = data;
      startQuiz();
    })
    .catch(err => {
      loadError.innerHTML = `<div class="alert alert-danger" role="alert">${escapeHtml(err.message)}</div>`;
    })
    .finally(() => {
      startBtn.disabled = false;
    });
});

prevBtn.addEventListener('click', function () {
  recordAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', function () {
  recordAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    calculateScoreAndShowResults();
  }
});

restartBtn.addEventListener('click', function () {
  startScreen.classList.remove('d-none');
  questionScreen.classList.add('d-none');
  resultsScreen.classList.add('d-none');
  loadError.textContent = '';
});
