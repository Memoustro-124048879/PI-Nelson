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

    // 2. Set Profile Data
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';
    const userEmail = localStorage.getItem('user_email') || '';

    // Fix "Cargando" bug immediately
    const sidebarName = document.getElementById('sidebar-name');
    const welcomeMessage = document.getElementById('welcome-message');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (welcomeMessage) welcomeMessage.textContent = `Bienvenido, ${userName} (${userRole})`;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Role-Based Sidebar Navigation
    updateNavigation(userRole);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');
        const workerSection = document.getElementById('worker-chart-section');

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

        // Dashboard sections visibility
        if (role === 'Trabajador' && workerSection) {
            workerSection.style.display = 'block';
            renderWorkerChart('day');
        }

        // QR Button logic
        if (btnScan) {
            if (role === 'Trabajador') {
                btnScan.style.display = 'flex';
            } else {
                btnScan.style.display = 'none';
            }
        }
    }

    // Chart logic for Workers
    function renderWorkerChart(filter) {
        const chartContainer = document.getElementById('requests-chart');
        if (!chartContainer) return;

        // Mock data for filters
        const chartData = {
            day: [1, 3, 2, 5, 4, 2, 3],
            week: [15, 22, 18, 25, 20, 12, 10],
            month: [80, 95, 70, 85, 90, 60, 55]
        };

        const currentData = chartData[filter];
        const max = Math.max(...currentData);

        chartContainer.innerHTML = currentData.map(val => `
            <div style="flex: 1; background: var(--primary); height: ${(val / max) * 100}%; border-radius: 4px 4px 0 0; position: relative;" title="${val} activos">
                <span style="position: absolute; top: -20px; width: 100%; text-align: center; font-size: 10px; color: var(--text-muted);">${val}</span>
            </div>
        `).join('');
    }

    // Listen for filter clicks
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderWorkerChart(e.target.dataset.filter);
        });
    });

    // 4. Load Dashboard Data
    loadDashboardData();

    async function loadDashboardData() {
        try {
            // MOCKED DATA matching Figma designs
            const data = {
                stats: [
                    { id: 'stat-total', title: 'Total Activos', value: 342, desc: '+12 este mes', icon: 'blue', positive: true },
                    { id: 'stat-en-uso', title: 'Activos en Uso', value: 156, desc: '45% del total', icon: 'green', positive: false },
                    { id: 'stat-mantenimiento', title: 'En Mantenimiento', value: 12, desc: '3 críticos', icon: 'orange', positive: false, warning: true },
                    { id: 'stat-pendientes', title: 'Solicitudes Pendientes', value: 8, desc: 'Requieren aprobación', icon: 'yellow', warning: true }
                ],
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

            // Render Stats Grid
            const statsContainer = document.getElementById('stats-container');
            if (statsContainer) {
                statsContainer.innerHTML = data.stats.map(s => `
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <div class="icon-wrapper icon-${s.icon}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                            </div>
                            <div class="stat-desc ${s.positive ? 'positive' : (s.warning ? 'warning' : '')}">
                                ${s.desc}
                            </div>
                        </div>
                        <h4 class="stat-title">${s.title}</h4>
                        <div class="stat-value">${s.value}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Optionally display an error message to the user
        }
    }

    // Logout Logic
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });
});
