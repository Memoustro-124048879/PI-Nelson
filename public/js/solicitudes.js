document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const requestCards = document.querySelectorAll('.request-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.textContent.toLowerCase();
            
            requestCards.forEach(card => {
                const statusBadge = card.querySelector('.badge-status');
                const statusToken = statusBadge.textContent.toLowerCase().trim();
                
                if (filter === 'todas' || statusToken.includes(filter.slice(0, -1))) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Approval Actions Simulation
    const approveBtns = document.querySelectorAll('.card-actions .btn-login');
    const rejectBtns = document.querySelectorAll('.card-actions .btn-secondary');

    approveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.request-card');
            const assetName = card.querySelector('h3').textContent;
            ui.showToast(`Solicitud para ${assetName} aprobada`, 'success');
            
            // Logic to update UI state could go here
            const badge = card.querySelector('.badge-status');
            badge.className = 'badge-status text-green bg-green-light';
            badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Aprobada';
            
            card.querySelector('.card-actions').innerHTML = '<button class="btn-secondary" style="width: auto; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.8rem;">Ver Detalle</button>';
        });
    });

    // Modal: Nueva Solicitud
    const newRequestModal = document.getElementById('newRequestModal');
    const newRequestBtn = document.querySelector('.btn-login[style*="background: #0f172a"]');
    const closeModals = document.querySelectorAll('.close-modal');

    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => {
            newRequestModal.style.display = 'flex';
        });
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            newRequestModal.style.display = 'none';
        });
    });

    if (newRequestModal) {
        newRequestModal.addEventListener('click', (e) => {
            if (e.target === newRequestModal) {
                newRequestModal.style.display = 'none';
            }
        });
    }

    // New Request Form
    const newRequestForm = document.getElementById('newRequestForm');
    if (newRequestForm) {
        newRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Solicitud enviada exitosamente', 'success');
            setTimeout(() => {
                newRequestModal.style.display = 'none';
                newRequestForm.reset();
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
