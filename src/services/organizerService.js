import fetchApi from '../utils/apiInterceptor';

class OrganizerService {
    async getOrganizers() {
        const data = await fetchApi(`/organizer/All`);
        return data;
    }

    async getOrganizerById(id) {
        return await fetchApi(`/organizer/${id}`);
    }

    async getOrganizerDashboard(id) {
        return await fetchApi(`/organizer/${id}/dashboard`);
    }

    async updateOrganizer(id, organizerData) {
        return await fetchApi(`/organizer/${id}`, {
            method: 'PUT',
            body: JSON.stringify(organizerData),
        });
    }

    async getOrganizerEvents(id) {
        return await fetchApi(`/organizer/${id}/events`);
    }

    async getOrganizerStats(id) {
        return await fetchApi(`/organizer/${id}/stats`);
    }

    async searchOrganizers(name, location, category) {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (location) params.append('location', location);
        if (category) params.append('category', category);
        
        return await fetchApi(`/organizer/search?${params.toString()}`);
    }

    async getEventParticipants(organizerId, eventId) {
        return await fetchApi(`/organizer/${organizerId}/events/${eventId}/participants`);
    }
}

export const organizerService = new OrganizerService();
