// public/js/solicitudes.js
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

    // 2. Set Profile
    if (typeof loadSidebar === 'function') loadSidebar();

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
        const payload = {
            activo_id: document.getElementById('activo_id').value,
            fecha_programada: document.getElementById('fecha_programada').value,
            responsable_cambio: document.getElementById('responsable_cambio').value,
            nueva_ubicacion: document.getElementById('nueva_ubicacion').value,
            urgencia: document.getElementById('urgencia').value,
            motivo: document.getElementById('motivo').value
        };

        try {
            // Ejemplo de llamada real:
            /*
            const res = await fetch('/api/solicitudes', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if(res.ok) {
                alert('Solicitud creada');
                closeModal();
                loadSolicitudes();
            } else {
                alert('Error al crear solicitud');
            }
            */
            solicitudesData.unshift({
                id: Date.now(),
                activo: payload.activo_id || 'Activo Nuevo',
                estado: 'Pendiente', estadoClass: 'badge-pending',
                urgencia: payload.urgencia || 'Media', urgenciaClass: 'badge-medium',
                solicitado_por: localStorage.getItem('user_name') || 'Usuario Autorizado',
                fecha_solicitud: new Date().toLocaleDateString() + ', ' + new Date().getHours() + ':' + new Date().getMinutes(),
                fecha_programada: payload.fecha_programada.replace('T', ', '),
                realizara_cambio: payload.responsable_cambio,
                ubicacion_actual: 'Ubicación Desconocida',
                nueva_ubicacion: payload.nueva_ubicacion,
                motivo: payload.motivo,
                progress: 1
            });
            ui.showToast('Solicitud enviada exitosamente', 'success');
            renderSolicitudes();
            closeModal();
        } catch (error) {
            console.error(error);
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
        try {
            // Ejemplo llamada real:
            /*
            const res = await fetch('/api/solicitudes', { headers });
            solicitudesData = await res.json();
            */
            
            // Mock Data matching Figma Image 2 and 3
            solicitudesData = [
                {
                    id: 1,
                    activo: 'Torquímetro Digital SNAP-ON',
                    estado: 'Pendiente', estadoClass: 'badge-pending',
                    urgencia: 'Media', urgenciaClass: 'badge-medium',
                    solicitado_por: 'Miguel Torres',
                    fecha_solicitud: '18 feb 2026, 10:30',
                    fecha_programada: '21 feb 2026, 08:00',
                    realizara_cambio: 'Roberto Sánchez',
                    ubicacion_actual: 'Planta Principal - Área de Ensamble',
                    nueva_ubicacion: 'Planta Principal - Línea de Producción B',
                    motivo: 'Requerido para nuevo proyecto de ensamble en Línea B',
                    progress: 1 // 1=Enviada, 2=Aprobada, 3=Movimiento
                },
                {
                    id: 2,
                    activo: 'Escáner 3D FARO',
                    estado: 'Aprobada', estadoClass: 'badge-approved',
                    urgencia: 'Alta', urgenciaClass: 'badge-high',
                    solicitado_por: 'Laura Gómez',
                    fecha_solicitud: '17 feb 2026, 14:15',
                    fecha_programada: '20 feb 2026, 09:00',
                    realizara_cambio: 'José Ramírez',
                    ubicacion_actual: 'Laboratorio de Calidad',
                    nueva_ubicacion: 'Planta - Área de Ingeniería',
                    motivo: 'Medición de prototipos de nueva línea de productos',
                    progress: 2
                }
            ];

            renderSolicitudes('all');
        } catch (error) {
            console.error(error);
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
                s.activo.toLowerCase().includes(searchQuery) || 
                s.solicitado_por.toLowerCase().includes(searchQuery)
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
