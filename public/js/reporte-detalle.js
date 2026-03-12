// public/js/reporte-detalle.js
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

    // 4. Load Data from URL and localStorage
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');

    if (!reportId) {
        alert('Error: No se especificó el ID del reporte.');
        window.location.href = 'reportes.html';
        return;
    }

    let reportesData = [];
    let stored = localStorage.getItem('sigaf_reportes');
    
    if (stored) {
        reportesData = JSON.parse(stored);
    }
    
    const reporteInfo = reportesData.find(r => String(r.id) === String(reportId));

    if (!reporteInfo) {
        alert('Error: No se encontró el reporte.');
        window.location.href = 'reportes.html';
        return;
    }

    // 5. Inject Data into DOM
    document.getElementById('view-titulo').textContent = reporteInfo.titulo || 'Sin título';
    document.getElementById('view-categoria').innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        ${reporteInfo.categoria || 'Sin categoría'}
    `;
    
    // Status color based on text
    const estadoElem = document.getElementById('view-estado');
    const estado = reporteInfo.estado || 'Pendiente';
    if (estado.toLowerCase() === 'aprobada' || estado.toLowerCase() === 'completado') {
        estadoElem.style.background = 'rgba(34, 197, 94, 0.2)';
        estadoElem.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        estadoElem.style.color = '#86efac';
    } else if (estado.toLowerCase() === 'pendiente' || estado.toLowerCase() === 'procesando') {
        estadoElem.style.background = 'rgba(249, 115, 22, 0.2)';
        estadoElem.style.borderColor = 'rgba(249, 115, 22, 0.5)';
        estadoElem.style.color = '#fdba74';
    } else {
        estadoElem.style.background = 'rgba(59, 130, 246, 0.2)';
        estadoElem.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        estadoElem.style.color = '#93c5fd';
    }
    
    estadoElem.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        ${estado}
    `;

    document.getElementById('view-fecha').textContent = reporteInfo.fecha || '--/--/----';
    document.getElementById('view-responsable').textContent = reporteInfo.responsable || 'Autor Desconocido';
    document.getElementById('view-descripcion').textContent = reporteInfo.descripcion || 'Sin descripción detallada disponible.';
    document.getElementById('view-ubicacion').textContent = reporteInfo.ubicacion || 'No especificada';

    const costoVal = parseFloat(reporteInfo.costo);
    if (!isNaN(costoVal) && costoVal > 0) {
        document.getElementById('view-costo').textContent = `$${costoVal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    } else {
        document.getElementById('view-costo').textContent = 'No registrado';
    }

    document.getElementById('view-notas').textContent = reporteInfo.notas || 'Sin notas complementarias.';
});
