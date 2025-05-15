import api from '../utils/apiInterceptor';

class OrganizerService {
    async getOrganizers() {
        const response = await api.get('/organizers');
        return response.data;
    }

    async getOrganizerById(id) {
        const response = await api.get(`/organizers/${id}`);
        return response.data;
    }

    async updateOrganizer(id, organizerData) {
        const response = await api.put(`/organizers/${id}`, organizerData);
        return response.data;
    }

    async getOrganizerEvents(id) {
        const response = await api.get(`/organizers/${id}/events`);
        return response.data;
    }

    async getOrganizerStats(id) {
        const response = await api.get(`/organizers/${id}/stats`);
        return response.data;
    }
}

export const organizerService = new OrganizerService(); 