export interface CategoriaRequest {
    nombre: string;    
    codigo?: string; 
}

export interface CategoriaResponse {
    id: string;
    nombre: string;
    codigo?: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}