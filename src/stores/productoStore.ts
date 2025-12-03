import { create } from 'zustand';
import type { ProductoResponse } from '../types/producto';

/**
 * Producto Store - State Management Only
 * 
 * This store ONLY handles state. All business logic has been moved to useProductos hook.
 * This follows the Single Responsibility Principle and makes the code more testable.
 */
interface ProductoState {
    // State
    productos: ProductoResponse[];
    productoSeleccionado: ProductoResponse | null;
    isLoading: boolean;
    error: string | null;
    totalProductos: number;

    // Simple setters
    setProductos: (productos: ProductoResponse[]) => void;
    setProductoSeleccionado: (producto: ProductoResponse | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setTotal: (total: number) => void;
    clearError: () => void;

    // Local state operations (no API calls)
    updateProducto: (codigo: string, producto: ProductoResponse) => void;
    addProducto: (producto: ProductoResponse) => void;
    removeProducto: (codigo: string) => void;
}

export const useProductoStore = create<ProductoState>((set) => ({
    // Initial state
    productos: [],
    productoSeleccionado: null,
    isLoading: false,
    error: null,
    totalProductos: 0,

    // Simple setters
    setProductos: (productos) => set({ productos }),

    setProductoSeleccionado: (producto) => set({ productoSeleccionado: producto }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    setTotal: (total) => set({ totalProductos: total }),

    clearError: () => set({ error: null }),

    // Local state operations
    /**
     * Updates a product in the local state without triggering a re-fetch
     * @param codigo - The unique code of the product to update
     * @param producto - The updated product data
     */
    updateProducto: (codigo, producto) => set((state) => ({
        productos: state.productos.map(p => p.codigo === codigo ? producto : p),
        productoSeleccionado: state.productoSeleccionado?.codigo === codigo
            ? producto
            : state.productoSeleccionado,
    })),

    /**
     * Adds a new product to the local state
     * @param producto - The new product to add
     */
    addProducto: (producto) => set((state) => ({
        productos: [...state.productos, producto],
        totalProductos: state.totalProductos + 1,
    })),

    /**
     * Removes a product from the local state
     * @param codigo - The unique code of the product to remove
     */
    removeProducto: (codigo) => set((state) => ({
        productos: state.productos.filter(p => p.codigo !== codigo),
        totalProductos: state.totalProductos - 1,
        productoSeleccionado: state.productoSeleccionado?.codigo === codigo
            ? null
            : state.productoSeleccionado,
    })),
}));