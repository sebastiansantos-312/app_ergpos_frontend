import { create } from 'zustand';
import type { User, LoginRequest } from '../types';
import { authService } from '../services/authService';
import { z } from 'zod';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
}

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Error de conexión';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, error: null });
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