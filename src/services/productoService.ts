import api from './api';
import type { ProductoRequest, ProductoResponse } from '../types/producto';

export const productoService = {
    async crearProducto(producto: ProductoRequest): Promise<ProductoResponse> {
        const { data } = await api.post<ProductoResponse>('/productos', producto);
        return data;
    },

    async listarProductos(filtros?: {
        buscar?: string;
        categoria?: string;
        activo?: boolean
    }): Promise<ProductoResponse[]> {
        const { data } = await api.get<ProductoResponse[]>('/productos', { params: filtros });
        return data;
    },

    async obtenerPorCodigo(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.get<ProductoResponse>(`/productos/${codigo}`);
        return data;
    },

    async actualizarProducto(codigo: string, producto: ProductoRequest): Promise<ProductoResponse> {
        const { data } = await api.put<ProductoResponse>(`/productos/${codigo}`, producto);
        return data;
    },

    async activarProducto(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.patch<ProductoResponse>(`/productos/${codigo}/activar`);
        return data;
    },

    async desactivarProducto(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.patch<ProductoResponse>(`/productos/${codigo}/desactivar`);
        return data;
    }
};