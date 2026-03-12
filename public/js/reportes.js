document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Modal: New Report
    const newReportModal = document.getElementById('newReportModal');
    const openNewReportBtn = document.getElementById('openNewReportBtn');
    
    // Modal: Report Detail
    const reportDetailModal = document.getElementById('reportDetailModal');
    const viewReportBtns = document.querySelectorAll('.view-report-btn');

    const closeButtons = document.querySelectorAll('.close-modal');

    if (openNewReportBtn) {
        openNewReportBtn.addEventListener('click', () => {
            newReportModal.style.display = 'flex';
        });
    }

    viewReportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            reportDetailModal.style.display = 'flex';
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            newReportModal.style.display = 'none';
            reportDetailModal.style.display = 'none';
        });
    });

    // Handle form submission
    const newReportForm = document.getElementById('newReportForm');
    if (newReportForm) {
        newReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Reporte creado exitosamente', 'success');
            setTimeout(() => {
                newReportModal.style.display = 'none';
                newReportForm.reset();
            }, 500);
        });
    }

    // Close on overlay
    window.addEventListener('click', (e) => {
        if (e.target === newReportModal) newReportModal.style.display = 'none';
        if (e.target === reportDetailModal) reportDetailModal.style.display = 'none';
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
