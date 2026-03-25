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
    const searchInput = document.querySelector('.search-box input'); // Define it here to avoid ReferenceError

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

    // Helper for safe toast calls
    const showToast = (msg, type = 'info') => {
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(msg, type);
        } else {
            console.log(`[Toast] ${type}: ${msg}`);
            alert(msg);
        }
    };

    // Logout Logic replacement for auth.logout
    const logout = () => {
        localStorage.clear();
        window.location.href = 'login.html';
    };

    // Sidebar Active State
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

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

    // --- Dynamic Users Management ---
    let usersData = [];
    const usersList = document.getElementById('usersList');
    const newEmployeeModal = document.getElementById('newEmployeeModal');
    const newEmployeeForm = document.getElementById('newEmployeeForm');
    const openNewUserBtn = document.querySelector('.btn-login'); // "Nuevo Usuario" button

    function renderUsers(query = '') {
        const filtered = query ? usersData.filter(u => 
            u.nombre.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query) || 
            u.departamento.toLowerCase().includes(query)
        ) : usersData;

        usersList.innerHTML = filtered.map(u => `
            <div class="user-card" style="background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div style="display: flex; gap: 1.5rem;">
                    <div class="user-avatar-large" style="width: 56px; height: 56px; background-color: var(--bg-dark); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 600; flex-shrink: 0;">
                        ${u.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    
                    <div style="flex-grow: 1;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <h3 style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${u.nombre}</h3>
                            <span class="badge" style="background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">${u.rol}</span>
                            <div style="width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%;"></div>
                        </div>
                        
                        <div style="display: flex; gap: 1.5rem; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
                            <span style="display: flex; align-items: center; gap: 0.4rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                ${u.email}
                            </span>
                            <span style="display: flex; align-items: center; gap: 0.4rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                ${u.departamento}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Update Stats
        const stats = document.querySelectorAll('.user-stat-card h2');
        if (stats.length >= 1) stats[0].textContent = usersData.length;
        if (stats.length >= 3) {
            const departments = new Set(usersData.map(u => u.departamento));
            stats[2].textContent = departments.size;
        }
    }

    async function initUsers() {
        try {
            usersData = await apiFetch('/usuarios');
            // Mapping backend fields to frontend format
            usersData = usersData.map(u => ({
                id: u.id,
                nombre: u.name,
                email: u.email,
                departamento: (u.area_id ? 'Área ' + u.area_id : 'Global'), 
                rol: u.role
            }));
            renderUsers();
        } catch (e) {
            showToast('Error cargando usuarios', 'error');
        }
    }

    // Modal Events
    if (openNewUserBtn) {
        openNewUserBtn.addEventListener('click', () => {
            newEmployeeModal.style.display = 'flex';
        });
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            newEmployeeModal.style.display = 'none';
        });
    });

    if (newEmployeeForm) {
        newEmployeeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = newEmployeeForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'Guardar';
            if (btn) btn.innerHTML = 'Cargando...';

            try {
                const formData = new FormData(newEmployeeForm);
                const payload = {
                    name: formData.get('nombre'),
                    email: formData.get('email'),
                    password: 'demo123', // Default
                    role: formData.get('rol').toUpperCase() === 'ADMIN' ? 'ADMIN' : (formData.get('rol').toUpperCase() === 'SUPERVISOR' ? 'SUPERVISOR' : 'TRABAJADOR'),
                    estado: 'activo'
                };

                await apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(payload) });
                
                showToast('Empleado añadido exitosamente', 'success');
                newEmployeeModal.style.display = 'none';
                newEmployeeForm.reset();
                initUsers();
            } catch (err) {
                showToast('Error al añadir empleado', 'error');
            } finally {
                if (btn) btn.innerHTML = originalText;
            }
        });
    }

    // Search Logic Update
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderUsers(e.target.value.toLowerCase());
        });
    }

    initUsers();
});
