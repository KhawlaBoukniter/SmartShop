import api from './api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export type Role = 'ADMIN' | 'CLIENT';

export interface User {
    id: number;
    role: Role;
}

const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<User>('/auth/login', credentials);
    return response.data;
};

const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

const authService = {
    login,
    logout,
};

export default authService;
