// public/js/usuario-form.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Set Profile Information
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';

    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. User Role Based Menu logic
    const navMenu = document.querySelector('.nav-menu');
    const btnScan = document.getElementById('btn-scan');

    // Nav items filtering
    if (navMenu) {
        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const text = link.textContent.trim();

            if (userRole === 'Trabajador') {
                const allowed = ['Dashboard', 'Solicitudes'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });
    }

    // QR Button logic
    if (btnScan) {
        if (userRole === 'Trabajador') {
            btnScan.style.display = 'flex';
        } else {
            btnScan.style.display = 'none';
        }
        btnScan.addEventListener('click', () => {
            window.location.href = 'escanear.html';
        });
    }

    // 4. Logout Logic
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // --- Form Logic ---
    const newEmployeeForm = document.getElementById('newEmployeeForm');
    
    // Helper for safe toast calls
    const showToast = (msg, type = 'info') => {
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(msg, type);
        } else {
            console.log(`[Toast] ${type}: ${msg}`);
            alert(msg);
        }
    };

    if (newEmployeeForm) {
        newEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(newEmployeeForm);
            
            // Read existing users or initialize empty array
            let usersData = [];
            const stored = localStorage.getItem('sigaf_users');
            if (stored) {
                usersData = JSON.parse(stored);
            }

            const newUser = {
                id: Date.now(),
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                departamento: formData.get('departamento'),
                rol: formData.get('rol')
            };
            
            // Save new user
            usersData.push(newUser);
            localStorage.setItem('sigaf_users', JSON.stringify(usersData));
            
            showToast('Empleado añadido exitosamente', 'success');
            
            // Redirect back to list
            setTimeout(() => {
                window.location.href = 'usuarios.html';
            }, 800);
        });
    }
});
