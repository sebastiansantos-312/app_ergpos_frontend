export interface ProductoRequestDTO {
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio: number;
}

export interface ProductoResponseDTO {
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    activo: boolean;
}

export interface ProductoEstadisticas {
    totalProductos: number;
    productosActivos: number;
    productosInactivos: number;
    porcentajeActivos: number;
}