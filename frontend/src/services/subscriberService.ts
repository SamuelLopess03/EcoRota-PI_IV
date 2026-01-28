import api from './api';

export interface Subscriber {
    id: number;
    email: string;
    street: string;
    number: string;
    complement?: string;
    neighborhoodId: number;
}

export const subscriberService = {
    async register(data: Omit<Subscriber, 'id'>): Promise<Subscriber> {
        const response = await api.post<Subscriber>('/subscribers', data);
        return response.data;
    },

    async list(neighborhoodId?: number): Promise<Subscriber[]> {
        const response = await api.get<Subscriber[]>('/subscribers', {
            params: { neighborhoodId }
        });
        return response.data;
    },

    async unsubscribe(id: number): Promise<void> {
        await api.delete(`/subscribers/${id}`);
    }
};
