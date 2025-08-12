document.addEventListener('DOMContentLoaded', () => {
    // mostra o e-mail recém-cadastrado (se existir no localStorage)
    const email = localStorage.getItem('cronolist_lastSignupEmail');
    if (email) {
        const span = document.getElementById('userEmail');
        if (span) span.textContent = email;
        // opcional: limpar depois de mostrar
        // localStorage.removeItem('cronolist_lastSignupEmail');
    }

    // redireciona para login em 3s com contador
    const countdownEl = document.getElementById('countdown');
    let s = 3;
    const tick = setInterval(() => {
        s -= 1;
        if (countdownEl) countdownEl.textContent = s;
        if (s <= 0) {
            clearInterval(tick);
            window.location.href = 'login.html';
        }
    }, 1000);
});
