const BASE_URL = 'http://127.0.0.1:8001/api';

/**
 * Wrapper for fetch that includes Authorization header if token exists
 * @param {string} endpoint - The API endpoint (e.g., '/login')
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login if not already there
            localStorage.removeItem('access_token');
            if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                window.location.href = 'index.html';
            }
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw { status: response.status, data };
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
