// public/js/escanear.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof checkAuth !== 'undefined') checkAuth();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

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
                // Admin / Supervisor (though they shouldn't even be on this page per requirements)
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

    // 3. Camera Modal
    const modalCamera = document.getElementById('camera-modal');
    const btnOpenCamera = document.getElementById('btn-open-camera');
    const btnCloseCamera = document.getElementById('btn-close-camera');
    const btnCancelCamera = document.getElementById('btn-cancel-camera');

    let html5QrcodeScanner = null;

    const closeCameraModal = () => {
        modalCamera.classList.remove('active');
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => console.error("Failed to clear scanner", error));
            html5QrcodeScanner = null;
        }
    };

    function onScanSuccess(decodedText) {
        closeCameraModal();
        window.location.href = `activo-detalle.html?id=${encodeURIComponent(decodedText)}`;
    }

    btnOpenCamera.addEventListener('click', () => {
        modalCamera.classList.add('active');
        html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }
        );
        html5QrcodeScanner.render(onScanSuccess, undefined);
    });

    btnCloseCamera.addEventListener('click', closeCameraModal);
    if(btnCancelCamera) btnCancelCamera.addEventListener('click', closeCameraModal);

    // 4. Manual Search Form
    const manualForm = document.getElementById('manual-search-form');
    manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('manual_code').value;
        alert(`Buscando activo con código: ${code}`);
        // window.location.href = `activo-detalle.html?id=${code}`;
    });

    // 5. Load Recent Scans
    loadRecentScans();

    async function loadRecentScans() {
        try {
            // Ejemplo de llamada real:
            /*
            const res = await fetch('/api/escanear/recientes', { headers });
            const data = await res.json();
            */

            // Mock Data matching Figma Image 1
            const data = [
                {
                    activo: 'Torquímetro Digital SNAP-ON',
                    codigo: 'QR-TQM-2024-001',
                    ubicacion: 'Planta Principal - Área de Ensamble'
                },
                {
                    activo: 'Puente Grúa 5 Toneladas',
                    codigo: 'QR-GRU-2023-042',
                    ubicacion: 'Planta Principal - Almacén Central'
                }
            ];

            const container = document.getElementById('recent-scans');
            container.innerHTML = data.map(item => `
                <div class="list-item" style="align-items: center;">
                    <div class="item-icon" style="background-color: transparent; border: 1px solid var(--border-color); color: var(--text-main);">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line></svg>
                    </div>
                    <div class="item-details" style="flex:1;">
                        <h4>${item.activo}</h4>
                        <p>${item.codigo} &middot; ${item.ubicacion}</p>
                    </div>
                    <button class="btn-outline" style="border-radius: 6px; padding: 0.4rem 1rem;" onclick="alert('Ver detalle del activo: ${item.codigo}')">
                        Ver
                    </button>
                </div>
            `).join('');

        } catch (error) {
            console.error(error);
        }
    }
});
