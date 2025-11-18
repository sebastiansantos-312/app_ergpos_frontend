export interface UsuarioRequestDTO {
  nombre: string;
  email: string;
  password: string;
  codigo?: string;
  departamento?: string;
  puesto?: string;
  roles: string[];
}

export interface UsuarioResponseDTO {
  codigo: string;
  nombre: string;
  email: string;
  roles: string[];
  activo: boolean;
  departamento?: string;
  puesto?: string;
}

export interface CambiarPasswordRequestDTO {
  passwordActual: string;
  nuevoPassword: string;
}

export interface RolCambioRequestDTO {
  rolNombres: string[];
}

export interface UsuarioRolResponseDTO {
  nombre: string;
  email: string;
  roles: string[];
}