// Protege a página: precisa estar logado
const isLogged = localStorage.getItem('cronolist_isLogged') === 'true';
const currentEmail = localStorage.getItem('cronolist_email');
if (!isLogged || !currentEmail) {
  window.location.href = 'login.html';
}

// Seletores
const inputTask = document.getElementById('inputTask');
const inputDue  = document.getElementById('inputDue'); // NOVO (type="date" no HTML)
const btnAdd    = document.getElementById('btnAdd');
const ul        = document.getElementById('taskList');

const btnAll     = document.getElementById('filterAll');
const btnPending = document.getElementById('filterPending');
const btnDone    = document.getElementById('filterDone');

const countAll     = document.getElementById('countAll');
const countPending = document.getElementById('countPending');
const countDone    = document.getElementById('countDone');

const btnLogout   = document.getElementById('btnLogout');
const userEmailEl = document.getElementById('userEmail');
if (userEmailEl) userEmailEl.textContent = currentEmail || '';

// Storage key por usuário
const STORAGE_KEY = `cronolist_tasks_${currentEmail}`;

// Estado: agora inclui "due" (YYYY-MM-DD)
let tasks = [];         // {id, text, due, done}
let filter = 'all';     // 'all' | 'pending' | 'done'

// ---- Utils de storage
function loadTasks() {
  try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { tasks = []; }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---- Utils de data
function formatDateBR(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function isOverdue(isoDate) {
  if (!isoDate) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(`${isoDate}T00:00:00`);
  return due < today;
}

// ---- Render
function render() {
  // Ordena por data (as com data primeiro), depois por id
  tasks.sort((a, b) => {
    if (a.due && b.due) return a.due.localeCompare(b.due) || (a.id - b.id);
    if (a.due && !b.due) return -1;
    if (!a.due && b.due) return 1;
    return a.id - b.id;
  });

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

    // Texto "MSG — DATA" (se houver)
    const dataTxt = t.due ? formatDateBR(t.due) : '';
    label.textContent = dataTxt ? `${t.text} — ${dataTxt}` : t.text;

    // Badge "Vencida" se não concluída e já passou da data
    if (!t.done && isOverdue(t.due)) {
      label.classList.add('text-danger');
      const badge = document.createElement('span');
      badge.className = 'badge bg-danger ms-2';
      badge.textContent = 'Vencida';
      label.appendChild(badge);
    }

    left.appendChild(checkbox);
    left.appendChild(label);

    // botão excluir
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

  // Estilos dos filtros
  [btnAll, btnPending, btnDone].forEach(b => b.classList.remove('btn-primary'));
  [btnAll, btnPending, btnDone].forEach(b => b.classList.add('btn-outline-primary'));
  if (filter === 'all')     { btnAll.classList.replace('btn-outline-primary','btn-primary'); }
  if (filter === 'pending') { btnPending.classList.replace('btn-outline-primary','btn-primary'); }
  if (filter === 'done')    { btnDone.classList.replace('btn-outline-primary','btn-primary'); }
}

// ---- Ações
function addTask(text, due) {
  const t = (text || '').trim();
  const d = (due || '').trim();
  if (!t) { inputTask.focus(); return; }
  if (!d) { inputDue.focus(); return; } // data obrigatória (ajuste aqui se quiser tornar opcional)

  tasks.push({ id: Date.now(), text: t, due: d, done: false });
  saveTasks();
  inputTask.value = '';
  inputDue.value = '';
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

// ---- Eventos
btnAdd.addEventListener('click', () => addTask(inputTask.value, inputDue.value));
[inputTask, inputDue].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask(inputTask.value, inputDue.value);
  });
});

btnAll.addEventListener('click',    () => { filter = 'all';     render(); });
btnPending.addEventListener('click',() => { filter = 'pending'; render(); });
btnDone.addEventListener('click',   () => { filter = 'done';    render(); });

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('cronolist_isLogged');
  window.location.href = 'login.html';
});

// ---- Inicializa
loadTasks();
render();
