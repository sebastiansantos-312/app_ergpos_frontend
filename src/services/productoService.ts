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
        activo?: boolean;
        page?: number;
        size?: number;
    }): Promise<{ productos: ProductoResponse[]; total: number }> {
        const { data } = await api.get('/productos', {
            params: {
                ...filtros,
                page: filtros?.page || 0,
                size: filtros?.size || 1000
            }
        });
        return {
            productos: data.productos || [],
            total: data.totalItems || 0
        };
    },

    async obtenerPorCodigo(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.get<ProductoResponse>('/productos/por-codigo', {
            params: { codigo }
        });
        return data;
    },

    async actualizarProducto(codigo: string, producto: ProductoRequest): Promise<ProductoResponse> {
        const { data } = await api.put<ProductoResponse>('/productos', producto, {
            params: { codigo }
        });
        return data;
    },

    async activarProducto(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.patch<ProductoResponse>('/productos/activar', null, {
            params: { codigo }
        });
        return data;
    },

    async desactivarProducto(codigo: string): Promise<ProductoResponse> {
        const { data } = await api.patch<ProductoResponse>('/productos/desactivar', null, {
            params: { codigo }
        });
        return data;
    }
};