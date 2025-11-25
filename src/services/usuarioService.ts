import api from './api';
import type {
    UsuarioCreateRequest,
    UsuarioUpdateRequest,
    UsuarioResponse,
    CambiarPasswordRequest
} from '../types/usuario';

// ✅ Interfaz para los parámetros de filtrado
interface UsuarioFiltros {
    nombre?: string;
    email?: string;
    rol?: string;
    activo?: boolean;
}

export const usuarioService = {
    // ✅ CORREGIDO: Ahora acepta todos los filtros que el backend espera
    listar: async (params?: UsuarioFiltros) => {
        const { data } = await api.get<UsuarioResponse[]>('/usuarios', { params });
        return data;
    },

    // Obtener usuario por email
    obtenerPorEmail: async (email: string) => {
        const { data } = await api.get<UsuarioResponse>(`/usuarios/${email}`);
        return data;
    },

    // Crear usuario
    crearUsuario: async (usuario: UsuarioCreateRequest) => {
        const { data } = await api.post<UsuarioResponse>('/usuarios', usuario);
        return data;
    },

    // Actualizar usuario
    actualizarUsuario: async (email: string, usuario: UsuarioUpdateRequest) => {
        const { data } = await api.put<UsuarioResponse>(`/usuarios/${email}`, usuario);
        return data;
    },

    // Activar usuario
    activarUsuario: async (email: string) => {
        const { data } = await api.patch<UsuarioResponse>(`/usuarios/${email}/activar`);
        return data;
    },

    // Desactivar usuario
    desactivarUsuario: async (email: string) => {
        const { data } = await api.patch<UsuarioResponse>(`/usuarios/${email}/desactivar`);
        return data;
    },

    // Cambiar contraseña
    cambiarPassword: async (email: string, passwords: CambiarPasswordRequest) => {
        const { data } = await api.patch(`/usuarios/${email}/cambiar-password`, passwords);
        return data;
    },
};