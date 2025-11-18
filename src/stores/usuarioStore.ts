import { create } from 'zustand';
import { usuarioService } from '../services/usuarioService';
import type { Usuario, UsuarioRequest, UsuarioUpdateRequest, CambiarPasswordRequest } from '../types';

interface UsuarioState {
    usuarios: Usuario[];
    usuarioSeleccionado: Usuario | null;
    isLoading: boolean;
    error: string | null;
}

interface UsuarioActions {
    // Getters
    fetchUsuarios: () => Promise<void>;
    fetchUsuariosActivos: () => Promise<void>;
    fetchUsuariosInactivos: () => Promise<void>;
    fetchUsuarioByCodigo: (codigo: string) => Promise<void>;
    fetchMiPerfil: () => Promise<void>;
    buscarUsuarios: (filtros: { nombre?: string; email?: string; departamento?: string; puesto?: string }) => Promise<void>;

    // CRUD
    crearUsuario: (usuario: UsuarioRequest) => Promise<void>;
    actualizarUsuario: (codigo: string, usuario: UsuarioUpdateRequest) => Promise<void>;
    activarUsuario: (email: string) => Promise<void>;
    desactivarUsuario: (email: string) => Promise<void>;
    cambiarPassword: (request: CambiarPasswordRequest) => Promise<void>;
    eliminarUsuario: (email: string) => Promise<void>;
    cambiarRoles: (email: string, roles: string[]) => Promise<void>;

    // Utils
    setUsuarioSeleccionado: (usuario: Usuario | null) => void;
    clearError: () => void;
}

export const useUsuarioStore = create<UsuarioState & UsuarioActions>((set) => ({
    // Estado inicial
    usuarios: [],
    usuarioSeleccionado: null,
    isLoading: false,
    error: null,

    // Acciones
    fetchUsuarios: async () => {
        set({ isLoading: true, error: null });
        try {
            const usuarios = await usuarioService.getUsuarios();
            set({ usuarios, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchUsuariosActivos: async () => {
        set({ isLoading: true, error: null });
        try {
            const usuarios = await usuarioService.getUsuariosActivos();
            set({ usuarios, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchUsuariosInactivos: async () => {
        set({ isLoading: true, error: null });
        try {
            const usuarios = await usuarioService.getUsuariosInactivos();
            set({ usuarios, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchUsuarioByCodigo: async (codigo: string) => {
        set({ isLoading: true, error: null });
        try {
            const usuario = await usuarioService.getUsuarioByCodigo(codigo);
            set({ usuarioSeleccionado: usuario, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchMiPerfil: async () => {
        set({ isLoading: true, error: null });
        try {
            const usuario = await usuarioService.getMiPerfil();
            set({ usuarioSeleccionado: usuario, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    buscarUsuarios: async (filtros) => {
        set({ isLoading: true, error: null });
        try {
            const usuarios = await usuarioService.buscarUsuarios(filtros);
            set({ usuarios, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    crearUsuario: async (usuario: UsuarioRequest) => {
        set({ isLoading: true, error: null });
        try {
            const nuevoUsuario = await usuarioService.createUsuario(usuario);
            set(state => ({
                usuarios: [...state.usuarios, nuevoUsuario],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    actualizarUsuario: async (codigo: string, usuario: UsuarioUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
            const usuarioActualizado = await usuarioService.updateUsuario(codigo, usuario);
            set(state => ({
                usuarios: state.usuarios.map(u =>
                    u.codigo === codigo ? usuarioActualizado : u
                ),
                usuarioSeleccionado: usuarioActualizado,
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    activarUsuario: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const usuarioActualizado = await usuarioService.activarUsuario(email);
            set(state => ({
                usuarios: state.usuarios.map(u =>
                    u.email === email ? usuarioActualizado : u
                ),
                usuarioSeleccionado: state.usuarioSeleccionado?.email === email
                    ? usuarioActualizado
                    : state.usuarioSeleccionado,
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    desactivarUsuario: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const usuarioActualizado = await usuarioService.desactivarUsuario(email);
            set(state => ({
                usuarios: state.usuarios.map(u =>
                    u.email === email ? usuarioActualizado : u
                ),
                usuarioSeleccionado: state.usuarioSeleccionado?.email === email
                    ? usuarioActualizado
                    : state.usuarioSeleccionado,
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    cambiarPassword: async (request: CambiarPasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
            await usuarioService.cambiarPassword(request);
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    eliminarUsuario: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            await usuarioService.deleteUsuario(email);
            set(state => ({
                usuarios: state.usuarios.filter(u => u.email !== email),
                usuarioSeleccionado: state.usuarioSeleccionado?.email === email
                    ? null
                    : state.usuarioSeleccionado,
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    cambiarRoles: async (email: string, roles: string[]) => {
        set({ isLoading: true, error: null });
        try {
            const usuarioActualizado = await usuarioService.cambiarRoles(email, roles);
            set(state => ({
                usuarios: state.usuarios.map(u =>
                    u.email === email ? usuarioActualizado : u
                ),
                usuarioSeleccionado: state.usuarioSeleccionado?.email === email
                    ? usuarioActualizado
                    : state.usuarioSeleccionado,
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    setUsuarioSeleccionado: (usuario: Usuario | null) => {
        set({ usuarioSeleccionado: usuario });
    },

    clearError: () => {
        set({ error: null });
    }
}));