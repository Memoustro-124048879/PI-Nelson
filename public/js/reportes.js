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
    let reportesData = [];

    async function fetchReportes() {
        try {
            const rawData = await apiFetch('/reportes');
            reportesData = rawData.map(r => ({
                id: r.id,
                titulo: r.titulo,
                categoria: r.tipo,
                fecha: r.fecha,
                estado: r.estado,
                urgencia: r.gravedad || 'Media',
                descripcion: r.notas,
                ubicacion: r.ubicacion_evento,
                activo_id: r.activo_id,
                activo_nombre: r.activo ? r.activo.nombre : 'N/A'
            }));
            renderReportes();
        } catch (e) {
            console.error('Error cargando reportes:', e);
            if (typeof ui !== 'undefined') ui.showToast('Error de red', 'error');
        }
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
    fetchReportes();

    // Export Logic
    const exportBtns = document.querySelectorAll('.btn-secondary');
    
    // PDF exports (buttons at indices 0, 2, 4)
    [0, 2, 4].forEach(i => {
        if(exportBtns[i]) {
            exportBtns[i].addEventListener('click', () => exportToPDF());
        }
    });

    // Excel/CSV exports (buttons at indices 1, 3, 5)
    [1, 3, 5].forEach(i => {
        if(exportBtns[i]) {
            exportBtns[i].addEventListener('click', () => exportToCSV());
        }
    });

    function exportToPDF() {
        if (typeof window.jspdf === 'undefined') {
            if(typeof ui !== 'undefined') ui.showToast('Librería PDF no cargada', 'error');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        doc.setFontSize(18);
        doc.text('Reportes Generales - SIGAF', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["ID", "TÍTULO", "TIPO", "FECHA", "ESTADO", "ACTIVO"];
        const tableRows = [];

        reportesData.forEach(r => {
            tableRows.push([
                r.id, r.titulo, r.categoria, r.fecha, r.estado, r.activo_nombre
            ]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [15, 23, 42] }
        });

        doc.save(`SIGAF_Reportes_${new Date().getTime()}.pdf`);
    }

    function exportToCSV() {
        const headers = ["ID", "TÍTULO", "TIPO", "FECHA", "ESTADO", "ACTIVO"];
        let csvContent = headers.join(",") + "\n";
        
        reportesData.forEach(r => {
            const row = [r.id, `"${r.titulo}"`, `"${r.categoria}"`, r.fecha, r.estado, `"${r.activo_nombre}"`];
            csvContent += row.join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `SIGAF_Reportes_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

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
