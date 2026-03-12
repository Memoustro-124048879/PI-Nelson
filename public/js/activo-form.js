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

            try {
                const method = assetId ? 'PUT' : 'POST';
                const url = assetId ? `/activos/${assetId}` : '/activos';
                
                // await apiFetch(url, {
                //     method: method,
                //     body: JSON.stringify(data)
                // });

                // UI Feedback (Demo simulation)
                localStorage.setItem('last_action', assetId ? 'edit_success' : 'create_success');
                window.location.href = 'activos.html';
            } catch (err) {
                console.error('Error saving asset:', err);
                if (typeof ui !== 'undefined') ui.showToast('Error al guardar el activo', 'error');
            }
        });
    }

    async function loadAssetForEdit(id) {
        try {
            // const asset = await apiFetch(`/activos/${id}`);
            // console.log('Llenando formulario con:', asset);
        } catch (err) {
            console.error('Error loading asset:', err);
        }
    }
});
