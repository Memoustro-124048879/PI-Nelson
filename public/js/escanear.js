// public/js/escanear.js
document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Set Profile
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = (localStorage.getItem('user_role') || '').toUpperCase();

    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = localStorage.getItem('user_role') || 'Invitado';
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Role-Based Sidebar Navigation
    updateNavigation(userRole);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');

        if (!navMenu) return;

        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            const text = link.textContent.trim();

            if (role === 'TRABAJADOR') {
                const allowed = ['Dashboard', 'Solicitudes', 'Escanear QR'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });

        // QR Button logic
        if (btnScan) {
            btnScan.style.display = role === 'TRABAJADOR' ? 'flex' : 'none';
        }
    }

    // Logout Logic
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logout !== 'undefined') logout();
            else { localStorage.clear(); window.location.href = 'login.html'; }
        });
    }

    // 4. Camera Modal
    const modalCamera = document.getElementById('camera-modal');
    const btnOpenCamera = document.getElementById('btn-open-camera');
    const btnCloseCamera = document.getElementById('btn-close-camera');
    const btnCancelCamera = document.getElementById('btn-cancel-camera');

    let html5QrcodeScanner = null;

    const closeCameraModal = () => {
        if (modalCamera) modalCamera.classList.remove('active');
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => console.error("Failed to clear scanner", error));
            html5QrcodeScanner = null;
        }
    };

    function onScanSuccess(decodedText) {
        closeCameraModal();
        // Navigate to asset detail using the scanned QR code
        window.location.href = `activo-detalle.html?id=${encodeURIComponent(decodedText)}`;
    }

    if (btnOpenCamera) {
        btnOpenCamera.addEventListener('click', () => {
            if (modalCamera) modalCamera.classList.add('active');
            if (typeof Html5QrcodeScanner !== 'undefined') {
                html5QrcodeScanner = new Html5QrcodeScanner(
                    "qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }
                );
                html5QrcodeScanner.render(onScanSuccess, undefined);
            } else {
                if (typeof ui !== 'undefined') ui.showToast('Librería QR no cargada', 'error');
                else alert('Librería QR no cargada. Verifique la conexión a internet.');
            }
        });
    }

    if (btnCloseCamera) btnCloseCamera.addEventListener('click', closeCameraModal);
    if (btnCancelCamera) btnCancelCamera.addEventListener('click', closeCameraModal);

    // 5. Manual Search Form — actually navigate to the asset
    const manualForm = document.getElementById('manual-search-form');
    if (manualForm) {
        manualForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('manual_code').value.trim();
            if (!code) return;

            try {
                // Try to find the asset by QR code
                const assets = await apiFetch('/activos');
                const found = assets.find(a => 
                    (a.qr_code && a.qr_code.toLowerCase() === code.toLowerCase()) ||
                    String(a.id) === code
                );
                if (found) {
                    window.location.href = `activo-detalle.html?id=${encodeURIComponent(found.qr_code || found.id)}`;
                } else {
                    if (typeof ui !== 'undefined') ui.showToast(`No se encontró activo con código: ${code}`, 'error');
                    else alert(`No se encontró activo con código: ${code}`);
                }
            } catch (err) {
                console.error(err);
                if (typeof ui !== 'undefined') ui.showToast('Error al buscar el activo', 'error');
            }
        });
    }

    // 6. Load Recent Assets (last 3 from API)
    loadRecentScans();

    async function loadRecentScans() {
        try {
            const assets = await apiFetch('/activos');
            const recent = assets.slice(0, 3);

            const container = document.getElementById('recent-scans');
            if (!container) return;

            if (recent.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); padding: 1rem 0;">No hay activos registrados aún.</p>';
                return;
            }

            container.innerHTML = recent.map(item => `
                <div class="list-item" style="align-items: center;">
                    <div class="item-icon" style="background-color: transparent; border: 1px solid var(--border-color); color: var(--text-main);">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line></svg>
                    </div>
                    <div class="item-details" style="flex:1;">
                        <h4>${item.nombre}</h4>
                        <p>${item.qr_code || item.id} &middot; ${item.area ? item.area.nombre : 'Sin área'}</p>
                    </div>
                    <a href="activo-detalle.html?id=${encodeURIComponent(item.qr_code || item.id)}" class="btn-outline" style="border-radius: 6px; padding: 0.4rem 1rem; text-decoration: none;">
                        Ver
                    </a>
                </div>
            `).join('');

        } catch (error) {
            console.error(error);
        }
    }
});
