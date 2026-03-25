/**
 * Handles user login
 * @param {string} email 
 * @param {string} password 
 */
async function login(email, password) {
    try {
        const response = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            if(response.user) {
                localStorage.setItem('user_name', response.user.name);
                localStorage.setItem('user_role', response.user.role);
                localStorage.setItem('user_email', response.user.email);
            }
            window.location.href = 'dashboard.html';
        }
        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Handles user logout
 */
async function logout() {
    try {
        await apiFetch('/logout', { method: 'POST' });
    } catch (error) {
        console.warn('Logout request failed, clearing local token anyway');
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        window.location.href = 'login.html';
    }
}

function isAuthenticated() {
    return localStorage.getItem('access_token') !== null || localStorage.getItem('token') !== null;
}

const auth = {
    isLoggedIn: isAuthenticated
};

function loadSidebar() {
    const userName = localStorage.getItem('user_name') || 'Miguel Torres';
    const userRole = localStorage.getItem('user_role') || 'Trabajador';
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    if(sidebarName) sidebarName.textContent = userName;
    if(sidebarRole) sidebarRole.textContent = userRole;
    if(sidebarAvatar) {
        const initials = userName.split(' ').map(n=>n[0]).join('').substring(0, 2);
        sidebarAvatar.textContent = initials.toUpperCase();
    }
}

/**
 * Redirects to login if not authenticated
 */
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

/**
 * Redirects to dashboard if already authenticated (for login page)
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}
