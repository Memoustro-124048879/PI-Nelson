// public/js/reporte-form.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Set Profile Information
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';

    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Setup Layout Interactions
    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
        if (userRole === 'Trabajador') {
            btnScan.style.display = 'flex';
        } else {
            btnScan.style.display = 'none';
        }
        btnScan.addEventListener('click', () => {
            window.location.href = 'escanear.html';
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // 4. Load activos into the select dropdown
    const activoSelect = document.getElementById('activo_id');
    if (activoSelect) {
        apiFetch('/activos').then(activos => {
            activos.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = `${a.qr_code || a.id} - ${a.nombre}`;
                activoSelect.appendChild(opt);
            });
        }).catch(err => {
            console.warn('No se pudieron cargar los activos:', err);
        });
    }

    // 5. Prefill date input dynamically with today's date
    const dateInput = document.querySelector('input[name="fecha"]');
    if (dateInput) {
        const today = new Date();
        const yy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yy}-${mm}-${dd}`;
    }

    const showToast = (msg, type = 'info') => {
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(msg, type);
        } else {
            alert(msg);
        }
    };

    // 6. Form Submission — save to API
    const newReportForm = document.getElementById('newReportForm');
    if (newReportForm) {
        newReportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(newReportForm);

            const payload = {
                titulo: formData.get('titulo'),
                tipo: formData.get('tipo') || formData.get('categoria'),
                activo_id: formData.get('activo_id'),
                ubicacion_evento: formData.get('ubicacion_evento') || formData.get('ubicacion') || 'General',
                notas: formData.get('notas') || formData.get('descripcion') || '',
                subtipo: formData.get('subtipo') || null,
                gravedad: formData.get('gravedad') || null,
            };

            if (!payload.activo_id) {
                showToast('Debe seleccionar un activo', 'error');
                return;
            }

            const submitBtn = newReportForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Crear Reporte';
            if (submitBtn) {
                submitBtn.innerHTML = 'Guardando...';
                submitBtn.disabled = true;
            }

            try {
                await apiFetch('/reportes', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                showToast('Reporte creado exitosamente', 'success');
                setTimeout(() => {
                    window.location.href = 'reportes.html';
                }, 800);
            } catch (err) {
                console.error('Error creando reporte:', err);
                showToast('Error al crear el reporte: ' + (err.message || 'Error desconocido'), 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});
