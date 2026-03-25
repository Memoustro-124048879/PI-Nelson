document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const assetForm = document.getElementById('assetForm');
    const pageTitle = document.getElementById('pageTitle');
    
    // Detectar si es edición (por ID en URL)
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    if (assetId) {
        if (pageTitle) pageTitle.textContent = 'Editar Activo';
        loadAssetForEdit(assetId);
    }

    if (assetForm) {
        assetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(assetForm);
            const data = Object.fromEntries(formData.entries());

            // --- VALIDATION ---
            if (parseFloat(data.costo) < 0) {
                if (typeof ui !== 'undefined') {
                    ui.showToast('El costo no puede ser negativo', 'error');
                } else {
                    alert('Error: El costo no puede ser negativo');
                }
                return;
            }

            const submitBtn = assetForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Guardar';
            if (submitBtn) {
                submitBtn.innerHTML = 'Cargando...';
                submitBtn.disabled = true;
            }

            try {
                // Map frontend data structure to backend expected fields
                const payload = {
                    ...data,
                    // If backend expects specific ints for category:
                    categoria_id: parseInt(data.categoria_id) || null
                };

                let response;
                if (assetId) {
                    response = await apiFetch(`/activos/${assetId}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    });
                } else {
                    response = await apiFetch('/activos', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                }

                if (typeof ui !== 'undefined') ui.showToast(assetId ? 'Activo actualizado' : 'Activo creado correctamente', 'success');
                
                setTimeout(() => {
                    window.location.href = 'activos.html';
                }, 1000);
            } catch (err) {
                console.error('Error saving asset:', err);
                if (typeof ui !== 'undefined') {
                    ui.showToast('Error al guardar el activo', 'error');
                } else {
                    alert('Error al guardar el activo');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    async function loadAssetForEdit(id) {
        try {
            const storedAssets = localStorage.getItem('sigaf_assets');
            if (storedAssets) {
                const assets = JSON.parse(storedAssets);
                const asset = assets.find(a => a.id === id);
                if (asset) {
                    // Fill form fields
                    const fields = {
                        nombre: asset.nombre,
                        codigo: asset.id,
                        numero_serie: asset.serie,
                        modelo: asset.modelo,
                        marca: asset.marca || '',
                        fecha_adquisicion: asset.fecha_adquisicion || '',
                        costo: asset.costo || '',
                        proveedor: asset.proveedor || '',
                        vida_util: asset.vida_util || '',
                        ubicacion: asset.ubicacion,
                        departamento: asset.departamento,
                        estado: asset.estado,
                        observaciones: asset.observaciones || ''
                    };

                    // Map categories back to ID if needed
                    const catMap = { 'Herramientas': '1', 'Maquinaria': '2', 'Vehículos': '3', 'Equipos': '4', 'Mobiliario': '5' };
                    if (asset.categoria) {
                        const catId = catMap[asset.categoria];
                        if (catId) assetForm.querySelector('[name="categoria_id"]').value = catId;
                    }

                    Object.keys(fields).forEach(key => {
                        const el = assetForm.querySelector(`[name="${key}"]`);
                        if (el) el.value = fields[key];
                    });
                }
            }
        } catch (err) {
            console.error('Error loading asset:', err);
        }
    }
});
