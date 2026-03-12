document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Modal Damage Report Control
    const damageModal = document.getElementById('damageModal');
    const reportBtn = document.getElementById('reportDamageBtn');
    const closeModals = document.querySelectorAll('.close-modal');

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            damageModal.style.display = 'flex';
        });
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            damageModal.style.display = 'none';
        });
    });

    // Close on overlay click
    if (damageModal) {
        damageModal.addEventListener('click', (e) => {
            if (e.target === damageModal) {
                damageModal.style.display = 'none';
            }
        });
    }

    // Form Submission
    const damageForm = document.getElementById('damageForm');
    if (damageForm) {
        damageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Reporte enviado exitosamente', 'success');
            setTimeout(() => {
                damageModal.style.display = 'none';
            }, 500);
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
