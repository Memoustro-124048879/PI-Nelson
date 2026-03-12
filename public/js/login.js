// Redirigir si ya está autenticado
redirectIfAuthenticated();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('errorMsg');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // UI Feedback
            if (btnText) btnText.style.display = 'none';
            if (loader) loader.style.display = 'block';
            submitBtn.disabled = true;
            if (errorMsg) errorMsg.style.display = 'none';

            try {
                // El backend espera 'email' y 'password' según AuthController.php
                await login(email, password);
            } catch (err) {
                console.error('Login Error:', err);
                if (errorMsg) {
                    errorMsg.textContent = err.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
                    errorMsg.style.display = 'block';
                }
                
                // Reset UI
                if (btnText) btnText.style.display = 'inline';
                if (loader) loader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});
