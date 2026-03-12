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
        
        // Mock Login payload
        const payload = { username: usernameInput, password: passwordInput };

        try {
            // Ejemplo de llamada real a tu API:
            /*
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(res.ok) {
                localStorage.setItem('token', data.token);
                // set user info...
            }
            */

            // MOCK LOGIN LOGIC (Simulando respuesta exitosa temporalmente)
            let role = 'Trabajador';
            let name = 'Miguel Torres';

            if(usernameInput === 'admin') { role = 'Administrador'; name = 'Admin User'; }
            if(usernameInput === 'supervisor') { role = 'Supervisor'; name = 'Supervisor User'; }

            // Guardamos token falso y perfil
            localStorage.setItem('token', 'mock_token_12345');
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_role', role);

            window.location.href = 'dashboard.html';
        } catch(error) {
            console.error('Login error:', error);
            alert('Error en conexión');
        }
    });

    // Modal recuperacion
    const modalForgot = document.getElementById('forgot-password-modal');
    const btnForgot = document.getElementById('btn-forgot-password');
    const btnCloseForgot = document.getElementById('btn-close-forgot');
    const btnCancelForgot = document.getElementById('btn-cancel-forgot');
    const formForgot = document.getElementById('forgot-password-form');

    btnForgot.addEventListener('click', (e) => {
        e.preventDefault();
        modalForgot.classList.add('active');
    });

    const closeForgotModal = () => {
        modalForgot.classList.remove('active');
        formForgot.reset();
    };

    btnCloseForgot.addEventListener('click', closeForgotModal);
    btnCancelForgot.addEventListener('click', closeForgotModal);

    formForgot.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Instrucciones enviadas al correo simulado.');
        closeForgotModal();
    });
});
