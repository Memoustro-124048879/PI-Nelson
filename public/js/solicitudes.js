// public/js/solicitudes.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Set Profile
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';
    const userRoleUpper = userRole.toUpperCase();

    // UI elements
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Role-Based Sidebar Navigation
    updateNavigation(userRoleUpper);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');

        // Nav items filtering
        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const text = link.textContent.trim();

            if (role === 'TRABAJADOR') {
                const allowed = ['Dashboard', 'Solicitudes'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });

        // QR Button logic
        if (btnScan) {
            if (role === 'TRABAJADOR') {
                btnScan.style.display = 'flex';
            } else {
                btnScan.style.display = 'none';
            }
        }
    }

    // Logout Logic
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Rest of initialization follows...

    // 3. Modal Logic
    const modal = document.getElementById('request-modal');
    const btnNew = document.getElementById('btn-new-request');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('new-request-form');

    const openModal = () => modal.classList.add('active');
    const closeModal = () => {
        modal.classList.remove('active');
        form.reset();
    };

    btnNew.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });

    // 4. Submit Request
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const activo_id        = document.getElementById('activo_id').value;
        const fecha_programada = document.getElementById('fecha_programada').value;
        const responsable      = document.getElementById('responsable_cambio').value;
        const ubicacion        = document.getElementById('nueva_ubicacion').value;
        const urgencia         = document.getElementById('urgencia').value;
        const motivo           = document.getElementById('motivo').value;

        // Basic validation
        if (!activo_id || !ubicacion || !motivo) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const textBtn = btn ? btn.innerHTML : 'Guardar';
        if (btn) btn.innerHTML = 'Enviando...';

        try {
            const payload = {
                activo_id: activo_id,
                ubicacion_destino: ubicacion,
                urgencia: urgencia,
                motivo: motivo
            };

            await apiFetch('/solicitudes', { method: 'POST', body: JSON.stringify(payload) });
            
            if (typeof ui !== 'undefined' && ui.showToast) {
                ui.showToast('Solicitud enviada exitosamente', 'success');
            }
            closeModal();
            loadSolicitudes();
        } catch (err) {
            if (typeof ui !== 'undefined') ui.showToast('Error de conexión', 'error');
        } finally {
            if (btn) btn.innerHTML = textBtn;
        }
    });


    // 5. Filtering logic
    const filterBtns = document.querySelectorAll('.btn-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active', 'active-green', 'active-yellow'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            if(filter === 'approved') btn.classList.add('active-green');
            if(filter === 'pending') btn.classList.add('active-yellow');
            
            renderSolicitudes(filter);
        });
    });

    // Search Logic
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.btn-filter.active').dataset.filter;
        renderSolicitudes(activeFilter, query);
    });

    // 6. Fetch & Data Render
    let solicitudesData = [];

    async function loadSolicitudes() {
        // Options for Activo
        try {
            const selectActivo = document.getElementById('activo_id');
            if (selectActivo) {
                const assets = await apiFetch('/activos');
                assets.forEach(asset => {
                    const opt = document.createElement('option');
                    opt.value = asset.id;
                    opt.textContent = `${asset.qr_code || asset.id} - ${asset.nombre}`;
                    selectActivo.appendChild(opt);
                });
            }
        } catch (e) {
            console.warn('Could not load assets for select dropdown');
        }

        // Options for users
        try {
            const selectResponsable = document.getElementById('responsable_cambio');
            if (selectResponsable) {
                const users = await apiFetch('/usuarios');
                users.forEach(user => {
                    const opt = document.createElement('option');
                    opt.value = user.id;
                    opt.textContent = user.name;
                    selectResponsable.appendChild(opt);
                });
            }
        } catch (e) {
            console.warn('Could not load users for select dropdown');
        }

        // Fetch Solicitudes
        try {
            const reqs = await apiFetch('/solicitudes');
            solicitudesData = reqs.map(s => ({
                id: s.id,
                activo: s.activo ? s.activo.nombre : s.activo_id,
                estado: s.estado,
                estadoClass: s.estado === 'Aprobada' || s.estado === 'Aceptada' ? 'badge-approved' : (s.estado === 'Pendiente' || s.estado === 'Enviada' ? 'badge-pending' : 'badge-low'),
                urgencia: s.urgencia,
                urgenciaClass: s.urgencia === 'Alta' ? 'badge-high' : 'badge-medium',
                solicitado_por: s.user_id,
                fecha_solicitud: s.fecha,
                fecha_programada: s.fecha,
                realizara_cambio: s.revisada_por || 'N/A',
                ubicacion_actual: 'N/A',
                nueva_ubicacion: s.ubicacion_destino,
                motivo: s.motivo,
                progress: s.estado === 'Aprobada' || s.estado === 'Aceptada' ? 2 : 1
            }));
            
            renderSolicitudes('all');
        } catch (error) {
            console.error(error);
            if (typeof ui !== 'undefined') ui.showToast('Error cargando solicitudes', 'error');
        }
    }

    function renderSolicitudes(filter = 'all', searchQuery = '') {
        const container = document.getElementById('requests-container');
        let filtered = solicitudesData;
        
        // Filter by Status
        if (filter === 'pending') filtered = filtered.filter(s => s.estado === 'Pendiente');
        if (filter === 'approved') filtered = filtered.filter(s => s.estado === 'Aprobada');

        // Filter by Search Query
        if (searchQuery) {
            filtered = filtered.filter(s => 
                (s.activo || '').toLowerCase().includes(searchQuery) || 
                String(s.solicitado_por || '').toLowerCase().includes(searchQuery)
            );
        }

        container.innerHTML = filtered.map(s => {
            
            let progressHtml = '';
            // For example, if it's approved, we render the progress bar shown in Image 3
            if(s.estado === 'Aprobada') {
                progressHtml = `
                    <div class="progress-area">
                        <div class="progress-line-container">
                            <div class="progress-line-fill" style="width: 50%;"></div>
                        </div>
                        <div class="progress-step">
                            <div class="step-dot active"></div>
                            <span class="step-label active">Solicitud enviada</span>
                        </div>
                        <div class="progress-step">
                            <div class="step-dot active"></div>
                            <span class="step-label active">Aprobada</span>
                        </div>
                        <div class="progress-step" style="background:#fff;">
                            <div class="step-dot"></div>
                            <span class="step-label">Movimiento registrado</span>
                        </div>
                    </div>
                `;
            } else if (s.estado === 'Pendiente') {
                progressHtml = `
                    <div class="progress-area">
                        <div class="progress-line-container">
                            <div class="progress-line-fill" style="width: 0%;"></div>
                        </div>
                        <div class="progress-step">
                            <div class="step-dot active"></div>
                            <span class="step-label active">Solicitud enviada</span>
                        </div>
                        <div class="progress-step">
                            <div class="step-dot"></div>
                            <span class="step-label">Aprobada</span>
                        </div>
                        <div class="progress-step" style="background:#fff;">
                            <div class="step-dot"></div>
                            <span class="step-label">Movimiento registrado</span>
                        </div>
                    </div>
                `;
            }

            return `
            <div class="request-card">
                <div class="req-header">
                    <div class="req-title">
                        <h3>${s.activo}</h3>
                        <span class="badge ${s.estadoClass}"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:2px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${s.estado}</span>
                        <span class="badge ${s.urgenciaClass}">${s.urgencia}</span>
                    </div>
                    <button class="btn-outline" onclick="alert('Detalle de Solicitud:\\nActivo: ${s.activo}\\nSolicitante: ${s.solicitado_por}\\nMotivo: ${s.motivo}\\nUrgency: ${s.urgencia}')">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Ver Detalle
                    </button>
                </div>

                <div class="req-grid">
                    <div class="req-field">
                        <h5>Solicitado por</h5>
                        <p>${s.solicitado_por}</p>
                    </div>
                    <div class="req-field">
                        <h5>Fecha de solicitud</h5>
                        <p>${s.fecha_solicitud}</p>
                    </div>
                    <div class="req-field">
                        <h5>Fecha programada</h5>
                        <p>${s.fecha_programada}</p>
                    </div>
                    <div class="req-field">
                        <h5>Realizará el cambio</h5>
                        <p>${s.realizara_cambio}</p>
                    </div>

                    <div class="req-location">
                        <div class="req-location-part">
                            <h5>Ubicación actual</h5>
                            <p>${s.ubicacion_actual}</p>
                        </div>
                        <div class="req-location-arrow">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                        <div class="req-location-part">
                            <h5>Nueva ubicación</h5>
                            <p>${s.nueva_ubicacion}</p>
                        </div>
                    </div>

                    <div class="req-reason">
                        <h5>Motivo</h5>
                        <p>${s.motivo}</p>
                    </div>
                </div>

                ${progressHtml}
            </div>
            `;
        }).join('');
    }

    loadSolicitudes();
});
