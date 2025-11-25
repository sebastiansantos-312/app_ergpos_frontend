import { create } from 'zustand';
import { productoService } from '../services/productoService';
import type { ProductoRequest, ProductoResponse } from '../types/producto';

interface ProductoState {
    productos: ProductoResponse[];
    productoSeleccionado: ProductoResponse | null;
    isLoading: boolean;
    error: string | null;
    cargarProductos: (filtros?: { buscar?: string; categoria?: string; activo?: boolean }) => Promise<void>;
    obtenerProducto: (codigo: string) => Promise<ProductoResponse>;
    crearProducto: (producto: ProductoRequest) => Promise<ProductoResponse>;
    actualizarProducto: (codigo: string, producto: ProductoRequest) => Promise<ProductoResponse>;
    activarProducto: (codigo: string) => Promise<ProductoResponse>;
    desactivarProducto: (codigo: string) => Promise<ProductoResponse>;
    seleccionarProducto: (producto: ProductoResponse | null) => void;
    clearError: () => void;
}

export const useProductoStore = create<ProductoState>((set) => ({
    productos: [],
    productoSeleccionado: null,
    isLoading: false,
    error: null,

    cargarProductos: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const productos = await productoService.listarProductos(filtros);
            set({ productos, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error cargando productos',
                isLoading: false
            });
        }
    },

    obtenerProducto: async (codigo: string) => {
        set({ isLoading: true, error: null });
        try {
            const producto = await productoService.obtenerPorCodigo(codigo);
            set({ isLoading: false });
            return producto;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error obteniendo producto',
                isLoading: false
            });
            throw error;
        }
    },

    crearProducto: async (producto: ProductoRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoProducto = await productoService.crearProducto(producto);
            set((state) => ({
                productos: [...state.productos, nuevoProducto],
                isLoading: false
            }));
            return nuevoProducto;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creando producto',
                isLoading: false
            });
            throw error;
        }
    },

    actualizarProducto: async (codigo: string, producto: ProductoRequest) => {
        set({ isLoading: true, error: null });
        try {
            const productoActualizado = await productoService.actualizarProducto(codigo, producto);
            set((state) => ({
                productos: state.productos.map(p => p.codigo === codigo ? productoActualizado : p),
                productoSeleccionado: state.productoSeleccionado?.codigo === codigo ? productoActualizado : state.productoSeleccionado,
                isLoading: false
            }));
            return productoActualizado;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error actualizando producto',
                isLoading: false
            });
            throw error;
        }
    },

    activarProducto: async (codigo: string) => {
        set({ isLoading: true, error: null });
        try {
            const producto = await productoService.activarProducto(codigo);
            set((state) => ({
                productos: state.productos.map(p => p.codigo === codigo ? producto : p),
                productoSeleccionado: state.productoSeleccionado?.codigo === codigo ? producto : state.productoSeleccionado,
                isLoading: false
            }));
            return producto;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error activando producto',
                isLoading: false
            });
            throw error;
        }
    },

    desactivarProducto: async (codigo: string) => {
        set({ isLoading: true, error: null });
        try {
            const producto = await productoService.desactivarProducto(codigo);
            set((state) => ({
                productos: state.productos.map(p => p.codigo === codigo ? producto : p),
                productoSeleccionado: state.productoSeleccionado?.codigo === codigo ? producto : state.productoSeleccionado,
                isLoading: false
            }));
            return producto;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error desactivando producto',
                isLoading: false
            });
            throw error;
        }
    },

    seleccionarProducto: (producto: ProductoResponse | null) => {
        set({ productoSeleccionado: producto });
    },

    clearError: () => set({ error: null }),
}));