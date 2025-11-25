import { create } from 'zustand';
import { movimientoService } from '../services/movimientoService';
import type { MovimientoInventarioRequest, MovimientoInventarioResponse } from '../types/movimiento';

interface MovimientoState {
    movimientos: MovimientoInventarioResponse[];
    movimientoSeleccionado: MovimientoInventarioResponse | null;
    isLoading: boolean;
    error: string | null;
    cargarMovimientos: (filtros?: {
        producto?: string;
        tipo?: string;
        estado?: string;
        usuario?: string;
        proveedor?: string;
        desde?: string;
        hasta?: string;
    }) => Promise<void>;
    obtenerMovimiento: (id: string) => Promise<MovimientoInventarioResponse>;
    crearMovimiento: (movimiento: MovimientoInventarioRequest) => Promise<MovimientoInventarioResponse>;
    anularMovimiento: (id: string) => Promise<MovimientoInventarioResponse>;
    activarMovimiento: (id: string) => Promise<MovimientoInventarioResponse>;
    seleccionarMovimiento: (movimiento: MovimientoInventarioResponse | null) => void;
    clearError: () => void;
}

export const useMovimientoStore = create<MovimientoState>((set) => ({
    movimientos: [],
    movimientoSeleccionado: null,
    isLoading: false,
    error: null,

    cargarMovimientos: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const movimientos = await movimientoService.listarMovimientos(filtros);
            set({ movimientos, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando movimientos',
                isLoading: false
            });
        }
    },

    obtenerMovimiento: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const movimiento = await movimientoService.obtenerMovimiento(id);
            set({ isLoading: false });
            return movimiento;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo movimiento',
                isLoading: false
            });
            throw error;
        }
    },

    crearMovimiento: async (movimiento: MovimientoInventarioRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoMovimiento = await movimientoService.crearMovimiento(movimiento);
            set((state) => ({
                movimientos: [nuevoMovimiento, ...state.movimientos],
                isLoading: false
            }));
            return nuevoMovimiento;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creando movimiento',
                isLoading: false
            });
            throw error;
        }
    },

    anularMovimiento: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const movimiento = await movimientoService.anularMovimiento(id);
            set((state) => ({
                movimientos: state.movimientos.map(m => m.id === id ? movimiento : m),
                movimientoSeleccionado: state.movimientoSeleccionado?.id === id ? movimiento : state.movimientoSeleccionado,
                isLoading: false
            }));
            return movimiento;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error anulando movimiento',
                isLoading: false
            });
            throw error;
        }
    },

    activarMovimiento: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const movimiento = await movimientoService.activarMovimiento(id);
            set((state) => ({
                movimientos: state.movimientos.map(m => m.id === id ? movimiento : m),
                movimientoSeleccionado: state.movimientoSeleccionado?.id === id ? movimiento : state.movimientoSeleccionado,
                isLoading: false
            }));
            return movimiento;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error activando movimiento',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarMovimiento: (movimiento: MovimientoInventarioResponse | null) => {
        set({ movimientoSeleccionado: movimiento });
    },

    clearError: () => set({ error: null }),
}));