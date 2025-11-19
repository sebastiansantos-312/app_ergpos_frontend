import api from './api';
import type { LoginRequest, LoginResponse, User } from '../types';
import { transformBackendUser } from '../types/transformBackendUser';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post('/auth/login', credentials);
            const backendData = response.data;

            if (!backendData.token) {
                throw new Error('No se recibió token del servidor');
            }

            const user: User = transformBackendUser(backendData.user || backendData);

            localStorage.setItem('token', backendData.token);
            localStorage.setItem('user', JSON.stringify(user));

            return {
                token: backendData.token,
                type: backendData.type || 'Bearer',
                user
            };
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error de conexión al iniciar sesión';
            throw new Error(message);
        }
    },

    getProfile: async (): Promise<User> => {
        try {
            const response = await api.get('/usuarios/me/perfil');
            return transformBackendUser(response.data);
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'No se pudo obtener el perfil';
            throw new Error(message);
        }
    },

    refreshToken: async (): Promise<{ token: string }> => {
        try {
            const response = await api.post('/auth/refresh');
            const token = response.data.token;
            if (!token) throw new Error('Token de refresco inválido');

            localStorage.setItem('token', token);
            return { token };
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'No se pudo refrescar el token';
            throw new Error(message);
        }
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};