// Login Request
export interface LoginRequest {
    username: string;  
    password: string;
}

// Login Response  
export interface LoginResponse {
    token: string;
    usuarioId: string;  
    codigo: string;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
}

// User Info (para /auth/me)
export interface UserInfo {
    codigo: string;
    id: string;
    nombre: string;
    email: string;
    rol: string;
    modules: string[];
    activo: boolean;
}

// Auth State
export interface AuthState {
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null;
}