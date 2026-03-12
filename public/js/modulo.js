document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    checkAuth();

    // Logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Tabs logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Actualizar botones
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualizar contenidos
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });

    /**
     * Cargar datos del perfil desd la API
     */
    async function fetchProfileData() {
        try {
            const user = await apiFetch('/user');
            
            // Actualizar campos del DOM
            const fields = {
                'profileName': user.name,
                'profileEmail': user.email,
                'full_name': user.name,
                'email_info': user.email,
                'username': user.username || user.email.split('@')[0]
            };

            for (const [id, value] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && value) el.textContent = value;
            }
        } catch (err) {
            console.warn('Error al cargar datos del perfil:', err);
        }
    }

    fetchProfileData();
});
