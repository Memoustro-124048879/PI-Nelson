// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check (Mock check for token)
    const token = localStorage.getItem('token') || 'mock_token'; 
    /* 
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    */

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Set Profile Data - Call ui.js loadSidebar logic
    if (typeof loadSidebar === 'function') loadSidebar();
    
    // Also explicitly set the dashboard welcome message
    const userName = localStorage.getItem('user_name') || 'Miguel Torres';
    const userRole = localStorage.getItem('user_role') || 'Trabajador';
    document.getElementById('welcome-message').textContent = `Bienvenido, ${userName} - ${userRole}`;

    // 3. Logout Logic
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        window.location.href = 'login.html';
    });

    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
        btnScan.addEventListener('click', () => {
            window.location.href = 'escanear.html';
        });
    }

    // 4. Load Dashboard Data via Fetch
    loadDashboardData();

    async function loadDashboardData() {
        try {
            // Uncomment to use real API
            /*
            const res = await fetch('/api/dashboard', { headers });
            if(res.status === 401) { window.location.href = 'login.html'; return; }
            const data = await res.json();
            */
            
            // MOCKED DATA matching Figma designs
            const data = {
                stats: {
                    total: 8, total_desc: "+12 este mes",
                    en_uso: 4, en_uso_desc: "50% del total",
                    mantenimiento: 1,
                    pendientes: 2
                },
                movimientos: [
                    { activo: 'Torquímetro Digital SNAP-ON', origen: 'Almacén Central', destino: 'Planta Principal - Área de Ensamble', fecha: '15/1/2026' },
                    { activo: 'Montacargas Eléctrico YALE', origen: 'Almacén - Zona de Mantenimiento', destino: 'Almacén - Zona de Carga', fecha: '1/2/2026' },
                    { activo: 'Escáner 3D FARO', origen: 'Planta - Área de Ingeniería', destino: 'Laboratorio de Calidad', fecha: '10/12/2025' }
                ],
                solicitudes: [
                    { activo: 'Torquímetro Digital SNAP-ON', solicitante: 'Miguel Torres', estado: 'Pendiente', badgeClass: 'badge-pending', fecha: '18/2/2026' },
                    { activo: 'Escáner 3D FARO', solicitante: 'Laura Gómez', estado: 'Aprobada', badgeClass: 'badge-approved', fecha: '17/2/2026' },
                    { activo: 'Montacargas Eléctrico YALE', solicitante: 'Fernando Castro', estado: 'Completada', badgeClass: 'badge-completed', fecha: '16/2/2026' }
                ]
            };

            // Render Stats
            document.getElementById('stat-total').textContent = data.stats.total;
            document.getElementById('stat-en-uso').textContent = data.stats.en_uso;
            document.getElementById('stat-mantenimiento').textContent = data.stats.mantenimiento;
            document.getElementById('stat-pendientes').textContent = data.stats.pendientes;

            // Render Movimientos
            const movContainer = document.getElementById('movements-list');
            movContainer.innerHTML = data.movimientos.map(m => `
                <div class="list-item">
                    <div class="item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div class="item-details">
                        <h4>${m.activo}</h4>
                        <p>${m.origen} &rarr; ${m.destino}</p>
                        <div class="item-meta">${m.fecha}</div>
                    </div>
                </div>
            `).join('');

            // Render Solicitudes
            const reqContainer = document.getElementById('requests-list');
            reqContainer.innerHTML = data.solicitudes.map(s => `
                <div class="list-item">
                    <div class="item-icon yellow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div class="item-details" style="flex:1;">
                        <h4>${s.activo}</h4>
                        <p>${s.solicitante}</p>
                        <div class="item-meta">
                            <span class="badge ${s.badgeClass}">${s.estado}</span> ${s.fecha}
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error cargando el dashboard:', error);
        }
    }
});
