document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Modal Damage Report Control
    const damageModal = document.getElementById('damageModal');
    const reportBtn = document.getElementById('reportDamageBtn');
    const closeModals = document.querySelectorAll('.close-modal');

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            damageModal.style.display = 'flex';
        });
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            damageModal.style.display = 'none';
        });
    });

    // Close on overlay click
    if (damageModal) {
        damageModal.addEventListener('click', (e) => {
            if (e.target === damageModal) {
                damageModal.style.display = 'none';
            }
        });
    }

    // Form Submission
    const damageForm = document.getElementById('damageForm');
    if (damageForm) {
        damageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            ui.showToast('Reporte enviado exitosamente', 'success');
            setTimeout(() => {
                damageModal.style.display = 'none';
            }, 500);
        });
    }

    // Edit Button & Fetch Logic
    const editBtn = document.querySelector('.btn-login'); 
    const urlParams = new URLSearchParams(window.location.search);
    const rawAssetId = urlParams.get('id');
    const assetId = rawAssetId ? rawAssetId.replace('QR-', '') : ''; // Cleanup if decoded text has QR-

    if (editBtn && assetId) {
        editBtn.addEventListener('click', () => {
            window.location.href = `activo-form.html?id=${assetId}`;
        });
    }

    async function loadAssetDetail() {
        if (!assetId) {
            ui.showToast('ID de activo no proporcionado', 'error');
            return;
        }

        try {
            // First we need to search for it, or get it directly if ID is numeric
            // Since QR uses `SIGAF-XXXX`, let's assume the endpoint handles id or qr_code
            // We'll update AssetController to allow findBy qr_code later. Let's just assume we fetch all and find it for now if it's string.
            const assets = await apiFetch('/activos');
            const asset = assets.find(a => a.qr_code === assetId || a.id == assetId);

            if (!asset) {
                ui.showToast('Activo no encontrado', 'error');
                return;
            }

            // Update DOM Map
            document.querySelector('h1').textContent = asset.nombre;
            document.querySelector('.page-header p').textContent = asset.qr_code;
            
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${asset.qr_code}`;
            const qrImg = document.querySelector('.qr-box img');
            if (qrImg) qrImg.src = qrUrl;

            document.querySelector('.qr-large-card h4').textContent = asset.qr_code;
            document.querySelector('.badge-status').textContent = asset.estado || 'Disponible';

            // Safe filler helper
            const fillField = (labelContains, value) => {
                const labels = document.querySelectorAll('.data-field label');
                const label = Array.from(labels).find(l => l.textContent.includes(labelContains));
                if (label && label.nextElementSibling) {
                    label.nextElementSibling.textContent = value || 'N/A';
                }
            };

            fillField('Nombre del', asset.nombre);
            fillField('Código Interno', asset.qr_code);
            fillField('Número de Serie', asset.numero_serie);
            fillField('Marca', asset.marca);
            fillField('Modelo', asset.modelo);
            fillField('Fecha de Adq', asset.fecha_adquisicion);
            fillField('Costo de', asset.costo_adquisicion ? `$${asset.costo_adquisicion} MXN` : 'N/A');
            fillField('Proveedor', asset.proveedor);
            fillField('Vida Útil', asset.vida_util ? `${asset.vida_util} años` : 'N/A');

            // Download High-Res QR Button
            const downloadBtn = document.querySelector('.page-header .btn-secondary');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', async () => {
                    downloadBtn.innerHTML = 'Descargando...';
                    try {
                        const hrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${asset.qr_code}&format=png`;
                        const res = await fetch(hrUrl, { mode: 'cors' });
                        if(!res.ok) throw new Error('Network');
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `${asset.qr_code}-highres.png`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                    } catch (e) {
                        console.warn('CORS blocked blob download. Applying fallback.');
                        // Fallback: Open URL directly or use an anchor without blob
                        const link = document.createElement('a');
                        link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${asset.qr_code}&format=png`;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    } finally {
                        downloadBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Descargar QR';
                    }
                });
            }

        } catch (error) {
            console.error(error);
            ui.showToast('Error cargando detalles', 'error');
        }
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logout === 'function') logout();
            else {
                localStorage.clear();
                window.location.href = 'login.html';
            }
        });
    }

    loadAssetDetail();
});
