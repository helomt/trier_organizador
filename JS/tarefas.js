// Protege a página: precisa estar logado
const isLogged = localStorage.getItem('cronolist_isLogged') === 'true';
const currentEmail = localStorage.getItem('cronolist_email');
if (!isLogged || !currentEmail) {
  window.location.href = 'login.html';
}

// Seletores
const inputTask = document.getElementById('inputTask');
const btnAdd = document.getElementById('btnAdd');
const ul = document.getElementById('taskList');

const btnAll = document.getElementById('filterAll');
const btnPending = document.getElementById('filterPending');
const btnDone = document.getElementById('filterDone');

const countAll = document.getElementById('countAll');
const countPending = document.getElementById('countPending');
const countDone = document.getElementById('countDone');

const btnLogout = document.getElementById('btnLogout');
const userEmailSpan = document.getElementById('userEmail');
if (userEmailSpan) userEmailSpan.textContent = currentEmail || '';

// Storage key por usuário
const STORAGE_KEY = `cronolist_tasks_${currentEmail}`;

// Estado
let tasks = [];         // {id, text, done}
let filter = 'all';     // 'all' | 'pending' | 'done'

// Utils storage
function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    tasks = [];
  }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render
function render() {
  ul.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center justify-content-between';
    if (t.done) li.classList.add('task-done');

    const left = document.createElement('div');
    left.className = 'd-flex align-items-center flex-grow-1';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-3';
    checkbox.checked = t.done;
    checkbox.id = `task_${t.id}`;
    checkbox.addEventListener('change', () => toggleDone(t.id));

    const label = document.createElement('label');
    label.className = 'form-check-label flex-grow-1';
    label.setAttribute('for', checkbox.id);
    label.textContent = t.text;

    left.appendChild(checkbox);
    left.appendChild(label);

    // botão excluir (opcional)
    const del = document.createElement('button');
    del.className = 'btn btn-link text-danger btn-sm btn-delete';
    del.innerHTML = '<i class="bi bi-trash"></i>';
    del.title = 'Excluir';
    del.addEventListener('click', () => deleteTask(t.id));

    li.appendChild(left);
    li.appendChild(del);
    ul.appendChild(li);
  });

  // Contadores
  const total = tasks.length;
  const pend = tasks.filter(t => !t.done).length;
  const done = total - pend;
  countAll.textContent = total;
  countPending.textContent = pend;
  countDone.textContent = done;

  // estilos nos botões de filtro
  [btnAll, btnPending, btnDone].forEach(b => b.classList.remove('btn-primary'));
  [btnAll, btnPending, btnDone].forEach(b => b.classList.add('btn-outline-primary'));
  if (filter === 'all') { btnAll.classList.remove('btn-outline-primary'); btnAll.classList.add('btn-primary'); }
  if (filter === 'pending') { btnPending.classList.remove('btn-outline-primary'); btnPending.classList.add('btn-primary'); }
  if (filter === 'done') { btnDone.classList.remove('btn-outline-primary'); btnDone.classList.add('btn-primary'); }
}

// Ações
function addTask(text) {
  const t = text.trim();
  if (!t) return;
  tasks.push({ id: Date.now(), text: t, done: false });
  saveTasks();
  inputTask.value = '';
  render();
}

function toggleDone(id) {
  const i = tasks.findIndex(x => x.id === id);
  if (i >= 0) {
    tasks[i].done = !tasks[i].done;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  saveTasks();
  render();
}

// Eventos
btnAdd.addEventListener('click', () => addTask(inputTask.value));
inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(inputTask.value);
});

btnAll.addEventListener('click', () => { filter = 'all'; render(); });
btnPending.addEventListener('click', () => { filter = 'pending'; render(); });
btnDone.addEventListener('click', () => { filter = 'done'; render(); });

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('cronolist_isLogged');
  // mantém cronolist_email se quiser lembrar o usuário; remova se não quiser:
  // localStorage.removeItem('cronolist_email');
  window.location.href = 'login.html';
});

// Inicializa
loadTasks();
render();
