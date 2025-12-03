export interface UsuarioCreateRequest {
    nombre: string;
    email: string;
    password: string;
    codigo?: string;
    nombreRol: string;
}

export interface UsuarioUpdateRequest {
    nombre: string;
    email: string;
    password?: string;
    codigo?: string;
    rol: string;
}

export interface UsuarioRequest {
    nombre: string;
    email: string;
    password: string;
    codigo?: string;
    nombreRol: string;
}

export interface UsuarioResponse {
    id: string;
    codigo: string;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CambiarPasswordRequest {
    passwordActual: string;
    nuevoPassword: string;
}