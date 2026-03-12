// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    // Si entra a login, limpiamos localStorage por seguridad
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('access_token');

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        
        // MOCK LOGIN LOGIC
        let role = '';
        let name = '';

        if(passwordInput === 'demo123') {
            if(usernameInput === 'Admin@sigaf.com') { role = 'Administrador'; name = 'Admin SIGAF'; }
            else if(usernameInput === 'Supervisor@sigaf.com') { role = 'Supervisor'; name = 'Supervisor SIGAF'; }
            else if(usernameInput === 'Trabajador@sigaf.com') { role = 'Trabajador'; name = 'Trabajador SIGAF'; }
        }

        if (role) {
            localStorage.setItem('token', 'mock_token_' + Math.random().toString(36).substr(2));
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_role', role);
            localStorage.setItem('user_email', usernameInput);
            window.location.href = 'dashboard.html';
        } else {
            alert('Credenciales incorrectas. Verifique usuario y contraseña.');
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
