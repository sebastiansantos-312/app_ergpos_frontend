import api from './api';
import type { MovimientoInventarioRequest, MovimientoInventarioResponse } from '../types/movimiento';

export const movimientoService = {
    async crearMovimiento(movimiento: MovimientoInventarioRequest): Promise<MovimientoInventarioResponse> {
        const { data } = await api.post<MovimientoInventarioResponse>('/movimientos', movimiento);
        return data;
    },

    async listarMovimientos(filtros?: {
        producto?: string;
        tipo?: string;
        estado?: string;
        usuario?: string;
        proveedor?: string;
        
    }): Promise<MovimientoInventarioResponse[]> {
        const { data } = await api.get<MovimientoInventarioResponse[]>('/movimientos', { params: filtros });
        return data;
    },

    async obtenerMovimiento(id: string): Promise<MovimientoInventarioResponse> {
        const { data } = await api.get<MovimientoInventarioResponse>(`/movimientos/${id}`);
        return data;
    },

    async anularMovimiento(id: string): Promise<MovimientoInventarioResponse> {
        const { data } = await api.patch<MovimientoInventarioResponse>(`/movimientos/${id}/anular`);
        return data;
    },

    async activarMovimiento(id: string): Promise<MovimientoInventarioResponse> {
        const { data } = await api.patch<MovimientoInventarioResponse>(`/movimientos/${id}/activar`);
        return data;
    }
};