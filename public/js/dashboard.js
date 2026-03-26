// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Set Profile Data
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';
    const userRoleUpper = userRole.toUpperCase();

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
    updateNavigation(userRoleUpper);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');
        const workerSection = document.getElementById('worker-chart-section');

        // Nav items filtering
        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const text = link.textContent.trim();

            if (role === 'TRABAJADOR') {
                const allowed = ['Dashboard', 'Solicitudes'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                // Admin / Supervisor
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });

        // Dashboard sections visibility
        if (role === 'TRABAJADOR' && workerSection) {
            workerSection.style.display = 'block';
            renderWorkerChart('day');
        }
        if (btnScan) btnScan.style.display = role === 'TRABAJADOR' ? 'flex' : 'none';
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
            // Fetch real data from API
            const [activos, solicitudes] = await Promise.all([
                apiFetch('/activos').catch(() => []),
                apiFetch('/solicitudes').catch(() => [])
            ]);

            const totalActivos = activos.length;
            const enUso = activos.filter(a => a.estado === 'En Uso' || a.estado === 'Uso').length;
            const enMant = activos.filter(a => a.estado === 'Mantenimiento').length;
            const pendientes = solicitudes.filter(s => s.estado === 'Enviada' || s.estado === 'Pendiente').length;

            const data = {
                stats: [
                    { title: 'Total Activos', value: totalActivos, desc: 'Registrados en sistema', icon: 'blue', positive: true },
                    { title: 'Activos en Uso', value: enUso, desc: `${totalActivos ? Math.round(enUso/totalActivos*100) : 0}% del total`, icon: 'green', positive: false },
                    { title: 'En Mantenimiento', value: enMant, desc: enMant > 0 ? `${enMant} críticos` : 'Ninguno', icon: 'orange', positive: false, warning: enMant > 0 },
                    { title: 'Solicitudes Pendientes', value: pendientes, desc: pendientes > 0 ? 'Requieren aprobación' : 'Al día', icon: 'yellow', warning: pendientes > 0 }
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

            // Render recent solicitudes in the dashboard panel
            const requestsList = document.getElementById('requests-list');
            if (requestsList) {
                const recent = solicitudes.slice(0, 5);
                if (recent.length === 0) {
                    requestsList.innerHTML = '<p style="color: var(--text-muted); padding: 1rem 0; font-size: 0.9rem;">No hay solicitudes recientes.</p>';
                } else {
                    requestsList.innerHTML = recent.map(s => {
                        const badgeClass = s.estado === 'Aceptada' || s.estado === 'Aprobada' ? 'badge-approved'
                            : (s.estado === 'Enviada' || s.estado === 'Pendiente' ? 'badge-pending' : 'badge-low');
                        const activoNombre = s.activo ? s.activo.nombre : `Activo #${s.activo_id}`;
                        return `
                            <div class="list-item">
                                <div class="item-details" style="flex:1;">
                                    <h4 style="font-size:0.9rem; margin:0;">${activoNombre}</h4>
                                    <p style="font-size:0.75rem; color:var(--text-muted);">${s.fecha || ''} · <span class="badge ${badgeClass}" style="font-size:0.7rem; padding:0.15rem 0.5rem;">${s.estado}</span></p>
                                </div>
                            </div>`;
                    }).join('');
                }
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Logout Logic
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logout !== 'undefined') {
                logout();
            } else {
                localStorage.clear();
                window.location.href = 'login.html';
            }
        });
    }
});
