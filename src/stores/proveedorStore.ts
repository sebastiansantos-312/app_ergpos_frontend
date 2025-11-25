import { create } from 'zustand';
import { proveedorService } from '../services/proveedorService';
import type { ProveedorRequest, ProveedorResponse } from '../types/proveedor';

interface ProveedorState {
    proveedores: ProveedorResponse[];
    proveedorSeleccionado: ProveedorResponse | null;
    isLoading: boolean;
    error: string | null;
    cargarProveedores: (filtros?: { buscar?: string; activo?: boolean }) => Promise<void>;
    obtenerProveedor: (identificador: string) => Promise<ProveedorResponse>;
    crearProveedor: (proveedor: ProveedorRequest) => Promise<ProveedorResponse>;
    actualizarProveedor: (identificador: string, proveedor: ProveedorRequest) => Promise<ProveedorResponse>;
    activarProveedor: (identificador: string) => Promise<ProveedorResponse>;
    desactivarProveedor: (identificador: string) => Promise<ProveedorResponse>;
    seleccionarProveedor: (proveedor: ProveedorResponse | null) => void;
    clearError: () => void;
}

export const useProveedorStore = create<ProveedorState>((set) => ({
    proveedores: [],
    proveedorSeleccionado: null,
    isLoading: false,
    error: null,

    cargarProveedores: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const proveedores = await proveedorService.listarProveedores(filtros);
            set({ proveedores, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando proveedores',
                isLoading: false
            });
        }
    },

    obtenerProveedor: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const proveedor = await proveedorService.obtenerProveedor(identificador);
            set({ isLoading: false });
            return proveedor;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo proveedor',
                isLoading: false
            });
            throw error;
        }
    },

    crearProveedor: async (proveedor: ProveedorRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoProveedor = await proveedorService.crearProveedor(proveedor);
            set((state) => ({
                proveedores: [...state.proveedores, nuevoProveedor],
                isLoading: false
            }));
            return nuevoProveedor;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creando proveedor',
                isLoading: false
            });
            throw error;
        }
    },

    actualizarProveedor: async (identificador: string, proveedor: ProveedorRequest) => {
        set({ isLoading: true, error: null });
        try {
            const proveedorActualizado = await proveedorService.actualizarProveedor(identificador, proveedor);
            set((state) => ({
                proveedores: state.proveedores.map(p => p.id === proveedorActualizado.id ? proveedorActualizado : p),
                proveedorSeleccionado: state.proveedorSeleccionado?.id === proveedorActualizado.id ? proveedorActualizado : state.proveedorSeleccionado,
                isLoading: false
            }));
            return proveedorActualizado;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error actualizando proveedor',
                isLoading: false
            });
            throw error;
        }
    },

    activarProveedor: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const proveedor = await proveedorService.activarProveedor(identificador);
            set((state) => ({
                proveedores: state.proveedores.map(p => p.id === proveedor.id ? proveedor : p),
                proveedorSeleccionado: state.proveedorSeleccionado?.id === proveedor.id ? proveedor : state.proveedorSeleccionado,
                isLoading: false
            }));
            return proveedor;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error activando proveedor',
                isLoading: false
            });
            throw error;
        }
    },

    desactivarProveedor: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const proveedor = await proveedorService.desactivarProveedor(identificador);
            set((state) => ({
                proveedores: state.proveedores.map(p => p.id === proveedor.id ? proveedor : p),
                proveedorSeleccionado: state.proveedorSeleccionado?.id === proveedor.id ? proveedor : state.proveedorSeleccionado,
                isLoading: false
            }));
            return proveedor;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error desactivando proveedor',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarProveedor: (proveedor: ProveedorResponse | null) => {
        set({ proveedorSeleccionado: proveedor });
    },

    clearError: () => set({ error: null }),
}));