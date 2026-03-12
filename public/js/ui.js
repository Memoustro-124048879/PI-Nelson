/**
 * Sistema de notificaciones Toast para SIGAF-QR
 */
const ui = {
    /**
     * Muestra una notificación toast en pantalla
     * @param {string} message - El mensaje a mostrar
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duración en ms
     */
    showToast: (message, type = 'success', duration = 3000) => {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Icono basado en tipo
        let icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        if (type === 'error') icon = '✕';
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <p>${message}</p>
        `;

        container.appendChild(toast);

        // Animación de entrada
        setTimeout(() => toast.classList.add('active'), 100);

        // Eliminación automática
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};
