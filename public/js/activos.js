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

    // Logout Logic replacement for auth.logout
    const logout = () => {
        localStorage.clear();
        window.location.href = 'login.html';
    };

    // Mock Data for Activos (Initial Data)
    const initialActivosData = [
        { id: 'TQM-2024-001', nombre: 'Torquímetro Digital SNAP-ON', modelo: 'SNAP-ON ATECH3FR250B', categoria: 'Herramientas', serie: 'SN-TQ-457821', ubicacion: 'Planta Principal - Área de Ensamble', departamento: 'Producción', estado: 'En Uso', responsable: 'Miguel Torres' },
        { id: 'PG-5T-98741', nombre: 'Puente Grúa 5 Toneladas', modelo: 'DEMAG DC-COM 5-500', categoria: 'Maquinaria', serie: 'PG-5T-98741', ubicacion: 'Planta Principal - Almacén Central', departamento: 'Logística', estado: 'Disponible', responsable: 'José Ramírez' },
        { id: 'COMP-2024-05', nombre: 'Compresor de Aire Ingersoll Rand', modelo: 'UP6-15c TAS', categoria: 'Equipos', serie: 'IR-CP-112233', ubicacion: 'Cuarto de Máquinas', departamento: 'Mantenimiento', estado: 'Mantenimiento', responsable: 'Carlos Vargas' },
        { id: 'LAP-DEV-001', nombre: 'Laptop Dell XPS 15', modelo: 'Precision 5550', categoria: 'TI', serie: 'DL-XPS-9988', ubicacion: 'Oficinas Administrativas', departamento: 'Sistemas', estado: 'En Uso', responsable: 'Ana Rodríguez' },
        { id: 'IMP-3D-002', nombre: 'Impresora 3D Stratasys', modelo: 'F123 Series', categoria: 'Equipos', serie: 'ST-3D-4455', ubicacion: 'Laboratorio de Prototipos', departamento: 'Ingeniería', estado: 'Disponible', responsable: 'Luis Pérez' },
        { id: 'VEH-2024-018', nombre: 'Montacargas Eléctrico YALE', modelo: 'ERP15-30VT', categoria: 'Vehículos', serie: 'YL-MT-7766', ubicacion: 'Almacén de Materia Prima', departamento: 'Logística', estado: 'En Uso', responsable: 'Roberto Sánchez' },
        { id: 'ESC-3D-001', nombre: 'Escáner 3D FARO', modelo: 'Quantum Max', categoria: 'Instrumentos', serie: 'FR-SC-2233', ubicacion: 'Laboratorio de Calidad', departamento: 'Calidad', estado: 'Mantenimiento', responsable: 'Laura Gómez' },
        { id: 'SOLD-TIG-003', nombre: 'Máquina Soldadora TIG Miller', modelo: 'Syncrowave 210', categoria: 'Maquinaria', serie: 'ML-TG-5544', ubicacion: 'Taller de Soldadura', departamento: 'Mantenimiento', estado: 'Disponible', responsable: 'Carlos Vargas' }
    ];

    // Load from localStorage or initialize
    let assetsFromStorage = localStorage.getItem('sigaf_assets');
    let activosData = assetsFromStorage ? JSON.parse(assetsFromStorage) : initialActivosData;

    // Save if not initialized
    if (!assetsFromStorage) {
        localStorage.setItem('sigaf_assets', JSON.stringify(activosData));
    }

    // Export variables if needed or just use locally
    window.saveActivos = (data) => {
        localStorage.setItem('sigaf_assets', JSON.stringify(data));
        activosData = data;
    };

    const tableBody = document.getElementById('assetsTableBody');
    const qrModal = document.getElementById('qrModal');
    const assetNameModal = document.getElementById('assetNameModal');
    const assetCodeModal = document.getElementById('assetCodeModal');
    const assetDescModal = document.getElementById('assetDescModal');
    const filterTabs = document.querySelectorAll('.tab-btn');
    const showingText = document.querySelector('.main-container > div:last-of-type span');

    function renderActivos(filter = 'Todos', search = '') {
        if (!tableBody) return;
        
        let filtered = activosData;
        if (filter !== 'Todos') {
            filtered = filtered.filter(a => a.estado === filter);
        }
        if (search) {
            filtered = filtered.filter(a => 
                a.nombre.toLowerCase().includes(search.toLowerCase()) || 
                a.serie.toLowerCase().includes(search.toLowerCase()) || 
                a.id.toLowerCase().includes(search.toLowerCase())
            );
        }

        tableBody.innerHTML = filtered.map(a => {
            let badgeStyle = '';
            if (a.estado === 'En Uso') badgeStyle = 'background: #e0e7ff; color: #3730A3;';
            else if (a.estado === 'Disponible') badgeStyle = 'background: #dcfce7; color: #166534;';
            else if (a.estado === 'Mantenimiento') badgeStyle = 'background: #fef9c3; color: #854d0e;';

            return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td class="qr-cell" style="padding: 1rem; text-align: center;">
                    <button class="btn-qr" data-id="${a.id}" data-nombre="${a.nombre}" style="background: none; border: none; cursor: pointer; color: var(--text-main);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                    </button>
                </td>
                <td style="padding: 1rem;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${a.nombre}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${a.modelo}</div>
                </td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${a.categoria}</td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${a.serie}</td>
                <td style="padding: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-main);">${a.ubicacion}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.2rem;">${a.departamento}</div>
                </td>
                <td style="padding: 1rem;">
                    <span class="badge" style="padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 500; ${badgeStyle}">${a.estado}</span>
                </td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${a.responsable}</td>
                <td style="padding: 1rem; text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <a href="activo-detalle.html?id=${a.id}" style="color: var(--text-muted); padding: 0.4rem; border-radius: 6px;" title="Ver Detalle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>
                        <a href="activo-form.html?id=${a.id}" style="color: var(--text-muted); padding: 0.4rem; border-radius: 6px;" title="Editar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></a>
                        <button onclick="deleteAsset('${a.id}')" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.4rem; border-radius: 6px;" title="Eliminar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');

        if (showingText) {
            showingText.textContent = `Mostrando ${filtered.length} de ${activosData.length} activos`;
        }
        
        // Re-attach QR Modals
        document.querySelectorAll('.btn-qr').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const nom = e.currentTarget.dataset.nombre;
                assetNameModal.textContent = nom;
                assetCodeModal.textContent = id;
                assetDescModal.textContent = nom;
                // update image src
                const img = qrModal.querySelector('img');
                if(img) img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${id}`;
                
                qrModal.style.display = 'flex';
            });
        });
    }

    // Make globally available
    window.deleteAsset = (id) => {
        if (confirm('¿Está seguro de que desea eliminar este activo?')) {
            activosData = activosData.filter(a => a.id !== id);
            window.saveActivos(activosData); // Use window.saveActivos and pass data
            renderActivos();
            // Assuming 'ui' object with 'showToast' method exists globally or is defined elsewhere
            if (typeof ui !== 'undefined' && ui.showToast) {
                ui.showToast('Activo eliminado exitosamente', 'success');
            } else {
                console.log('Activo eliminado exitosamente');
            }
        }
    };

    renderActivos();

    // Filter Buttons logic
    filterTabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterTabs.forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--text-muted)';
                b.style.borderBottom = 'none';
            });
            e.currentTarget.classList.add('active');
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.borderBottom = '2px solid var(--primary)';
            
            const filterValue = e.currentTarget.textContent.trim();
            const searchInput = document.querySelector('.search-box input');
            renderActivos(filterValue, searchInput ? searchInput.value : '');
        });
    });

    // Search Logic
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.tab-btn.active').textContent.trim();
            renderActivos(activeFilter, e.target.value);
        });
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
