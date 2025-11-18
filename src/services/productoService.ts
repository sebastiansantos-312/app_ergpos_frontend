// services/productoService.ts
import api from './api';

import type { ProductoRequestDTO, ProductoResponseDTO, ProductoEstadisticas } from '../types/producto';


export const productoService = {
    listarProductos: async (activo?: boolean): Promise<ProductoResponseDTO[]> => {
        const params = activo !== undefined ? { activo } : {};
        const response = await api.get('/productos', { params });
        return response.data;
    },

    buscarPorCodigo: async (codigo: string): Promise<ProductoResponseDTO> => {
        const response = await api.get(`/productos/codigo/${codigo}`);
        return response.data;
    },

    buscarPorNombre: async (nombre: string): Promise<ProductoResponseDTO[]> => {
        const response = await api.get('/productos/buscar', { params: { nombre } });
        return response.data;
    },

    crearProducto: async (request: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
        const response = await api.post('/productos', request);
        return response.data;
    },

    actualizarProducto: async (codigo: string, request: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
        const response = await api.put(`/productos/codigo/${codigo}`, request);
        return response.data;
    },

    activarProducto: async (codigo: string): Promise<ProductoResponseDTO> => {
        const response = await api.put(`/productos/codigo/${codigo}/activar`);
        return response.data;
    },

    desactivarProducto: async (codigo: string): Promise<ProductoResponseDTO> => {
        const response = await api.put(`/productos/codigo/${codigo}/desactivar`);
        return response.data;
    },

    obtenerEstadisticas: async (): Promise<ProductoEstadisticas> => {
        const response = await api.get('/productos/estadisticas');
        return response.data;
    },

    productosRecientes: async (): Promise<ProductoResponseDTO[]> => {
        const response = await api.get('/productos/recientes');
        return response.data;
    },
};