export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    nombre: string;
    roles: string[];
}

export interface AuthState {
    token: string | null;
    user: {
        email: string;
        nombre: string;
        roles: string[];
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}