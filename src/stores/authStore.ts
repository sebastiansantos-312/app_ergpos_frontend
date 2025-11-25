import { create } from 'zustand';
import { authService } from '../services/authService';
import type { LoginRequest, UserInfo } from '../types/auth';

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);

      if (!response.activo) {
        set({
          error: 'Tu cuenta está inactiva. Contacta al administrador.',
          isLoading: false,
          isAuthenticated: false,
          user: null
        });

        // No guardar nada en localStorage
        return;
      }
      // Guardar token
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuarioId', response.usuarioId);

      // Cargar información completa del usuario
      const userInfo = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      if (!userInfo.activo) {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');

        set({
          error: 'Tu cuenta fue desactivada recientemente. Contacta al administrador.',
          isLoading: false,
          isAuthenticated: false,
          user: null
        });
        return;
      }
      set({
        user: userInfo,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error en el login';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('usuarioId');
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  loadUser: async () => {
    if (!authService.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const userInfo = await authService.getCurrentUser();
      set({
        user: userInfo,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      authService.logout();
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Sesión expirada. Por favor inicia sesión nuevamente'
      });
    }
  },

  clearError: () => set({ error: null }),
}));