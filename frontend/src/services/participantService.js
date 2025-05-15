import { authService } from './authService';

const API_URL = 'http://localhost:8080/api';

class ParticipantService {
    async getProfile() {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }
                console.log("this has to be valid and none empty in every request sent to backand ",token);
                const response = await fetch(`http://localhost:8080/api/participants/profile`, {
                method: 'GET',
                headers: {
                // 403 means you  didnt sentd this token here verify why by pritining and verfying value that reachs backend
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async getParticipants() {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/participants`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching participants:', error);
            throw error;
        }
    }

    async getParticipantById(id) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/participants/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching participant:', error);
            throw error;
        }
    }

    async updateProfile(profileData) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/participants/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    async updateNewsletterFrequency(frequency) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/participants/newsletter-frequency`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ frequency })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating newsletter frequency:', error);
            throw error;
        }
    }

    async getParticipantReservations(id) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/participants/${id}/reservations`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching participant reservations:', error);
            throw error;
        }
    }

    async createReservation(eventId, participantId, ticketData) {
        try {
            if (!await authService.checkAndRefreshToken()) {
                throw new Error('Authentication required');
            }

            const token = authService.getToken();
            const response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    eventId,
                    participantId,
                    ...ticketData
                })
            });

            if (response.status === 403) {
                authService.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    }

    async cancelReservation(reservationId) {
        try {
            if (!await authService.checkAndRefreshToken()) {
                throw new Error('Authentication required');
            }

            const token = authService.getToken();
            const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.status === 403) {
                authService.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            throw error;
        }
    }

    async getTestAuth() {
        try {
            const token = authService.getToken(); // make sure this returns a valid JWT

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log("Sending token to /test-auth:", token);

            const response = await fetch(`${API_URL}/test-auth`, { // Note: URL is not using API_URL
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text(); // use .json() if you return a JSON object from backend
            console.log("Response from /test-auth:", data);
            return data;
        } catch (error) {
            console.error('Error calling /test-auth:', error);
            throw error;
        }
    }
}

export const participantService = new ParticipantService();