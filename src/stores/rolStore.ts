import { create } from 'zustand';
import { rolService } from '../services/rolService';
import type { RolRequest, RolResponse } from '../types/rol';

interface RolState {
    roles: RolResponse[];
    rolSeleccionado: RolResponse | null;
    isLoading: boolean;
    error: string | null;
    cargarRoles: (filtros?: { buscar?: string; activo?: boolean }) => Promise<void>;
    obtenerRol: (nombre: string) => Promise<RolResponse>;
    crearRol: (rol: RolRequest) => Promise<RolResponse>;
    actualizarRol: (nombre: string, rol: RolRequest) => Promise<RolResponse>;
    activarRol: (nombre: string) => Promise<RolResponse>;
    desactivarRol: (nombre: string) => Promise<RolResponse>;
    seleccionarRol: (rol: RolResponse | null) => void;
    clearError: () => void;
}

export const useRolStore = create<RolState>((set) => ({
    roles: [],
    rolSeleccionado: null,
    isLoading: false,
    error: null,

    cargarRoles: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const roles = await rolService.listarRoles(filtros);
            set({ roles, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando roles',
                isLoading: false
            });
        }
    },

    obtenerRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const rol = await rolService.obtenerPorNombre(nombre);
            set({ isLoading: false });
            return rol;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo rol',
                isLoading: false
            });
            throw error;
        }
    },

    crearRol: async (rol: RolRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoRol = await rolService.crearRol(rol);
            set((state) => ({
                roles: [...state.roles, nuevoRol],
                isLoading: false
            }));
            return nuevoRol;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creando rol',
                isLoading: false
            });
            throw error;
        }
    },

    actualizarRol: async (nombre: string, rol: RolRequest) => {
        set({ isLoading: true, error: null });
        try {
            const rolActualizado = await rolService.actualizarRol(nombre, rol);
            set((state) => ({
                roles: state.roles.map(r => r.nombre === nombre ? rolActualizado : r),
                rolSeleccionado: state.rolSeleccionado?.nombre === nombre ? rolActualizado : state.rolSeleccionado,
                isLoading: false
            }));
            return rolActualizado;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error actualizando rol',
                isLoading: false
            });
            throw error;
        }
    },

    activarRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const rol = await rolService.activarRol(nombre);
            set((state) => ({
                roles: state.roles.map(r => r.nombre === nombre ? rol : r),
                rolSeleccionado: state.rolSeleccionado?.nombre === nombre ? rol : state.rolSeleccionado,
                isLoading: false
            }));
            return rol;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error activando rol',
                isLoading: false
            });
            throw error;
        }
    },

    desactivarRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const rol = await rolService.desactivarRol(nombre);
            set((state) => ({
                roles: state.roles.map(r => r.nombre === nombre ? rol : r),
                rolSeleccionado: state.rolSeleccionado?.nombre === nombre ? rol : state.rolSeleccionado,
                isLoading: false
            }));
            return rol;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error desactivando rol',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarRol: (rol: RolResponse | null) => {
        set({ rolSeleccionado: rol });
    },

    clearError: () => set({ error: null }),
}));