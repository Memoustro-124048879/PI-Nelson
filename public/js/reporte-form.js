// public/js/reporte-form.js
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

    // 3. Setup Layout Interactions
    const btnScan = document.getElementById('btn-scan');
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

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // --- Form Submission Logic ---
    const newReportForm = document.getElementById('newReportForm');
    
    // Prefill date input dynamically with today's date
    const dateInput = document.querySelector('input[name="fecha"]');
    if (dateInput) {
        const today = new Date();
        const yy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yy}-${mm}-${dd}`;
    }

    const showToast = (msg, type = 'info') => {
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(msg, type);
        } else {
            alert(msg);
        }
    };

    if (newReportForm) {
        newReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(newReportForm);
            
            // Read existing 
            let reportesData = [];
            let stored = localStorage.getItem('sigaf_reportes');
            if (stored) {
                reportesData = JSON.parse(stored);
            }

            const newReport = {
                id: Date.now(),
                titulo: formData.get('titulo'),
                categoria: formData.get('categoria'),
                fecha: formData.get('fecha'),
                descripcion: formData.get('descripcion'),
                responsable: formData.get('responsable') || userName,
                ubicacion: formData.get('ubicacion') || 'General',
                costo: formData.get('costo'),
                notas: formData.get('notas'),
                estado: 'Enviado',
                urgencia: 'Normal'
            };

            // Add at top since it's most recent
            reportesData.unshift(newReport);
            localStorage.setItem('sigaf_reportes', JSON.stringify(reportesData));
            
            showToast('Reporte generado exitosamente', 'success');
            setTimeout(() => {
                window.location.href = 'reportes.html';
            }, 800);
        });
    }
});
