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
      // Extraer el mensaje de error del backend
      let errorMessage = 'Error en el login';

      if (error.response?.data) {
        // Si el backend devuelve un objeto con message
        errorMessage = error.response.data.message || errorMessage;

        // Manejar códigos de error específicos
        if (error.response.data.code === 'USER_INACTIVE') {
          errorMessage = 'Tu cuenta está inactiva. Contacta al administrador.';
        } else if (error.response.data.code === 'INVALID_CREDENTIALS') {
          errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (error.response.data.code === 'TOO_MANY_ATTEMPTS') {
          errorMessage = error.response.data.message; // Usar el mensaje del backend que incluye el tiempo
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.log('🔴 Error extraído del backend:', errorMessage); // DEBUG
      console.log('🔴 Datos completos del error:', error.response?.data); // DEBUG

      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null
      });

      // No lanzar el error para que el componente pueda mostrar el mensaje
      console.error('Login error completo:', error);
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