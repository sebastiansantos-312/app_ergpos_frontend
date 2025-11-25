import { create } from 'zustand';
import { categoriaService } from '../services/categoriaService';
import type { CategoriaRequest, CategoriaResponse } from '../types/categoria';

interface CategoriaState {
    categorias: CategoriaResponse[];
    categoriaSeleccionada: CategoriaResponse | null;
    isLoading: boolean;
    error: string | null;
    cargarCategorias: (filtros?: { buscar?: string; activo?: boolean }) => Promise<void>;
    obtenerCategoria: (identificador: string) => Promise<CategoriaResponse>;
    crearCategoria: (categoria: CategoriaRequest) => Promise<CategoriaResponse>;
    actualizarCategoria: (identificador: string, categoria: CategoriaRequest) => Promise<CategoriaResponse>;
    activarCategoria: (identificador: string) => Promise<CategoriaResponse>;
    desactivarCategoria: (identificador: string) => Promise<CategoriaResponse>;
    seleccionarCategoria: (categoria: CategoriaResponse | null) => void;
    clearError: () => void;
}

export const useCategoriaStore = create<CategoriaState>((set) => ({
    categorias: [],
    categoriaSeleccionada: null,
    isLoading: false,
    error: null,

    cargarCategorias: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const categorias = await categoriaService.listarCategorias(filtros);
            set({ categorias, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando categorías',
                isLoading: false
            });
        }
    },

    obtenerCategoria: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const categoria = await categoriaService.obtenerCategoria(identificador);
            set({ isLoading: false });
            return categoria;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo categoría',
                isLoading: false
            });
            throw error;
        }
    },

    crearCategoria: async (categoria: CategoriaRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevaCategoria = await categoriaService.crearCategoria(categoria);
            set((state) => ({
                categorias: [...state.categorias, nuevaCategoria],
                isLoading: false
            }));
            return nuevaCategoria;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creando categoría',
                isLoading: false
            });
            throw error;
        }
    },

    actualizarCategoria: async (identificador: string, categoria: CategoriaRequest) => {
        set({ isLoading: true, error: null });
        try {
            const categoriaActualizada = await categoriaService.actualizarCategoria(identificador, categoria);
            set((state) => ({
                categorias: state.categorias.map(c => c.id === categoriaActualizada.id ? categoriaActualizada : c),
                categoriaSeleccionada: state.categoriaSeleccionada?.id === categoriaActualizada.id ? categoriaActualizada : state.categoriaSeleccionada,
                isLoading: false
            }));
            return categoriaActualizada;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error actualizando categoría',
                isLoading: false
            });
            throw error;
        }
    },

    activarCategoria: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const categoria = await categoriaService.activarCategoria(identificador);
            set((state) => ({
                categorias: state.categorias.map(c => c.id === categoria.id ? categoria : c),
                categoriaSeleccionada: state.categoriaSeleccionada?.id === categoria.id ? categoria : state.categoriaSeleccionada,
                isLoading: false
            }));
            return categoria;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error activando categoría',
                isLoading: false
            });
            throw error;
        }
    },

    desactivarCategoria: async (identificador: string) => {
        set({ isLoading: true, error: null });
        try {
            const categoria = await categoriaService.desactivarCategoria(identificador);
            set((state) => ({
                categorias: state.categorias.map(c => c.id === categoria.id ? categoria : c),
                categoriaSeleccionada: state.categoriaSeleccionada?.id === categoria.id ? categoria : state.categoriaSeleccionada,
                isLoading: false
            }));
            return categoria;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error desactivando categoría',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarCategoria: (categoria: CategoriaResponse | null) => {
        set({ categoriaSeleccionada: categoria });
    },

    clearError: () => set({ error: null }),
}));