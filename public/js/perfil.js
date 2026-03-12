document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (typeof loadSidebar === 'function') loadSidebar();

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
