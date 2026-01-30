import api from './api';

export interface ClientDTO {
    id: number;
    username: string;
    name: string;
    email: string;
    role: 'CLIENT';
    tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    totalOrders?: number;
    totalSpent?: number;
    firstOrderDate?: string;
    lastOrderDate?: string;
}

export interface CreateClientRequest {
    username: string;
    name: string;
    email: string;
    password?: string;
}

const clientService = {
    createClient: async (data: CreateClientRequest) => {
        const response = await api.post<ClientDTO>('/clients', data);
        return response.data;
    },

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
