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

    // Edit Button
    const editBtn = document.querySelector('.btn-login'); // This is the "Editar Activo" button
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id') || 'TQM-2024-001';

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = `activo-form.html?id=${assetId}`;
        });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }
});
