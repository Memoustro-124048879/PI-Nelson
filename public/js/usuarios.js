document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (typeof loadSidebar === 'function') loadSidebar();

    // Sidebar Active State
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Scan Btn
    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
        btnScan.addEventListener('click', () => {
            window.location.href = 'escanear.html';
        });
    }

    // Search and Filters simulation
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Searching for:', e.target.value);
            // In a real app, this would filter the displayed user list
        });
    }

    // Tooltip simulation for action buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            ui.showToast('Funciones de edición disponibles próximamente');
        });
    });
});
