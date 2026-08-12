/**
 * api.js - Backend API Communication
 * Fence Depot Estimator
 */

const API = {
    BASE_URL: '/api',

    /**
     * Get auth token from storage
     */
    getToken() {
        return localStorage.getItem('fde_token');
    },

    /**
     * Build request headers
     */
    headers(includeAuth = true) {
        const h = { 'Content-Type': 'application/json' };
        if (includeAuth) {
            const token = this.getToken();
            if (token) h['Authorization'] = 'Bearer ' + token;
        }
        return h;
    },

    /**
     * Generic GET request
     */
    async get(endpoint) {
        try {
            const res = await fetch(this.BASE_URL + endpoint, {
                headers: this.headers()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('API GET error:', e);
            throw e;
        }
    },

    /**
     * Generic POST request
     */
    async post(endpoint, data, auth = true) {
        try {
            const res = await fetch(this.BASE_URL + endpoint, {
                method: 'POST',
                headers: this.headers(auth),
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('API POST error:', e);
            throw e;
        }
    },

    /**
     * Generic PUT request
     */
    async put(endpoint, data) {
        try {
            const res = await fetch(this.BASE_URL + endpoint, {
                method: 'PUT',
                headers: this.headers(),
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('API PUT error:', e);
            throw e;
        }
    },

    /**
     * Generic DELETE request
     */
    async delete(endpoint) {
        try {
            const res = await fetch(this.BASE_URL + endpoint, {
                method: 'DELETE',
                headers: this.headers()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('API DELETE error:', e);
            throw e;
        }
    },

    // --- Auth Endpoints ---
    auth: {
        login: (credentials) => API.post('/auth/login', credentials, false),
        logout: () => API.post('/auth/logout', {}),
        me: () => API.get('/auth/me')
    },

    // --- Estimates Endpoints ---
    estimates: {
        list: () => API.get('/estimates'),
        get: (id) => API.get(`/estimates/${id}`),
        create: (data) => API.post('/estimates', data),
        update: (id, data) => API.put(`/estimates/${id}`, data),
        delete: (id) => API.delete(`/estimates/${id}`),
        pdf: (id) => API.get(`/estimates/${id}/pdf`)
    },

    // --- Inventory Endpoints ---
    inventory: {
        list: () => API.get('/inventory'),
        get: (plu) => API.get(`/inventory/${plu}`)
    }
};
