// usuarioService.ts - CORREGIDO
import api from './api';
import type {
    Usuario,
    UsuarioRequest,
    UsuarioUpdateRequest,
    CambiarPasswordRequest
} from '../types';

export const usuarioService = {
    // Listar usuarios
    listarTodos: (): Promise<Usuario[]> =>
        api.get('/usuarios').then(res => res.data),

    listarActivos: (): Promise<Usuario[]> =>
        api.get('/usuarios/activos').then(res => res.data),

    listarInactivos: (): Promise<Usuario[]> =>
        api.get('/usuarios/inactivos').then(res => res.data),

    // CRUD usuarios
    crearUsuario: (usuario: UsuarioRequest): Promise<Usuario> =>
        api.post('/usuarios', usuario).then(res => res.data),

    actualizarUsuario: (codigo: string, usuario: UsuarioUpdateRequest): Promise<Usuario> =>
        api.put(`/usuarios/${codigo}`, usuario).then(res => res.data),

    desactivarUsuario: (email: string): Promise<Usuario> =>
        api.put(`/usuarios/email/${email}/desactivar`).then(res => res.data),

    activarUsuario: (email: string): Promise<Usuario> =>
        api.put(`/usuarios/email/${email}/activar`).then(res => res.data),

    // Perfil y contraseña
    obtenerMiPerfil: (): Promise<Usuario> =>
        api.get('/usuarios/me/perfil').then(res => res.data),

    obtenerPorCodigo: (codigo: string): Promise<Usuario> =>
        api.get(`/usuarios/codigo/${codigo}`).then(res => res.data),

    cambiarPassword: (request: CambiarPasswordRequest): Promise<void> =>
        api.put('/usuarios/me/cambiar-password', request).then(res => res.data),

    // Búsqueda
    buscarUsuarios: (filters: {
        nombre?: string;
        email?: string;
        departamento?: string;
        puesto?: string;
    }): Promise<Usuario[]> =>
        api.get('/usuarios/buscar', { params: filters }).then(res => res.data),

    // Roles - CORREGIDO: eliminar RolCambioRequest y usar directamente
    cambiarRoles: (email: string, roles: string[]): Promise<Usuario> =>
        api.put(`/usuarios/${email}/roles`, { roles }).then(res => res.data),
};