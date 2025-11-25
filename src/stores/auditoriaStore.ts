import { create } from 'zustand';
import { auditoriaService } from '../services/auditoriaService';
import type { AuditoriaResponse, AuditoriaEstadisticas, AuditoriaContadores } from '../types/auditoria';

interface AuditoriaState {
    registros: AuditoriaResponse[];
    registroSeleccionado: AuditoriaResponse | null;
    estadisticas: AuditoriaEstadisticas | null;
    contadores: AuditoriaContadores | null;
    isLoading: boolean;
    error: string | null;

    // Acciones de carga
    cargarTodos: () => Promise<void>;
    cargarRecientes: () => Promise<void>;
    cargarPorTabla: (tablaNombre: string) => Promise<void>;
    cargarPorEvento: (eventoTipo: string) => Promise<void>;
    cargarPorRegistro: (tablaNombre: string, registroId: string) => Promise<void>;
    cargarPorUsuario: (usuarioId: string) => Promise<void>;
    cargarPorFechas: (desde: string, hasta: string) => Promise<void>;
    cargarPorUsuarioYFecha: (usuarioId: string, desde: string, hasta: string) => Promise<void>;

    // Acciones específicas
    obtenerPorId: (id: number) => Promise<AuditoriaResponse>;
    cargarEstadisticas: () => Promise<void>;
    cargarContadores: () => Promise<void>;
    limpiarAntiguos: (fechaLimite: string) => Promise<void>;

    // Utilidades
    seleccionarRegistro: (registro: AuditoriaResponse | null) => void;
    clearError: () => void;
}

export const useAuditoriaStore = create<AuditoriaState>((set) => ({
    registros: [],
    registroSeleccionado: null,
    estadisticas: null,
    contadores: null,
    isLoading: false,
    error: null,

    cargarTodos: async () => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.listarTodos();
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando auditoría',
                isLoading: false
            });
        }
    },

    cargarRecientes: async () => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.listarRecientes();
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando registros recientes',
                isLoading: false
            });
        }
    },

    cargarPorTabla: async (tablaNombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorTabla(tablaNombre);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por tabla',
                isLoading: false
            });
        }
    },

    cargarPorEvento: async (eventoTipo: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorEvento(eventoTipo);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por evento',
                isLoading: false
            });
        }
    },

    cargarPorRegistro: async (tablaNombre: string, registroId: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorRegistro(tablaNombre, registroId);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por registro',
                isLoading: false
            });
        }
    },

    cargarPorUsuario: async (usuarioId: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorUsuario(usuarioId);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por usuario',
                isLoading: false
            });
        }
    },

    cargarPorFechas: async (desde: string, hasta: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorFechas(desde, hasta);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por fechas',
                isLoading: false
            });
        }
    },

    cargarPorUsuarioYFecha: async (usuarioId: string, desde: string, hasta: string) => {
        set({ isLoading: true, error: null });
        try {
            const registros = await auditoriaService.buscarPorUsuarioYFecha(usuarioId, desde, hasta);
            set({ registros, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error buscando por usuario y fechas',
                isLoading: false
            });
        }
    },

    obtenerPorId: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const registro = await auditoriaService.obtenerPorId(id);
            set({ isLoading: false });
            return registro;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo registro',
                isLoading: false
            });
            throw error;
        }
    },

    cargarEstadisticas: async () => {
        try {
            const estadisticas = await auditoriaService.obtenerEstadisticas();
            set({ estadisticas });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando estadísticas'
            });
        }
    },

    cargarContadores: async () => {
        try {
            const contadores = await auditoriaService.obtenerContadores();
            set({ contadores });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando contadores'
            });
        }
    },

    limpiarAntiguos: async (fechaLimite: string) => {
        set({ isLoading: true, error: null });
        try {
            await auditoriaService.limpiarRegistrosAntiguos(fechaLimite);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error limpiando registros',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarRegistro: (registro: AuditoriaResponse | null) => {
        set({ registroSeleccionado: registro });
    },

    clearError: () => set({ error: null }),
}));