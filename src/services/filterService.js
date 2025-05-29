import api from '../utils/apiInterceptor';

class FilterService {
    async filterEvents(filterDTO) {
        const response = await api.post('/api/filters/events', filterDTO);
        return response.data;
    }

    async searchEvents(searchTerm, filterDTO) {
        const response = await api.get(`/api/filters/events/search?searchTerm=${searchTerm}`, { data: filterDTO });
        return response.data;
    }

    async filterByCategory(category, filterDTO) {
        const response = await api.get(`/api/filters/events/category/${category}`, { data: filterDTO });
        return response.data;
    }

    async filterByLocation(location, filterDTO) {
        const response = await api.get(`/api/filters/events/location/${location}`, { data: filterDTO });
        return response.data;
    }

    async filterByPrice(price, filterDTO) {
        const response = await api.get(`/api/filters/events/price/${price}`, { data: filterDTO });
        return response.data;
    }
}

export const filterService = new FilterService(); 