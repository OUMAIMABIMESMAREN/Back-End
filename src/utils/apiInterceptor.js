import { authService } from '../services/authService';

const BASE_URL = 'http://localhost:8080/api';

async function fetchApi(endpoint, options = {}) {
    const token = authService.getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : null,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Handle 401 (unauthorized)
        if (response.status === 401) {
            authService.logout();
            window.location.href = '/Auth/login';
            throw new Error('Unauthorized');
        }

        // Handle 403 (forbidden)
        if (response.status === 403) {
            throw new Error('Forbidden: You do not have permission.');
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        // Parse JSON if available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return response;
    } catch (error) {
        console.error('Fetch API Error:', error);
        throw error;
    }
}

export default fetchApi;
