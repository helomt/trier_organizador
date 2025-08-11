document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('senha');
    const passwordToggle = document.getElementById('password-toggle');
    const form = document.getElementById('cadastroForm');

    // 1. Exibir/Esconder a senha
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Alterna o ícone do olho
        this.querySelector('i').classList.toggle('bi-eye');
        this.querySelector('i').classList.toggle('bi-eye-slash');
    });

    // 2. Validação básica do formulário
    form.addEventListener('submit', function(event) {
        // Se o formulário não for válido, previne o envio.
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            // Se o formulário for válido, previne o envio padrão para redirecionar manualmente
            event.preventDefault();
            // Redireciona para a página de sucesso
            window.location.href = "sucesso.html"; // Altere para o nome do seu arquivo de sucesso
        }
        
        form.classList.add('was-validated');
    }, false);
});
