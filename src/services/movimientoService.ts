// services/movimientoService.ts - VERIFICAR
import api from './api';
import type {
    MovimientoInventarioRequestDTO,
    MovimientoInventarioResponseDTO
} from '../types/movimiento';

export const movimientoService = {
    registrarMovimiento: async (request: MovimientoInventarioRequestDTO): Promise<MovimientoInventarioResponseDTO> => {
        const response = await api.post('/movimientos', request);
        return response.data;
    },

    listarTodos: async (): Promise<MovimientoInventarioResponseDTO[]> => {
        try {
            const response = await api.get('/movimientos');
            return response.data;
        } catch (error) {
            console.error('Error en listarTodos:', error);
            throw error;
        }
    },

    listarPorProducto: async (codigo: string): Promise<MovimientoInventarioResponseDTO[]> => {
        try {
            const response = await api.get(`/movimientos/producto/${codigo}`);
            return response.data;
        } catch (error) {
            console.error('Error en listarPorProducto:', error);
            throw error;
        }
    },
};