// public/js/reportes.js
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
    const searchInput = document.querySelector('.search-box input');

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

    // Logout Logic
    const logout = () => {
        localStorage.clear();
        window.location.href = 'login.html';
    };

    // Persistence: Load from localStorage or use initial mock
    let storedReportes = localStorage.getItem('sigaf_reportes');
    if (storedReportes) {
        reportesData = JSON.parse(storedReportes);
    } else {
        reportesData = [
            {
                id: 1,
                titulo: 'Reporte de Torquímetros SNAP-ON',
                categoria: 'Mantenimiento',
                fecha: '2026-02-18',
                responsable: 'Miguel Torres',
                estado: 'Pendiente',
                urgencia: 'Media',
                descripcion: 'Revisión y calibración de torquímetros digitales de la línea de ensamble principal.',
                ubicacion: 'Planta Principal - Área de Ensamble'
            },
            {
                id: 2,
                titulo: 'Reporte de Escáner 3D FARO',
                categoria: 'Solicitudes',
                fecha: '2026-02-17',
                responsable: 'Laura Gómez',
                estado: 'Aprobada',
                urgencia: 'Alta',
                descripcion: 'Solicitud de movimiento de equipo de escaneo 3D al laboratorio de metrología.',
                ubicacion: 'Laboratorio de Calidad'
            }
        ];
        localStorage.setItem('sigaf_reportes', JSON.stringify(reportesData));
    }

    // Selectors
    const newReportModal = document.getElementById('newReportModal');
    const openNewReportBtn = document.getElementById('openNewReportBtn');
    const reportDetailModal = document.getElementById('reportDetailModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const tableBody = document.querySelector('.asset-table tbody');

    // Rendering Function
    function renderReportes() {
        if (!tableBody) return;
        tableBody.innerHTML = reportesData.map((r, index) => `
            <tr>
                <td style="font-weight: 500;">${r.titulo}</td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${r.fecha}</td>
                <td style="text-align: right;">
                    <button class="btn-action view-report-btn" data-index="${index}" title="Ver Detalle">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Ver
                    </button>
                </td>
            </tr>
        `).join('');

        // Re-attach event listeners for "Ver" buttons
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.index;
                openReportDetail(reportesData[idx]);
            });
        });

        // Update count badge
        const badge = document.querySelector('.badge-status');
        if (badge && badge.textContent.includes('reportes')) {
            badge.textContent = `${reportesData.length} reportes`;
        }
    }

    function openReportDetail(reporte) {
        // Redirigir a la nueva vista de detalle pasando el ID en la URL
        window.location.href = `reporte-detalle.html?id=${reporte.id}`;
    }

    // Initialize View
    renderReportes();



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
});
