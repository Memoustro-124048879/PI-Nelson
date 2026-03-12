// public/js/escanear.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
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

    // 3. Camera Modal
    const modalCamera = document.getElementById('camera-modal');
    const btnOpenCamera = document.getElementById('btn-open-camera');
    const btnCloseCamera = document.getElementById('btn-close-camera');
    const btnCancelCamera = document.getElementById('btn-cancel-camera');
    const btnStartScan = document.getElementById('btn-start-scan');

    const closeCameraModal = () => modalCamera.classList.remove('active');

    btnOpenCamera.addEventListener('click', () => modalCamera.classList.add('active'));
    btnCloseCamera.addEventListener('click', closeCameraModal);
    btnCancelCamera.addEventListener('click', closeCameraModal);

    btnStartScan.addEventListener('click', () => {
        // Simular escaneo de QR y redirección
        alert('Simulando escaneo...\nRedirigiendo al detalle del activo...');
        closeCameraModal();
        // window.location.href = 'activo-detalle.html?id=QR-TQM-2024-001';
    });

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
