document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Modal QR Control
    const qrModal = document.getElementById('qrModal');
    const qrBtns = document.querySelectorAll('.btn-qr');
    const closeModal = document.querySelector('.close-modal');

    qrBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            qrModal.style.display = 'flex';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            qrModal.style.display = 'none';
        });
    }

    // Close on overlay click
    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.style.display = 'none';
            }
        });
    }

    // Filter Buttons simulation
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('Filtering by:', btn.textContent);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
