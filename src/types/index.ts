export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    user: User;
}

export interface User {
    id: string;
    codigo: string;
    email: string;
    nombre: string;
    roles: string[];
    activo: boolean;
    departamento?: string;
    puesto?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Usuario {
    id: string;
    codigo: string;
    nombre: string;
    email: string;
    activo: boolean;
    roles: string[];
    departamento?: string;
    puesto?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UsuarioRequest {
    codigo: string;
    nombre: string;
    email: string;
    password: string;
    departamento?: string;
    puesto?: string;
    roles: string[];
}

export interface UsuarioUpdateRequest {
    codigo?: string;
    nombre?: string;
    email?: string;
    departamento?: string;
    puesto?: string;
    roles?: string[];
}

export interface CambiarPasswordRequest {
    passwordActual: string;
    nuevoPassword: string;
}

export interface RolCambioRequest {
    roles: string[];
}

export interface Rol {
    id: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RolResponse {
    id: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CambiarPasswordRequestDTO {
    passwordActual: string;
    nuevoPassword: string;
}

export interface UsuarioResponseDTO {
    id: string;
    codigo: string;
    nombre: string;
    email: string;
    activo: boolean;
    roles: string[];
    departamento?: string;
    puesto?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RolResponseDTO {
    id: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}