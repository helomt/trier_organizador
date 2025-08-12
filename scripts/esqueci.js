document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('emailRecuperacao');
  const btnEnviar = document.getElementById('btnEnviar');
  const msgBox = document.getElementById('msgBox');

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('cronolist_users')) || [];
    } catch {
      return [];
    }
  }

  function showMsg(html) {
    msgBox.innerHTML = html;
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  btnEnviar.addEventListener('click', (e) => {
    e.preventDefault();
    msgBox.innerHTML = '';

    const email = (emailInput.value || '').trim();

    if (!emailValido(email)) {
      showMsg(`
        <div class="alert alert-danger" role="alert">
          Informe um e-mail válido para recuperar sua senha.
        </div>
      `);
      emailInput.focus();
      return;
    }

    // Verifica se o e-mail existe no cadastro
    const users = getUsers();
    const existe = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (!existe) {
      showMsg(`
        <div class="alert alert-danger" role="alert">
          Este e-mail não está cadastrado. <a href="cadastro.html" class="alert-link">Criar conta</a>
        </div>
      `);
      return;
    }

    // Simula envio
    btnEnviar.setAttribute('disabled', 'disabled');
    const originalText = btnEnviar.textContent;
    btnEnviar.innerHTML = 'Enviando…';

    setTimeout(() => {
      // Guarda para pré-preencher no login
      localStorage.setItem('cronolist_lastRecoveryEmail', email);

      showMsg(`
        <div class="alert alert-success" role="alert">
          E-mail enviado com sucesso para <strong>${email}</strong>!<br>
          Verifique sua caixa de entrada e o spam.
        </div>
      `);

      emailInput.value = '';

      btnEnviar.removeAttribute('disabled');
      btnEnviar.textContent = originalText;

      // Redireciona para login depois de 3s
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    }, 1200);
  });
});
