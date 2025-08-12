// Mostrar/ocultar senha
const senhaInput = document.getElementById('senha');
const toggleSenha = document.getElementById('toggleSenha');
const iconEye = document.getElementById('iconEye');

if (toggleSenha) {
  toggleSenha.addEventListener('click', () => {
    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    iconEye.classList.toggle('bi-eye');
    iconEye.classList.toggle('bi-eye-slash');
    toggleSenha.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  });
}

// Validação + verificação no localStorage
const form = document.getElementById('form-login');
const emailInput = document.getElementById('email');

// caixinha de mensagens (Bootstrap)
const msgBox = document.createElement('div');
msgBox.className = 'mt-3';
form.parentElement.appendChild(msgBox);

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem('cronolist_users')) || []; }
  catch { return []; }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  emailInput.classList.remove('is-invalid');
  senhaInput.classList.remove('is-invalid');
  msgBox.innerHTML = '';

  let ok = true;

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!emailValido(email)) {
    emailInput.classList.add('is-invalid');
    ok = false;
  }
  if (senha.length < 6) {
    senhaInput.classList.add('is-invalid');
    ok = false;
  }
  if (!ok) return;

  // >>> Checa se foi cadastrado e se a senha confere <<<
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    msgBox.innerHTML = `<div class="alert alert-danger">E-mail não cadastrado. <a href="cadastro.html" class="alert-link">Criar conta</a></div>`;
    return;
  }
  if (user.senha !== senha) {
    msgBox.innerHTML = `<div class="alert alert-danger">Senha incorreta.</div>`;
    return;
  }

  // Sucesso: salva sessão e redireciona
  localStorage.setItem('cronolist_isLogged', 'true');
  localStorage.setItem('cronolist_email', email);

  window.location.href = 'telaPrincipal.html';
});

// (Opcional) Pré-preenche o e-mail se veio de recuperação/cadastro
const remembered = localStorage.getItem('cronolist_lastRecoveryEmail') || localStorage.getItem('cronolist_lastSignupEmail');
if (remembered && !emailInput.value) emailInput.value = remembered;
