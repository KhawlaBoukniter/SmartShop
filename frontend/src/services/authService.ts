import api from './api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    role: 'ADMIN' | 'CLIENT';
}

export interface AuthResponse {
    user: User;
}

const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data.user;
};

const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

const authService = {
    login,
    logout,
};

export default authService;
