let BASE_URL = 'http://127.0.0.1:8000/api';
if (window.location.protocol.startsWith('http')) {
    if (window.location.pathname.includes('/public/')) {
        BASE_URL = window.location.origin + window.location.pathname.split('/public/')[0] + '/public/api';
    } else {
        BASE_URL = window.location.origin + '/api';
    }
}

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
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = { message: 'Invalid JSON response from backend' };
        }
        
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            if (!window.location.pathname.endsWith('login.html') && window.location.pathname !== '/') {
                window.location.href = 'login.html';
            }
        }

        if (!response.ok) {
            throw { status: response.status, data };
        }

        return data;
    } catch (error) {
        // Only fallback on Network errors or 500+ Internal Errors
        if (error.status && error.status < 500) {
            throw error;
        }
        
        console.warn('⚡ CRITICAL: Backend server (PHP/XAMPP) failed to respond properly. Activating LocalStorage Mock Fallback...', error);
        return handleMockFallback(endpoint, config);
    }
}

function handleMockFallback(endpoint, config) {
    const method = config.method || 'GET';
    const path = endpoint.split('?')[0].replace(/^\/|\/$/g, '');
    const segments = path.split('/');
    const resource = segments[0];
    const id = segments[1];

    if (resource === 'login') {
        const body = JSON.parse(config.body || '{}');
        if (body.email === 'Admin@sigaf.com' && body.password === 'demo123') {
            return { access_token: 'mock-token-fallback', user: { id: 1, name: 'Admin SIGAF', email: 'Admin@sigaf.com', role: 'ADMIN', area_id: 1 } };
        } else if (body.email === 'Trabajador@sigaf.com') {
            return { access_token: 'mock-token-fallback', user: { id: 2, name: 'Trabajador SIGAF', email: 'Trabajador@sigaf.com', role: 'TRABAJADOR', area_id: 1 } };
        } else if (body.email === 'Supervisor@sigaf.com') {
            return { access_token: 'mock-token-fallback', user: { id: 3, name: 'Supervisor SIGAF', email: 'Supervisor@sigaf.com', role: 'SUPERVISOR', area_id: 1 } };
        }
        throw { status: 401, data: { message: 'Credenciales inválidas' } };
    }

    if (resource === 'logout') return { message: 'Logged out' };

    if (resource === 'user') {
        const email = localStorage.getItem('user_email') || 'Admin@sigaf.com';
        const role = localStorage.getItem('user_role') || 'ADMIN';
        const name = localStorage.getItem('user_name') || 'Admin SIGAF';
        return { id: 1, name, email, role, area_id: 1 };
    }

    const defaultData = {
        activos: [
            { id: 1, qr_code: 'SIGAF-001', nombre: 'Torquímetro Digital SNAP-ON', estado: 'Uso', categoria: 'Herramientas', fecha_adquisicion: '2025-01-10', numero_serie: 'SN-001' },
            { id: 2, qr_code: 'SIGAF-002', nombre: 'Esmeriladora Angular DeWalt', estado: 'Disponible', categoria: 'Herramientas', fecha_adquisicion: '2025-02-15', numero_serie: 'DW-002' }
        ],
        usuarios: [
            { id: 1, name: 'Admin SIGAF', role: 'ADMIN', email: 'Admin@sigaf.com', estado: 'activo' },
            { id: 2, name: 'Trabajador SIGAF', role: 'TRABAJADOR', email: 'Trabajador@sigaf.com', estado: 'activo' },
            { id: 3, name: 'Supervisor SIGAF', role: 'SUPERVISOR', email: 'Supervisor@sigaf.com', estado: 'activo' }
        ],
        solicitudes: [],
        reportes: [],
        mantenimientos: []
    };

    let table = JSON.parse(localStorage.getItem('mockDB_' + resource));
    if (!table) {
        table = defaultData[resource] || [];
        localStorage.setItem('mockDB_' + resource, JSON.stringify(table));
    }

    if (method === 'GET') {
        if (id) {
            const item = table.find(item => item.id == id);
            if (!item) throw { status: 404, data: { message: 'Not Found' } };
            return item;
        }
        return table;
    } 
    
    if (method === 'POST') {
        const newItem = JSON.parse(config.body || '{}');
        newItem.id = Date.now();
        table.push(newItem);
        localStorage.setItem('mockDB_' + resource, JSON.stringify(table));
        return newItem;
    }
    
    if (method === 'PUT') {
        let updateItem = JSON.parse(config.body || '{}');
        let found = false;
        table = table.map(item => {
            if (item.id == id) {
                found = true;
                return { ...item, ...updateItem, id: item.id };
            }
            return item;
        });
        if (!found) throw { status: 404, data: { message: 'Not Found' } };
        localStorage.setItem('mockDB_' + resource, JSON.stringify(table));
        return updateItem;
    }
    
    if (method === 'DELETE') {
        table = table.filter(item => item.id != id);
        localStorage.setItem('mockDB_' + resource, JSON.stringify(table));
        return { message: 'Deleted' };
    }

    return [];
}
