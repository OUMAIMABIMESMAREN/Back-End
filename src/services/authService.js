const API_URL = 'http://localhost:8080/api/auth';

class AuthService {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.token) {
                // Store both token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    userId: data.userId,
                    role: data.role
                }));
            }
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const token = this.getToken();
            if (token) {
                const response = await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Always clear local storage, even if the API call fails
            this.clearAuth();
        }
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    async register(firstName, lastName, email, password, role) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    role
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        // Validate token format
        if (!token.includes('.')) {
            this.logout();
            return null;
        }
        
        return token;
    }

    // Add method to check if token needs refresh
    async checkAndRefreshToken() {
        if (!this.isAuthenticated()) {
            this.logout();
            return false;
        }
        return true;
    }
}

// Create and export a single instance
export const authService = new AuthService(); 