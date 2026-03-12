document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Search simulation
    const searchInput = document.querySelector('.search-box input');
    const employeeCards = document.querySelectorAll('#employeesList .section-box');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            employeeCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const dept = card.querySelector('span[style*="path"]').parentElement.textContent.toLowerCase();
                if (name.includes(query) || dept.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
