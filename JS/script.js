document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cadastroForm');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const toggle = document.getElementById('password-toggle');

  // Utils
  function getUsers() {
    try { return JSON.parse(localStorage.getItem('cronolist_users')) || []; }
    catch { return []; }
  }
  function setUsers(users) { localStorage.setItem('cronolist_users', JSON.stringify(users)); }
  function emailValido(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  // Mostrar/ocultar senha
  if (toggle) {
    toggle.addEventListener('click', function () {
      const icon = toggle.querySelector('i');
      const isPassword = senhaInput.type === 'password';
      senhaInput.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('bi-eye');
      icon.classList.toggle('bi-eye-slash');
    });
  }

  // (Opcional) caixa de mensagens — não vamos usar no sucesso pra não “competir” com a tela
  let msgBox = document.getElementById('cadastroMsg');
  if (!msgBox) {
    msgBox = document.createElement('div');
    msgBox.id = 'cadastroMsg';
    msgBox.className = 'mt-3';
    form.parentElement.appendChild(msgBox);
  }
  const showMsg = (html) => { msgBox.innerHTML = html; };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    msgBox.innerHTML = '';
    [nomeInput, emailInput, senhaInput].forEach(el => el.classList.remove('is-invalid'));

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    let ok = true;
    if (!form.checkValidity()) ok = false;
    if (!emailValido(email)) { emailInput.classList.add('is-invalid'); ok = false; }
    if (senha.length < 6)    { senhaInput.classList.add('is-invalid'); ok = false; }

    form.classList.add('was-validated');
    if (!ok) return;

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showMsg(`
        <div class="alert alert-warning" role="alert">
          Este e-mail já está cadastrado. <a href="login.html" class="alert-link">Fazer login</a>.
        </div>`);
      return;
    }

    // Salva usuário (protótipo)
    users.push({ nome, email, senha });
    setUsers(users);

    // Guarda o e-mail para a tela de sucesso exibir
    localStorage.setItem('cronolist_lastSignupEmail', email);

    // Redireciona para a SUA página de sucesso
    window.location.href = 'contaSucesso.html';
  });
});
