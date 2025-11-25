export interface ProveedorRequest {
    nombre: string;     
    ruc?: string;       
    telefono?: string;   
    email?: string;      
    direccion?: string; 
}

export interface ProveedorResponse {
    id: string;
    nombre: string;
    ruc?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}