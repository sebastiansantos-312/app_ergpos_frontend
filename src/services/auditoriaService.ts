import api from './api';
import type {
    AuditoriaResponse,
    AuditoriaFiltros,
    AuditoriaEstadisticas,
    AuditoriaContadores
} from '../types/auditoria';

export const auditoriaService = {
    // Obtener todos los registros
    async listarTodos(): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>('/auditoria');
        return response.data;
    },

    // Obtener registros recientes
    async listarRecientes(): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>('/auditoria/recientes');
        return response.data;
    },

    // Buscar por tabla
    async buscarPorTabla(tablaNombre: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>(`/auditoria/tabla/${tablaNombre}`);
        return response.data;
    },

    // Buscar por tipo de evento
    async buscarPorEvento(eventoTipo: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>(`/auditoria/evento/${eventoTipo}`);
        return response.data;
    },

    // Buscar por registro específico
    async buscarPorRegistro(tablaNombre: string, registroId: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>(
            `/auditoria/registro/${tablaNombre}/${registroId}`
        );
        return response.data;
    },

    // Buscar por usuario
    async buscarPorUsuario(usuarioId: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>(`/auditoria/usuario/${usuarioId}`);
        return response.data;
    },

    // Buscar por rango de fechas
    async buscarPorFechas(desde: string, hasta: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>('/auditoria/fechas', {
            params: { desde, hasta }
        });
        return response.data;
    },

    // Buscar por usuario y fechas
    async buscarPorUsuarioYFecha(usuarioId: string, desde: string, hasta: string): Promise<AuditoriaResponse[]> {
        const response = await api.get<AuditoriaResponse[]>(`/auditoria/usuario-fechas/${usuarioId}`, {
            params: { desde, hasta }
        });
        return response.data;
    },

    // Obtener registro por ID
    async obtenerPorId(id: number): Promise<AuditoriaResponse> {
        const response = await api.get<AuditoriaResponse>(`/auditoria/${id}`);
        return response.data;
    },

    // Obtener estadísticas
    async obtenerEstadisticas(): Promise<AuditoriaEstadisticas> {
        const response = await api.get<AuditoriaEstadisticas>('/auditoria/estadisticas');
        return response.data;
    },

    // Obtener contadores por tipo de evento
    async obtenerContadores(): Promise<AuditoriaContadores> {
        const response = await api.get<AuditoriaContadores>('/auditoria/contadores');
        return response.data;
    },

    // Limpiar registros antiguos
    async limpiarRegistrosAntiguos(fechaLimite: string): Promise<void> {
        await api.delete('/auditoria/limpiar', {
            params: { fechaLimite }
        });
    },

    // Buscar con filtros combinados
    async buscarConFiltros(filtros: AuditoriaFiltros): Promise<AuditoriaResponse[]> {
        const params = new URLSearchParams();

        if (filtros.tabla) params.append('tabla', filtros.tabla);
        if (filtros.evento) params.append('evento', filtros.evento);
        if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
        if (filtros.desde) params.append('desde', filtros.desde);
        if (filtros.hasta) params.append('hasta', filtros.hasta);

        const response = await api.get<AuditoriaResponse[]>(`/auditoria/buscar?${params.toString()}`);
        return response.data;
    }
};