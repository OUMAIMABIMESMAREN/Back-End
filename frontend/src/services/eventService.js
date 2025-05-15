import { authService } from './authService';

const API_URL = 'http://localhost:8080/api';

class EventService {
    async getUpcomingEvents() {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events/upcoming`, {
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
            console.error('Error fetching upcoming events:', error);
            throw error;
        }
    }

    async getEventById(id) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events/${id}`, {
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
            console.error('Error fetching event:', error);
            throw error;
        }
    }

    async createEvent(eventData) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    async updateEvent(id, eventData) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    async deleteEvent(id) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
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
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    async getEventParticipants(id) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_URL}/events/${id}/participants`, {
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
            console.error('Error fetching event participants:', error);
            throw error;
        }
    }
}

export const eventService = new EventService(); 