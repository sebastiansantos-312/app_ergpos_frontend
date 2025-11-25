import api from './api';
import type { ProveedorRequest, ProveedorResponse } from '../types/proveedor';

export const proveedorService = {
    async crearProveedor(proveedor: ProveedorRequest): Promise<ProveedorResponse> {
        const { data } = await api.post<ProveedorResponse>('/proveedores', proveedor);
        return data;
    },

    async listarProveedores(filtros?: { buscar?: string; activo?: boolean }): Promise<ProveedorResponse[]> {
        const { data } = await api.get<ProveedorResponse[]>('/proveedores', { params: filtros });
        return data;
    },

    async obtenerProveedor(identificador: string): Promise<ProveedorResponse> {
        const { data } = await api.get<ProveedorResponse>(`/proveedores/${identificador}`);
        return data;
    },

    async actualizarProveedor(identificador: string, proveedor: ProveedorRequest): Promise<ProveedorResponse> {
        const { data } = await api.put<ProveedorResponse>(`/proveedores/${identificador}`, proveedor);
        return data;
    },

    async activarProveedor(identificador: string): Promise<ProveedorResponse> {
        const { data } = await api.patch<ProveedorResponse>(`/proveedores/${identificador}/activar`);
        return data;
    },

    async desactivarProveedor(identificador: string): Promise<ProveedorResponse> {
        const { data } = await api.patch<ProveedorResponse>(`/proveedores/${identificador}/desactivar`);
        return data;
    }
};