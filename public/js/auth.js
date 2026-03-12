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
            // Redirect to dashboard
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
        window.location.href = 'index.html';
    }
}

/**
 * Checks if user is logged in based on token existence
 * @returns {boolean}
 */
function isAuthenticated() {
    return localStorage.getItem('access_token') !== null;
}

/**
 * Redirects to login if not authenticated
 */
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
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
