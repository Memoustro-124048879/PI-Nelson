document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Set Profile
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';

    // UI elements
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Role-Based Sidebar Navigation
    updateNavigation(userRole);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');

        // Nav items filtering
        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const text = link.textContent.trim();

            if (role === 'Trabajador') {
                const allowed = ['Dashboard', 'Solicitudes'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                // Admin / Supervisor
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });

        // QR Button logic
        if (btnScan) {
            if (role === 'Trabajador') {
                btnScan.style.display = 'flex';
            } else {
                btnScan.style.display = 'none';
            }
        }
    }

    // Logout Logic replacement for auth.logout
    const logout = () => {
        localStorage.clear();
        window.location.href = 'login.html';
    };

    // Tab Switching
    const tabBtns = document.querySelectorAll('.profile-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panes
            tabPanes.forEach(pane => {
                pane.style.display = 'none';
                if (pane.id === `tab-${tabId}`) {
                    pane.style.display = 'block';
                }
            });
        });
    });

    // Edit Profile Logic
    const btnEdit = document.getElementById('btnEditProfile');
    const btnCancel = document.getElementById('btnCancelEdit');
    const personalDisplay = document.getElementById('personalDisplay');
    const personalEditForm = document.getElementById('personalEditForm');

    if (btnEdit && btnCancel) {
        btnEdit.addEventListener('click', () => {
            personalDisplay.style.display = 'none';
            personalEditForm.style.display = 'block';
            btnEdit.style.display = 'none';
        });

        btnCancel.addEventListener('click', () => {
            personalDisplay.style.display = 'grid';
            personalEditForm.style.display = 'none';
            btnEdit.style.display = 'flex';
        });
    }

    if (personalEditForm) {
        personalEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Información personal actualizada');
            personalDisplay.style.display = 'grid';
            personalEditForm.style.display = 'none';
            btnEdit.style.display = 'flex';
        });
    }

    // Password Update Logic
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Contraseña actualizada correctamente');
            passwordForm.reset();
        });
    }

    // Notifications Form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Preferencias guardadas exitosamente', 'success');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Scan Button
    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
        btnScan.addEventListener('click', () => {
            window.location.href = 'escanear.html';
        });
    }
});
