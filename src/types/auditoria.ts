
export interface AuditoriaResponse {
    id: number;
    eventoTipo: 'INSERT' | 'UPDATE' | 'DELETE';
    tablaNombre: string;
    registroId: string;
    usuarioId: string;
    detalle: string;
    createdAt: string;
}

export interface AuditoriaFiltros {
    tabla?: string;
    evento?: string;
    usuarioId?: string;
    desde?: string;
    hasta?: string;
}

export interface AuditoriaEstadisticas {
    total: number;
    recientes: number;
}

export interface AuditoriaContadores {
    total: number;
    insert: number;
    update: number;
    delete: number;
}