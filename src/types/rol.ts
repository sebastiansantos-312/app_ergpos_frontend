export interface RolRequest {
    nombre: string;  
}

export interface RolResponse {
    id: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}