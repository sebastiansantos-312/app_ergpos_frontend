// src/stores/usuarioStore.ts
import { create } from 'zustand';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponse } from '../types/usuario';

interface UsuarioState {
    usuarios: UsuarioResponse[];
    isLoading: boolean;
    error: string | null;
    cargarUsuarios: (filtros?: any) => Promise<void>;
    agregarUsuario: (usuario: UsuarioResponse) => void;
    actualizarUsuario: (email: string, usuario: UsuarioResponse) => void;
    eliminarUsuario: (email: string) => void;
    clearError: () => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
    usuarios: [],
    isLoading: false,
    error: null,

    cargarUsuarios: async (filtros = {}) => {
        set({ isLoading: true, error: null });
        try {
            const usuarios = await usuarioService.listar(filtros);
            set({ usuarios, isLoading: false });
        } catch (error: any) {
            console.error('Error cargando usuarios:', error); 
            set({
                error: error.response?.data?.message || 'Error cargando usuarios',
                isLoading: false
            });
        }
    },

    agregarUsuario: (usuario) => {
        set((state) => ({
            usuarios: [...state.usuarios, usuario]
        }));
    },

    actualizarUsuario: (email, usuarioActualizado) => {
        set((state) => ({
            usuarios: state.usuarios.map(usuario =>
                usuario.email === email ? usuarioActualizado : usuario
            )
        }));
    },

    eliminarUsuario: (email) => {
        set((state) => ({
            usuarios: state.usuarios.filter(usuario => usuario.email !== email)
        }));
    },

    clearError: () => set({ error: null }),
}));