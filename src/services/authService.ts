import api from './api';
import type { LoginRequest, LoginResponse, UserInfo } from '../types/auth';

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials);
        return data;
    },

    async getCurrentUser(): Promise<UserInfo> {
        const { data } = await api.get<UserInfo>('/auth/me');
        return data;
    },

    async getUserModules(): Promise<string[]> {
        const { data } = await api.get<string[]>('/auth/modules');
        return data;
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    getStoredUser(): UserInfo | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};