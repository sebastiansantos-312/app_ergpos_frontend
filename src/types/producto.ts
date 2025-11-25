export interface ProductoRequest {
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    codigoCategoria?: string;
    precio: number;
    stockMinimo?: number;
    stockActual?: number;
    unidadMedida?: string;
}

export interface ProductoResponse {
    id: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoriaId?: string;
    categoriaNombre?: string;
    precio: number;
    stockMinimo: number;
    stockActual: number;
    unidadMedida: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}