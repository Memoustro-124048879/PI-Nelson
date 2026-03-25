// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('access_token');

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        
        try {
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Cargando...';
            btn.disabled = true;

            await login(usernameInput, passwordInput);
        } catch (error) {
            console.error('Login error:', error);
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Ingresar';
            btn.disabled = false;

            if (error.status === 401 || error.status === 403) {
                alert('Credenciales incorrectas. Verifique usuario y contraseña.');
            } else if (error.status >= 500) {
                alert('🚨 ERROR INTERNO 500: ¡Tu servidor local (XAMPP/PHP) está colapsando! \n\nNo es un error de código, el controlador de base de datos MySQL/SQLite está DAÑADO en tu computadora. \n\nPor favor, actualiza tu versión de XAMPP para solucionar los DLLs rotos y vuelve a intentar.');
            } else {
                alert('Fallo de red o servidor apagado. Asegúrate de ejecutar: php artisan serve');
            }
        }
    });

    // Modal recuperacion
    const modalForgot = document.getElementById('forgot-password-modal');
    const btnForgot = document.getElementById('btn-forgot-password');
    const btnCloseForgot = document.getElementById('btn-close-forgot');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const btnGotoStep2 = document.getElementById('btn-goto-step-2');
    const btnGotoStep3 = document.getElementById('btn-goto-step-3');

    btnForgot.addEventListener('click', (e) => {
        e.preventDefault();
        modalForgot.classList.add('active');
        // Reset steps
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
    });

    btnCloseForgot.addEventListener('click', () => {
        modalForgot.classList.remove('active');
    });

    btnGotoStep2.addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value;
        if (email.includes('@')) {
            step1.style.display = 'none';
            step2.style.display = 'block';
        } else {
            alert('Ingrese un correo válido');
        }
    });

    btnGotoStep3.addEventListener('click', () => {
        const code = document.getElementById('forgot-code').value;
        if (code === '1234') {
            step2.style.display = 'none';
            step3.style.display = 'block';
        } else {
            alert('Código incorrecto. Use 1234');
        }
    });
});
