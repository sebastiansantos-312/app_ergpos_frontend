import { create } from 'zustand';
import { rolService } from '../services/rolService';
import type { Rol } from '../types';

interface RolState {
    roles: Rol[];
    rolesActivos: Rol[];
    isLoading: boolean;
    error: string | null;
}

interface RolActions {
    fetchRolesActivos: () => Promise<void>;
    fetchRolesInactivos: () => Promise<void>;
    createRol: (nombre: string) => Promise<void>;
    activarRol: (nombre: string) => Promise<void>;
    desactivarRol: (nombre: string) => Promise<void>;
    clearError: () => void;
}

export const useRolStore = create<RolState & RolActions>((set) => ({
    roles: [],
    rolesActivos: [],
    isLoading: false,
    error: null,

    fetchRolesActivos: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log('🔄 Fetching roles activos...');
            const roles = await rolService.listarActivos();
            console.log('✅ Roles cargados:', roles);

            // Asegurar que siempre sea un array y filtrar solo activos
            const rolesArray = Array.isArray(roles) ? roles : [];
            const rolesActivos = rolesArray.filter(rol => rol.activo !== false);

            set({
                roles: rolesArray,
                rolesActivos,
                isLoading: false
            });
        } catch (error: any) {
            console.error('❌ Error cargando roles:', error);
            set({
                error: error.message,
                isLoading: false,
                roles: [],
                rolesActivos: []
            });
        }
    },

    fetchRolesInactivos: async () => {
        set({ isLoading: true, error: null });
        try {
            const roles = await rolService.listarInactivos();
            const rolesArray = Array.isArray(roles) ? roles : [];
            set({
                roles: rolesArray,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message,
                isLoading: false
            });
        }
    },

    createRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoRol = await rolService.crearRol({ nombre });

            // Asegurar que el nuevo rol tenga la estructura correcta
            const rolCompleto: Rol = {
                ...nuevoRol,
                activo: nuevoRol.activo !== undefined ? nuevoRol.activo : true
            };

            set(state => ({
                roles: [...state.roles, rolCompleto],
                rolesActivos: [...state.rolesActivos, rolCompleto],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    activarRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const rolActualizado = await rolService.activarRol(nombre);

            // Asegurar que el rol actualizado esté activo
            const rolActivado: Rol = {
                ...rolActualizado,
                activo: true
            };

            set(state => ({
                roles: state.roles.map(r =>
                    r.nombre === nombre ? rolActivado : r
                ),
                rolesActivos: [...state.rolesActivos.filter(r => r.nombre !== nombre), rolActivado],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    desactivarRol: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const rolActualizado = await rolService.desactivarRol(nombre);

            // Asegurar que el rol actualizado esté inactivo
            const rolDesactivado: Rol = {
                ...rolActualizado,
                activo: false
            };

            set(state => ({
                roles: state.roles.map(r =>
                    r.nombre === nombre ? rolDesactivado : r
                ),
                rolesActivos: state.rolesActivos.filter(r => r.nombre !== nombre),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    }
}));