document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Set Profile
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userRole = localStorage.getItem('user_role') || 'Invitado';
    const userRoleUpper = userRole.toUpperCase();

    // UI elements
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if (sidebarName) sidebarName.textContent = userName;
    if (sidebarRole) sidebarRole.textContent = userRole;
    if (sidebarAvatar) sidebarAvatar.textContent = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // 3. Role-Based Sidebar Navigation
    updateNavigation(userRoleUpper);

    function updateNavigation(role) {
        const navMenu = document.querySelector('.nav-menu');
        const btnScan = document.getElementById('btn-scan');

        // Nav items filtering
        const items = navMenu.querySelectorAll('.nav-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const text = link.textContent.trim();

            if (role === 'TRABAJADOR') {
                const allowed = ['Dashboard', 'Solicitudes'];
                if (!allowed.includes(text)) item.style.display = 'none';
            } else {
                // Admin / Supervisor
                if (text === 'Escanear QR') item.style.display = 'none';
            }
        });

        // QR Button logic
        if (btnScan) {
            if (role === 'TRABAJADOR') {
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

    // Fetch Data from API
    let activosData = [];

    async function fetchActivos() {
        try {
            activosData = await apiFetch('/activos');
            renderActivos();
        } catch (e) {
            if (typeof ui !== 'undefined') ui.showToast('Error conectando al servidor', 'error');
        }
    }

    const exportBtn = document.querySelector('.page-header .btn-secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (typeof window.jspdf === 'undefined') return alert('Librería PDF no cargada');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape');
            
            doc.setFontSize(18);
            doc.text('Reporte General de Activos Fijos - SIGAF', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["CÓDIGO QR", "NOMBRE / MODELO", "CATEGORÍA", "SERIE", "UBICACIÓN", "ESTADO"];
            const tableRows = [];

            activosData.forEach(asset => {
                const assetData = [
                    asset.qr_code || asset.id,
                    `${asset.nombre}\n${asset.modelo || ''}`,
                    asset.categoria_id || asset.categoria || '-',
                    asset.numero_serie || asset.serie || '-',
                    asset.area ? asset.area.nombre : (asset.ubicacion || '-'),
                    asset.estado || 'Disponible',
                ];
                tableRows.push(assetData);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save(`SIGAF_Activos_${new Date().toISOString().split('T')[0]}.pdf`);
        });
    }

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
            const q = search.toLowerCase();
            filtered = filtered.filter(a => 
                (a.nombre || '').toLowerCase().includes(q) || 
                (a.numero_serie || a.serie || '').toLowerCase().includes(q) || 
                (a.qr_code || String(a.id) || '').toLowerCase().includes(q)
            );
        }

        tableBody.innerHTML = filtered.map(a => {
            const estado = a.estado || 'Disponible';
            let badgeStyle = '';
            if (estado === 'En Uso') badgeStyle = 'background: #e0e7ff; color: #3730A3;';
            else if (estado === 'Disponible') badgeStyle = 'background: #dcfce7; color: #166534;';
            else if (estado === 'Mantenimiento') badgeStyle = 'background: #fef9c3; color: #854d0e;';

            // Backend fields logic handling
            const qrCode = a.qr_code || a.id;
            const nombre = a.nombre || 'Sin nombre';
            const modelo = a.modelo || '';
            const categoria = a.categoria_id || a.categoria || '-';
            const serie = a.numero_serie || a.serie || '-';
            const ubicacion = a.area ? a.area.nombre : (a.ubicacion || '-');
            const responsable = a.responsable || '-';

            return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td class="qr-cell" style="padding: 1rem; text-align: center;">
                    <button class="btn-qr" data-id="${qrCode}" data-nombre="${nombre}" style="background: none; border: none; cursor: pointer; color: var(--text-main);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                    </button>
                </td>
                <td style="padding: 1rem;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${nombre}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${modelo}</div>
                </td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${categoria}</td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${serie}</td>
                <td style="padding: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-main);">${ubicacion}</div>
                </td>
                <td style="padding: 1rem;">
                    <span class="badge" style="padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 500; ${badgeStyle}">${estado}</span>
                </td>
                <td style="padding: 1rem; font-size: 0.9rem; color: var(--text-main);">${responsable}</td>
                <td style="padding: 1rem; text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <a href="activo-detalle.html?id=${qrCode}" style="color: var(--text-muted); padding: 0.4rem; border-radius: 6px;" title="Ver Detalle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>
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

    window.deleteAsset = async (id) => {
        if (confirm('¿Está seguro de que desea eliminar este activo?')) {
            try {
                await apiFetch(`/activos/${id}`, { method: 'DELETE' });
                activosData = activosData.filter(a => a.id != id);
                renderActivos();
                if (typeof ui !== 'undefined' && ui.showToast) {
                    ui.showToast('Activo eliminado exitosamente', 'success');
                }
            } catch (err) {
                if (typeof ui !== 'undefined') ui.showToast('Error al eliminar', 'error');
            }
        }
    };

    fetchActivos();

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

    // Modal QR Print/Download logic
    const btnPrintQr = document.getElementById('btn-print-qr');
    const btnDownloadQr = document.getElementById('btn-download-qr-modal');

    if (btnPrintQr) {
        btnPrintQr.addEventListener('click', () => {
            const qrImg = qrModal.querySelector('img').src;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;"><img src="${qrImg}" style="width: 300px; height: 300px;" /></body></html>`);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
        });
    }

    if (btnDownloadQr) {
        btnDownloadQr.addEventListener('click', async () => {
            try {
                btnDownloadQr.innerHTML = 'Descargando...';
                const id = assetCodeModal.textContent;
                const hrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${id}&format=png`;
                const res = await fetch(hrUrl, { mode: 'cors' });
                if(!res.ok) throw new Error('Network');
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `SIGAF-QR-${id}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } catch(e) {
                console.warn('CORS blocked QR fetch, opening in new tab instead.');
                const hrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${assetCodeModal.textContent}&format=png`;
                window.open(hrUrl, '_blank');
            } finally {
                btnDownloadQr.innerHTML = 'Descargar';
            }
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
