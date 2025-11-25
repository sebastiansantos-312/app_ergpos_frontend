import api from './api';
import type { CategoriaRequest, CategoriaResponse } from '../types/categoria';

export const categoriaService = {
    async crearCategoria(categoria: CategoriaRequest): Promise<CategoriaResponse> {
        const { data } = await api.post<CategoriaResponse>('/categorias', categoria);
        return data;
    },

    async listarCategorias(filtros?: { buscar?: string; activo?: boolean }): Promise<CategoriaResponse[]> {
        const { data } = await api.get<CategoriaResponse[]>('/categorias', { params: filtros });
        return data;
    },

    async obtenerCategoria(identificador: string): Promise<CategoriaResponse> {
        const { data } = await api.get<CategoriaResponse>(`/categorias/${identificador}`);
        return data;
    },

    async actualizarCategoria(identificador: string, categoria: CategoriaRequest): Promise<CategoriaResponse> {
        const { data } = await api.put<CategoriaResponse>(`/categorias/${identificador}`, categoria);
        return data;
    },

    async activarCategoria(identificador: string): Promise<CategoriaResponse> {
        const { data } = await api.patch<CategoriaResponse>(`/categorias/${identificador}/activar`);
        return data;
    },

    async desactivarCategoria(identificador: string): Promise<CategoriaResponse> {
        const { data } = await api.patch<CategoriaResponse>(`/categorias/${identificador}/desactivar`);
        return data;
    }
};