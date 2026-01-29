import api from './api';

export interface ClientDTO {
    id: number;
    username: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'CLIENT';
    tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'; // Enums from backend
    totalOrders?: number;
    totalSpent?: number;
    firstOrderDate?: string;
    lastOrderDate?: string;
}

const clientService = {
    getAllClients: async () => {
        const response = await api.get<ClientDTO[]>('/clients');
        return response.data;
    },

    getClientById: async (id: number) => {
        const response = await api.get<ClientDTO>(`/clients/${id}`);
        return response.data;
    },

    updateClient: async (id: number, data: Partial<ClientDTO>) => {
        const response = await api.put<ClientDTO>(`/clients/${id}`, data);
        return response.data;
    },

    deleteClient: async (id: number) => {
        await api.delete(`/clients/${id}`);
    }
};

export default clientService;
