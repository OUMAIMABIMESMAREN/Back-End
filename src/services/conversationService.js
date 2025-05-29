import { authService } from './authService';

const API_URL = 'http://localhost:8080/api/conversations';

class ConversationService {
    async createConversation(participantId, organizerId) {
        try {
            const response = await fetch(`${API_URL}/create?participantId=${participantId}&organizerId=${organizerId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async getParticipantConversations(participantId) {
        try {
            const response = await fetch(`${API_URL}/participant/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch participant conversations');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching participant conversations:', error);
            throw error;
        }
    }

    async getOrganizerConversations(organizerId) {
        try {
            const response = await fetch(`${API_URL}/organizer/${organizerId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch organizer conversations');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching organizer conversations:', error);
            throw error;
        }
    }

    async getConversation(conversationId) {
        try {
            const response = await fetch(`${API_URL}/${conversationId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch conversation');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    async markConversationAsRead(conversationId) {
        try {
            const response = await fetch(`${API_URL}/${conversationId}/read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark conversation as read');
            }
        } catch (error) {
            console.error('Error marking conversation as read:', error);
            throw error;
        }
    }

    async deleteConversation(conversationId) {
        try {
            const response = await fetch(`${API_URL}/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete conversation');
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }

    async getUnreadConversationCount(userId) {
        try {
            const response = await fetch(`${API_URL}/unread/count/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread count');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    }
}

export const conversationService = new ConversationService(); 