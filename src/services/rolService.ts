import api from './api';
import type { RolRequest, RolResponse } from '../types/rol';

export const rolService = {
    async crearRol(rol: RolRequest): Promise<RolResponse> {
        const { data } = await api.post<RolResponse>('/roles', rol);
        return data;
    },

    async listarRoles(filtros?: { buscar?: string; activo?: boolean }): Promise<RolResponse[]> {
        const { data } = await api.get<RolResponse[]>('/roles', { params: filtros });
        return data;
    },

    async obtenerPorNombre(nombre: string): Promise<RolResponse> {
        const { data } = await api.get<RolResponse>(`/roles/${nombre}`);
        return data;
    },

    async actualizarRol(nombre: string, rol: RolRequest): Promise<RolResponse> {
        const { data } = await api.put<RolResponse>(`/roles/${nombre}`, rol);
        return data;
    },

    async activarRol(nombre: string): Promise<RolResponse> {
        const { data } = await api.patch<RolResponse>(`/roles/${nombre}/activar`);
        return data;
    },

    async desactivarRol(nombre: string): Promise<RolResponse> {
        const { data } = await api.patch<RolResponse>(`/roles/${nombre}/desactivar`);
        return data;
    }
};