import api from './api';

export interface Neighborhood {
    id: number;
    name: string;
    populationEstimate: number | null;
    postalCode: string;
    latitude: number;
    longitude: number;
    routeId: number;
}

export const neighborhoodService = {
    async list(routeId?: number): Promise<Neighborhood[]> {
        const response = await api.get<Neighborhood[]>('/neighborhoods', {
            params: { routeId }
        });
        return response.data;
    },

    async findById(id: number): Promise<Neighborhood> {
        const response = await api.get<Neighborhood>(`/neighborhoods/${id}`);
        return response.data;
    },

    async create(data: Omit<Neighborhood, 'id'>): Promise<Neighborhood> {
        const response = await api.post<Neighborhood>('/neighborhoods', data);
        return response.data;
    },

    async update(id: number, data: Partial<Neighborhood>): Promise<Neighborhood> {
        const response = await api.put<Neighborhood>(`/neighborhoods/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/neighborhoods/${id}`);
    }
};
