// authStore.ts - AGREGAR efecto de verificación inicial
import { create } from 'zustand';
import type { User, LoginRequest } from '../types';
import { transformBackendUser } from '../types/transformBackendUser';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean; // Nuevo estado para verificar si ya se inicializó
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  getUserPermissions: () => any;
  initializeAuth: () => void; // Nueva acción para inicializar
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // Estado inicial
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Iniciar como true para verificar autenticación
  error: null,
  initialized: false,

  // Inicializar autenticación al cargar la app
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          initialized: true
        });
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          initialized: true
        });
      }
    } else {
      set({
        isLoading: false,
        initialized: true
      });
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      if (!API_BASE_URL) throw new Error('URL de la API no configurada');

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error en el servidor' }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const raw = await response.json();
      const user = transformBackendUser(raw.user);
      const token = raw.token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error de conexión',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false
    });
  },

  setUser: (user: User) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  setToken: (token: string) => {
    set({ token });
    localStorage.setItem('token', token);
  },

  clearError: () => set({ error: null }),

  hasRole: (role: string) => get().user?.roles.includes(role) || false,
  hasAnyRole: (roles: string[]) => roles.some(role => get().user?.roles.includes(role)) || false,
  hasAllRoles: (roles: string[]) => roles.every(role => get().user?.roles.includes(role)) || false,

  getUserPermissions: () => {
    const { hasRole } = get();
    return {
      canManageUsers: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR'),
      canManageSystem: hasRole('SUPER_ADMIN'),
      canManageInventory: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('ALMACENISTA'),
      canEditProducts: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('ALMACENISTA'),
      canManageFinancials: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('CONTADOR'),
      canViewFinancials: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('CONTADOR') || hasRole('GERENTE'),
      canManageSales: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('VENDEDOR'),
      canManageAudit: hasRole('SUPER_ADMIN') || hasRole('ADMINISTRADOR') || hasRole('AUDITOR'),
    };
  },
}));